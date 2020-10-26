///////////////////////////////
//      Group 9 - SERP       //
///////////////////////////////

// Setup requirements
const express = require('express');
const fs = require('fs');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require("path");
const https = require("https");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const { send } = require('process');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/graphs', express.static("graphs"));
app.use('/popsim', express.static("pages/popsim2.html"));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    genid: function(req){
        return uuidv4();
    },
    cookie: { secure: true }
  }));
module.exports = app;

// Python Epidemic Model
var {spawn} = require("child_process");
var modelProcess = spawn("python3", ["../Epedemic\ Modelling/ModelWebSock-Server.py"]);
function stopModel(){ modelProcess.kill(); }

//////////////////////////////
//      SERVER ROUTES       //
//////////////////////////////

var serverInit = false;

// Run pop simulation (S1 Program)
app.post("/popsim", function(req, res){   
    var cmd = ["../Population Simulation/Program/popsim.py", "-i", "../Population Simulation/Program/test_data/test1.csv", "-nd", "-s", "graphs/image"]

    // Duration Value
    if(req.body.duration != ""){
        cmd.push("-d");
        cmd.push(req.body.duration);
    }

    // Starting Population
    if(req.body.population != ""){
        cmd.push("-p");
        cmd.push(req.body.population);
    }

    // Labels
    if(req.body.labels == "on") cmd.push("-l");

    // Use Truth
    if(req.body.usetruth == "on") cmd.push("-ut");

    // No displayed truth
    if(req.body.nodisplayedtruth == "on") cmd.push("-ndt");

    // Age groups
    if(req.body.agegroups == "on") cmd.push("-ag");

    // Age Ratios
    if(req.body.ageratio1 != "" && req.body.ageratio2 != ""  && req.body.ageratio3 != ""){
        cmd.push("-ar");
        cmd.push(req.body.ageratio1);
        cmd.push(req.body.ageratio2);
        cmd.push(req.body.ageratio3);
    }

    var process = spawn("python3", cmd);
    process.on('exit', function() {
        res.status(200);
        var out = "<img src=/graphs/" + "image" + ".png width=80%>";
        res.send(out);
    });
});

// Epidemic Modeling Tool Interface and Communication
const pythonWebsocketAddr = "ws://localhost:8002";
var contentstate = [new Date, { status: "notset" }];

// Index Route
app.get('/', function(req, res){
    res.redirect("/student");
});

app.get('/load', function(req, res){
    res.sendFile(path.join(__dirname + "/pages/load.html"));
});

app.get("/instructor", function(req, res){
    res.set("Cache-Control", "no-store");
    if(serverInit){
        res.sendFile(path.join(__dirname + "/pages/instructor.html"));
    } else {
        res.sendFile(path.join(__dirname + "/pages/setup.html"));
    }
});

// Setup student and policy Cells
var studentCells = [];
var listPolicies = [];

// Initialise simulation
app.post("/init", function(req, res){

    var setup = new Object();
    setup.control = "initApp";
    setup.timestep = parseInt(req.body.sim.timeStep);
    setup.duration = parseInt(req.body.sim.simulationDays);
    setup.cells = [];
    setup.policies = [];

    for(var i = 0; i < req.body.cells.length; i++){
        var currentCell = new Object();

        currentCell.name = req.body.cells[i].cellName;
        currentCell.population = parseInt(req.body.cells[i].population);
        currentCell.exposed = parseInt(req.body.cells[i].initalE);
        currentCell.infected = parseInt(req.body.cells[i].initalI);
        currentCell.recovered = parseInt(req.body.cells[i].initalR);
        currentCell.deaths = parseInt(req.body.cells[i].initalD);
        currentCell.beta = parseFloat(req.body.cells[i].infectionRate);
        currentCell.sigma = parseFloat(req.body.cells[i].incubationRate);
        currentCell.gamma = parseFloat(req.body.cells[i].recoveryRate);
        currentCell.mu = parseFloat(req.body.cells[i].deathRate);
        currentCell.x = parseFloat(req.body.cells[i].returnToSusceptibility);
        
        setup.cells.push(currentCell);

        // Generate Student Cells
        var student = new Object();
        student.cellName = req.body.cells[i].cellName;
        student.accessCode = genAccessCode();
        student.claimed = false;
        student.studentName = "";
        studentCells.push(student);

        // Setup cell policies
        var cell = new Object();
        cell.name = req.body.cells[i].cellName;
        cell.policies = [];
        for(var j=0; j < req.body.policies.length; j++){            
            var policy = new Object();
            policy.policyName = req.body.policies[j].policyName;
            policy.policyAvailable = false;
            policy.policyEnabled = false;
            policy.policyConform = parseFloat(req.body.policies[j].complianceMultiplier)  + Math.random();
            cell.policies.push(policy);
        }
        listPolicies.push(cell);
    }

    for(var i = 0; i < req.body.policies.length; i++){
        var currentPolicy = new Object();
        currentPolicy.name = req.body.policies[i].policyName;
        currentPolicy.betaMult = parseFloat(req.body.policies[i].infectionMultiplier);
        currentPolicy.sigmaMult = parseFloat(req.body.policies[i].incubationMultiplier);
        currentPolicy.gammaMult = parseFloat(req.body.policies[i].recoveryMultiplier);
        currentPolicy.muMult = parseFloat(1);
        currentPolicy.xMult = parseFloat(req.body.policies[i].susceptibilityMultiplier);
        currentPolicy.adherence = parseFloat(req.body.policies[i].complianceMultiplier);

        setup.policies.push(currentPolicy);
    }

    sendCommand({control: "reset"});
    sendCommand(setup);
    serverInit = true;
    res.redirect("/instructor");
});

// Policy Availablity Control
app.post("/policyAvailability", function(req, res){
    for(var i = 0; i < req.body.data.length; i++){
        for(var j = 0; j < listPolicies.length; j++){
            listPolicies[j].policies[i].policyAvailable = (req.body.data[i] == "true");
            if(listPolicies[j].policies[i].policyAvailable  == false){ listPolicies[j].policies[i].policyEnabled = false; }
        }
    }
    res.send();
});

// 
app.post("/policyChanges", function(req, res){
    for(var i = 0; i < req.body.policies.length; i++){
        if(listPolicies[req.body.cell].policies[i].policyAvailable){
            listPolicies[req.body.cell].policies[i].policyEnabled = (req.body.policies[i].enabled == "true");
        } else {
            listPolicies[req.body.cell].policies[i].policyEnabled = false;
        }
        listPolicies[req.body.cell].policies[i].policyConform = parseFloat(req.body.policies[i].conform);
    }
    res.send();
})

// Generate unique 4 char student access code
function genAccessCode(){
    while(true){
        var accessCode = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4).toUpperCase();
        var found = false;
        for(var i = 0; i < studentCells.length; i++){
            if(accessCode == studentCells[i].accessCode) found = true;
        }
        if(!found) return accessCode;
    }
}

// Student Session
app.get("/student/:id", function(req, res){
    res.set("Cache-Control", "no-store");
    var found = false;
    for(var i = 0; i < studentCells.length; i++){
        if(studentCells[i].uuid == req.session.id && studentCells[i].accessCode == req.params.id){
            found = true;
            break;
        }
    }
    
    if(!found){
        res.redirect("/student?loginerror=fail");
    } else {
        res.sendFile(path.join(__dirname + "/pages/student.html"));
    }
});

// Student Login Handler
app.get("/student", function(req, res){
    res.set("Cache-Control", "no-store");
    var found = false;
    for(var i = 0; i < studentCells.length; i++){
        if(studentCells[i].uuid == req.session.id){
            res.redirect("/student/" + studentCells[i].accessCode);
            found = true;
            break;
        }
    }    
    if(!found){
        res.sendFile(path.join(__dirname + "/pages/student-login.html"));
    }
});

// Student Login Request Handler
app.post("/student", function(req, res){
    res.set("Cache-Control", "no-store");

    var found = false;
    for(var i = 0; i < studentCells.length; i++){
        if(studentCells[i].accessCode == req.body.inputCode){
            if (studentCells[i].claimed){
                break;
            } else {
                found = true;
                studentCells[i].studentName = req.body.inputName;
                studentCells[i].claimed = true;
                studentCells[i].uuid = req.session.id;
                break;
            }
        }
    }

    if(found){
        res.redirect("/student/" + req.body.inputCode);
    } else {
        res.redirect("/student?loginerror=fail");
    }    
});

// Student Logoff
app.post("/student/logoff", function(req, res){
    console.log("Logoff user: " + req.body.accessCode);

    for(var i = 0; i < studentCells.length; i++){
        if(studentCells[i].accessCode == req.body.accessCode){
            studentCells[i].uuid = "";
            studentCells[i].claimed = false;
            studentCells[i].studentName = "";
            break;
        }
    }

    res.status(200);
    res.send();
});

// Temp List of student Access Codes
app.get("/accessCodes", function(req, res){
    var output = "";
    for(var i = 0; i < studentCells.length; i++){
        output += "<strong>" + studentCells[i].cellName + ":</strong> " + studentCells[i].accessCode;
        if(studentCells[i].claimed) output += " - Claimed By: " + studentCells[i].studentName;
        output += "<br />"
    }
    if(studentCells.length == 0) output = "No codes assigned";
    res.send(output);
});

app.get("/accessCodes.json", function(req, res){
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(studentCells));
});

app.use("/scripts", express.static("pages/scripts"));
app.use("/stylesheets", express.static("pages/stylesheets"));
app.use("/images", express.static("pages/images"));




// TESTING function calls between python model and nodejs
app.get("/model.json", function(req, res){

    // Only allow for update check if current status is older that 10 seconds
    if((new Date() - contentstate[0]) > 10000 || contentstate[1]["status"] == "notset"){
        updateCells();
    }
    var temp = contentstate[1];
    temp.time = contentstate[0];
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(temp));
});

// Make call to Python Model to update cells
function updateCells(){
    const wsc = new WebSocket(pythonWebsocketAddr);
    wsc.on("open", function(){
        wsc.send(JSON.stringify({control: "getAllCells"}));
        wsc.on("message", function(inmsg){
            wsc.close(1000);
            contentstate = [new Date(), JSON.parse(inmsg)]
        });
    });
}

// Function to send command to python model
function sendCommand(input){
    const wsc = new WebSocket(pythonWebsocketAddr);
    wsc.on("open", function(){
        wsc.send(JSON.stringify(input));
        wsc.on("message", function(inmsg){
            wsc.close(1000);
            updateCells();
        });
    });
}

// Next Step and Next Step X
app.get("/nextStep", function(req, res){
    sendCommand({control: "nextStep", cells: stepPolicies()});
    res.send("Command Sent");
});
app.get("/nextStep/:x", function(req, res){
    sendCommand({control: "nextStep", timestep: req.params.x, cells: stepPolicies()});
    res.send("Command Sent");
});
function stepPolicies(){
    var out = [];
    for(var i = 0; i < listPolicies.length; i++){
        var obj = new Object();
        obj.name = listPolicies[i].name;
        obj.policies = [];
        for(var j = 0; j < listPolicies[i].policies.length; j++){
            if(listPolicies[i].policies[j].policyEnabled){
                var obj2 = new Object();
                obj2.policyId = j;
                obj2.policyName = listPolicies[i].policies[j].policyName;
                obj2.adherence = listPolicies[i].policies[j].policyConform;
                obj.policies.push(obj2);
            }
        }
        if(obj.policies.length != 0){out.push(obj);}
    }
    return out;
}

// reset Model
app.get("/reset", function(req, res){
    reset();
    res.send("Command Sent");
})

function reset(){
    sendCommand({control: "reset"});
    serverInit = false;
    studentCells = [];
    listPolicies = [];
}

// Policies return
app.get("/policies.json", function(req, res){
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(listPolicies));
});


// 404 error handler
app.get('*', function(req, res){
    console.log("404");
    console.log("-> " + req.url)
    res.status(404).send("Page not found");
});



////////////////////////////////////////////
//      Start Server & Manage Certs       //
////////////////////////////////////////////

// Handle SSL Certificate
var key = "server.key"
var cert = "server.cert"
var port = process.env.PORT || 3000;
if(fs.existsSync(path.resolve("/etc/letsencrypt/live/remote.joshuawright.tech/privkey.pem"))){
    key = "/etc/letsencrypt/live/remote.joshuawright.tech/privkey.pem";
    cert = "/etc/letsencrypt/live/remote.joshuawright.tech/cert.pem";
}
https.createServer({
    key: fs.readFileSync(key),
    cert: fs.readFileSync(cert)
}, app).listen(port, function(){
    console.log('Listening on: ' + port);
})

// Kill python subprocess on program close
process.on("exit", stopModel);