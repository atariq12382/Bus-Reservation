//modules that will be used
const bcrypt = require("bcryptjs");
const passport = require("passport");
const mongoose = require("mongoose");

//User Model
const User = require("../models/userModel");
//otp Model
const Otp = require("../models/otp");

//show login page function
exports.login = (req, res) => 
    res.render("login", { user: req.user, layout: "layouts/layout" });

//show register page function
exports.register = (req, res) => 
    res.render("register", { user: req.user, layout: "layouts/layout" });

//show forgotpassword page
exports.forgotPassword = (req, res) =>
    res.render("ForgotPassword", { user: req.user, layout: "layouts/layout" });

//show forgotpassword page
exports.ChangePasswordP = (req, res) =>
    res.render("ChangePassword", { user: req.user, layout: "layouts/layout" });

//function to register a user.
exports.registerUser = (req, res) => {
    let error = [];
    const { name, email, password, contact, address } = req.body;
    if(!name || !email || !password || !contact || !address)
    {
        error.push({ msg: "Enter data in all the fields." });
    }
    if(password.length < 6) 
    {
        error.push({ msg: "Length of the Password must be atleast 6 characters." });
    }
    if(error.length > 0)
    {
       res.render("register",{ error, name, email, password, contact, address });
        res.status(400).json();
    }
    else
    {
        User.findOne({ email: email }).then(user => {
            if(user)
            {
                error.push({ msg: "Email already exists" });
                res.render("login",{ error, name, email, password, contact, address });
                res.status(400).json();
            }
            else
            {
                const newUser = new User({ name, email, password, contact, address });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser
                        .save()
                        .then(user => {
                            req.flash(
                                "success_msg",
                                "You have been registered, now you can login."
                            );
                            res.redirect("/users/login");
                            res.status(200).json();
                        })
                        .catch(err => console.log(err));
                    });
                });
            }
        });
    }
};

//function to login a user.
exports.loginUser = (req, res, next) => {
    passport.authenticate('local',{
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
};

//function to logout a user.
exports.logout = (req, res, next) => {
    req.logout();
    req.flash("success_msg", "You have been logged out.");
    req.session.destroy();
    res.redirect("/");
};

//function to send email
exports.emailSend = async (req, res) => {
    let data = await User.findOne({email: req.body.email});
    let successes = [];
    const emailc = req.body.email;
    if(data)
    {
        let otpcode = Math.floor((Math.random()*10000)+1);
        let otpdata = new Otp({
            email: req.body.email,
            code: otpcode,
            expireIn: new Date().getTime() + 300*1000
        })
        let otpResponse = await otpdata.save();
        mailer(req.body.email,otpcode);
        successes.push({ msg: "Please Check Your Email for OTP." });
        res.render("ChangePassword", { successes, emailc, layout: "layouts/layout" });
    }
    else
    {
        req.flash("error_msg", "Email Not Found.");
        res.redirect("/users/ForgotPassword");
    }
};

//function to change password
exports.changePassword = async (req,res)=>{
    let data = await Otp.find({email:req.body.email,code:req.body.otpCode});
    let error = [];
    if(data)
    {
        let currentTime = new Date().getTime();
        let diff = data.expireIn - currentTime;
        if(diff < 0)
        {
            error.push({ msg: "Token Expired" });
            res.render("ForgotPassword", { error });
        }
        else
        {
            let user = await User.findOne({ email: req.body.email })
            user.password = req.body.password;
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if(err) throw err;
                    user.password = hash;
                    user
                    .save()
                    .then(user => {
                        req.flash(
                            "success_msg",
                            "Your Password has been changed."
                        );
                        res.redirect("/users/login");
                        res.status(200).json();
                    })
                    .catch(err => console.log(err));
                });
            });
        }
    }
    else
    {
        req.flash(
            "error_msg",
            "Incorrect OTP or Email."
        );
        res.redirect("/email-send");
    }
};

//function for mailer
const mailer = (email,otp)=>{
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: 'daewoobs10@gmail.com',
            pass: 'BusService10'
        }
    });
    var mailOptions = {
        from: 'daewoobs10@gmail.com',
        to: email,
        subject: 'Reset Password',
        text: 'To reset your Daewoo Bus Service Account use this OTP ' + otp + '  Please enter it within 3 minutes.'
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error)
        {
            console.log(error);
        }
        else
        {
            console.log('Email Sent: ' + info.response);
        }
    });
}