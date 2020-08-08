// Setup requirements
const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.static("public"));


// Index Route
app.get('/', function(req, res){
    res.send("This site is currently under development");
});

// 404
app.get('*', function(req, res){
    console.log("404");
    console.log("-> " + req.url)
    res.status(404).send("Page not found");
});

// Start Server
port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Listening on: ' + (process.env.PORT || 3000))
})
