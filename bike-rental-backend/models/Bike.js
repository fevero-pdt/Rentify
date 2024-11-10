const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
    name: String,
    type: String,
    hourlyRate: Number,
    location: String,
    isAvailable: { type: Boolean, default: true },
});

const Bike = mongoose.model('Bike', bikeSchema);
module.exports = Bike;
