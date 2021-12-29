const mongoose = require('mongoose');

const complaintsschma = new mongoose.Schema({
    title: {type: String, required: true},
    name: {type: String, required: true},
    contact: {type: String, required: true},
    email: { type: String, required: true },
    details: { type: String, required: true }
})

const Complaint = mongoose.model('complaint', complaintsschma);

module.exports = Complaint;