/** NOTE:
 * 
 * This file implements all standard restful approaches:
 * 
 *  get/post/put/patch/delete
 *  
 * For the purposes of this project, put/patch are treated equally.
 *  
 * Login/Register routes were setup to reply on Post Body data rather then 
 * appending them to the URL. This was an intentional choice, as they are
 * likely already coming from form fields and this would require less
 * javascript on the front to rebuild a URL to accomodate them.
 * 
 * Probably.
 * 
 */

"use strict";

//Require our configuration file
var config = require('../../config/config');
// Load our other NPM Modules
const express = require('express');
const router = express.Router();
// Load custom modules
const utilities    = require('../lib/utilities');
const userService  = require('../services/userService');
const taskService  = require('../services/taskService-v2');

// User Functions
router.post(   '/user/login',    userService.login);
router.post(   '/user/register', userService.create);
/*
    router.get(    '/user/:userId',          userService.request);
    router.patch(  '/user/:userId/update',   userService.update);
    router.put(    '/user/:userId/update',   userService.update);
    router.delete( '/user/:userId/delete',   userService.delete);
*/

// Task Functions
router.get(    '/task/:taskId', taskService.requestOne);
router.get(    '/tasks',        taskService.requestMany);
router.post(   '/task',         taskService.create);
router.put(    '/task/:taskId', taskService.update);
router.patch(  '/task/:taskId', taskService.update);
router.delete( '/task/:taskId', taskService.delete);

//Default Handling, returns 404
router.get(    '/', utilities.noDetails);

module.exports = router;