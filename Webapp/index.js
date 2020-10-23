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
    res.sendFile(path.join(__dirname + "/pages/root.html"));
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

// Setup student Cells
var studentCells = [];

// Initialise simulation
app.post("/init", function(req, res){

    var setup = new Object();
    setup.control = "initApp";
    setup.timestep = parseInt(req.body.sim.timeStep);
    setup.duration = parseInt(req.body.sim.simulationDays);
    setup.cells = [];

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
    }
    
    console.log(studentCells);

    sendCommand({control: "reset"});
    sendCommand(setup);
    serverInit = true;
    res.redirect("/instructor");
});

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

// Student Login Handler
app.get("/student", function(req, res){
    res.set("Cache-Control", "no-store");
    res.sendFile(path.join(__dirname + "/pages/student-login.html"));
});

// Student Login Request Handler
app.post("/student", function(req, res){
    res.set("Cache-Control", "no-store");

    var found = false;
    for(var i = 0; i < studentCells.length; i++){
        if(studentCells[i].accessCode == req.body.inputCode){
            found = true;
            studentCells[i].studentName = req.body.inputName;
            break;
        }
    }

    if(found){
        res.send("Success");
    } else {
        res.redirect("/student?loginerror=fail");
    }    
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
    sendCommand({control: "nextStep"});
    res.send("Command Sent");
});
app.get("/nextStep/:x", function(req, res){
    sendCommand({control: "nextStep", timestep: req.params.x});
    res.send("Command Sent");
});

// reset Model
app.get("/reset", function(req, res){
    sendCommand({control: "reset"});
    serverInit = false;
    res.send("Command Sent");
})


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