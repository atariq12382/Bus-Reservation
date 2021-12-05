//modules that will be used
const bcrypt = require("bcryptjs");
const passport = require("passport");

//User Model
const User = require("../models/userModel");

//show login page function
exports.login = (req, res) => 
    res.render("login", { user: req.user, layout: "layouts/layout" });

//show register page function
exports.register = (req, res) => 
    res.render("register", { user: req.user, layout: "layouts/layout" });

//function to register a user.
exports.registerUser = (req, res) => {
    let error = [];
    const { name, email, password, contact, address } = req.body;
    if(!name || !email || !password || !contact || !address)
    {
        error.push({ msg: "Entter data in all the fields." });
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
                res.render("register",{ error, name, email, password, contact, address });
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