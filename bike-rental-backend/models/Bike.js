const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  ownerId: { type: String, required: true }, // User ID of the bike owner
});

module.exports = mongoose.model('Bike', bikeSchema);
