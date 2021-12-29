const mongoose = require('mongoose');

const RoutesSchema = new mongoose.Schema({
    number: {type: Number, required: true},
    date: {type: String, required: true},
    month: {type: String, required: true},
    year: {type: String, required: true},
    time: {type: String, required: true},
    from: {type: String, required: true},
    to: {type: String, required: true},
    capacity: {type: Number, required: true},
    available: {type: Number, required: true},
    fare: {type: String, required: true},
    bno: {type: String, required: true}
})

const Routes = mongoose.model('routes', RoutesSchema);
module.exports = Routes;