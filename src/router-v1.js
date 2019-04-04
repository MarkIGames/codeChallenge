"use strict";

//Require our configuration file
var config = require('../config/config');
// Load our other NPM Modules
const express = require('express');
const router = express.Router();
// Load custom modules
const utilities       = require('./lib/utilities');
const userController  = require('./controllers/userController');
const taskController  = require('./controllers/taskController-v2');

// User Functions
router.get(    '/login',    userController.request);
router.post(   '/login',    userController.create);
router.put(    '/register', userController.replace);
router.patch(  '/login',    userController.update);
router.delete( '/register', userController.delete);

// Task Functions
router.get(    '/login',    taskController.request);
router.post(   '/login',    taskController.create);
router.put(    '/register', taskController.replace);
router.patch(  '/login',    taskController.update);
router.delete( '/register', taskController.delete);

//Default Handling, returns 404
router.get(    '/', utilities.noDetails);

module.exports = router;