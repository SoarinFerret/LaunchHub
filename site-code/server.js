// set up
var express = require('express');
var app = express();

// configuration
app.use(express.static(__dirname));

// listener
app.listen(8080);
console.log("App listening on port 8080");