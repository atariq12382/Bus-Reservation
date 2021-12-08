//modules that are used
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers');
const { forwardAuthenticated } = require('../config/autherization');

//login Page
router.get('/login', forwardAuthenticated, userController.login);
//register Page
router.get('/register',forwardAuthenticated, userController.register);
//ForgotPassword Page
router.get('/ForgotPassword', forwardAuthenticated, userController.forgotPassword);
//ChangePassword Page
router.get('/ChangePassword', forwardAuthenticated, userController.ChangePasswordP)


//register
router.post('/register', userController.registerUser);
//login
router.post('/login', userController.loginUser);
//logout
router.get('/logout', userController.logout);
//send-email
router.post('/email-send', userController.emailSend);
//change-pass
router.post('/change-password', userController.changePassword);

module.exports = router;