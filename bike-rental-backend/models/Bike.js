const mongoose = require("mongoose");

const BikeSchema = new mongoose.Schema({
  name: String,
  type: String,
  hourlyRate: Number,
  location: String,
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model("Bike", BikeSchema);
