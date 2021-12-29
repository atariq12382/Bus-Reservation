const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
    number: {type: Number, rquired: true},
    rank: {type: String, required: true},
    numberplate: {type: String, required: true}
})

const Bus = mongoose.model('bus', BusSchema);
module.exports = Bus;