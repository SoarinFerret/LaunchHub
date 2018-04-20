// set up
var express = require('express');
var path = require('path');

var app = express();

// configuration
app.use(express.static(path.join(__dirname, 'public')));

// listener
app.listen(8080);
console.log("App listening on port 8080");
