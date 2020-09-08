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
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/graphs', express.static("graphs"));
app.use('/popsim', express.static("pages/popsim2.html"));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

//////////////////////////////
//      SERVER ROUTES       //
//////////////////////////////

// Index Route
app.get('/', function(req, res){
    res.redirect("/popsim");
});

// Run pop simulation
app.post("/popsim", function(req, res){
    var {spawn} = require("child_process");    
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
        cmd.push(eq.body.ageratio1);
        cmd.push(eq.body.ageratio2);
        cmd.push(eq.body.ageratio3);
    }

    var process = spawn("python3", cmd);
    process.on('exit', function() {
        res.status(200);
        out = "<img src=/graphs/" + "image" + ".png width=80%>";
        res.send(out);
    });
});

// 404
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
