const express = require('express');
const passwordRoute = express.Router();
const controller = require('../controller/changepass');
const isAuthenticated = require('../Modules/isAuth');

// Route for forget password form

passwordRoute.get('/forgotform', controller.forgotpaForm);
passwordRoute.post('/forgotform', controller.otpGenerate);


// Route for OTP form
passwordRoute.get('/otpForm', controller.otpForm);
passwordRoute.post('/otpForm/:userId', controller.verifyOTP);

// change pass
passwordRoute.get('/forgotPassword/:userId', controller.forgotpassForm);
passwordRoute.post('/forgotPassword/:userId', controller.forgotpasslogic);




module.exports = passwordRoute;
