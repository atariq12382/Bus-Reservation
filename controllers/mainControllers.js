const mongoose = require("mongoose");
const Complaint = require("../models/complaints");
const Routes = require("../models/routes");

exports.SaveComplaints = (req, res) => {
    let error = [];
    const { title, name, contact, email, details } = req.body;
    if(!title || !name || !contact || !email || !details)
    {
        error.push({ msg: "Enter data in all the fields"});
    }
    if(error.length > 0)
    {
        res.render("complaints", {error, title, name, contact, email, details});
    }
    else
    {
        const newComplaint = new Complaint({ title, name, contact, email, details });
        newComplaint
        .save()
        .then(complaint => {
            req.flash(
                "success_msg",
                "Thank you for the Feedback. We appriciate it a lot."
            );
            res.redirect("/complaints");
            res.status(200).json();
        })
        .catch(err => console.log(err));
    }
}

exports.ShowSchedule = async (req, res) => {
   var perPage = 7;
   var page = req.params.page || 1;
   Routes
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, routes) {
            Routes.count().exec(function(err, count) {
                if(err) return next(err)
                res.render("schedule",{ routes: routes, user: req.user, current: page, pages: Math.ceil(count/perPage), isLoggedIn: req.isLogged, layout: "layouts/layout" });
            })
        })

};

exports.ShowScheduleFrom = async (req, res) => {
    var perPage = 5;
    var page = req.params.page || 1;
    var from = req.params.from;
    Routes
         .find({ from: from })
         .skip((perPage * page) - perPage)
         .limit(perPage)
         .exec(function(err, routes) {
             Routes.count({ from: from }).exec(function(err, count) {
                 if(err) return next(err)
                 res.render("schedulefrom",{ routes: routes, from: from, user: req.user, current: page, pages: Math.ceil(count/perPage), isLoggedIn: req.isLogged, layout: "layouts/layout" });
             })
         })
 
 };

 exports.ShowScheduleTo = async (req, res) => {
    var perPage = 5;
    var page = req.params.page || 1;
    var to = req.params.to;
    Routes
         .find({ to: to })
         .skip((perPage * page) - perPage)
         .limit(perPage)
         .exec(function(err, routes) {
             Routes.count({ to: to }).exec(function(err, count) {
                 if(err) return next(err)
                 res.render("scheduleto",{ routes: routes, to: to, user: req.user, current: page, pages: Math.ceil(count/perPage), isLoggedIn: req.isLogged, layout: "layouts/layout" });
             })
         })
 
 };