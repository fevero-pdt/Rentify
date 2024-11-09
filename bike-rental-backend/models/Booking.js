const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bikeId: { type: mongoose.Schema.Types.ObjectId, ref: "Bike" },
  startTime: Date,
  endTime: Date,
  totalCost: Number,
  paymentStatus: { type: String, default: "pending" },
});

module.exports = mongoose.model("Booking", BookingSchema);
