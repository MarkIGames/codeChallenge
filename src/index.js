"use strict";

//Require our configuration file
var config = require('../config/config');
// Load our other Modules
const express = require('express');
const router  = require('./router');

const app = express();
const port = 3000;

app.use('/', router)