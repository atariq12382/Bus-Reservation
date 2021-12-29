const mongoose = require("mongoose");
const Complaint = require("../models/complaints");

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