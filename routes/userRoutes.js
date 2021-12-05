//modules that are used
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers');
const { forwardAuthenticated } = require('../config/autherization');

//login Page
router.get('/login', forwardAuthenticated, userController.login);
//register Page
router.get('/register',forwardAuthenticated, userController.register);
//register
router.post('/register', userController.registerUser);
//login
router.post('/login', userController.loginUser);
//logout
router.get('/logout', userController.logout);


module.exports = router;