"use strict";

//Require our configuration file
var config = require('../config/config');
//Load our other NPM Modules
const express = require('express');
var http = require('http');
// Load custom modules
const routerv1  = require('./routes/router-v1');
const routerv2  = require('./routes/router-v2');

// Setup the Express App
const app = express();

// Version Handling
app.use('/v1', routerv1);
app.use('/v2', routerv2);
app.use('/', routerv2); // Set the default version to latest.

//Setup server.
http.createServer(app).listen(config.express.port, function () {
  // Spit out a startup line
  console.log("Express Server Booted on Port #" + config.express.port);
});