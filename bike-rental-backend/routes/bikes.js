const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');

// Add a new bike
router.post('/add', async (req, res) => {
  const { name, model, price, ownerId } = req.body;

  try {
    const newBike = new Bike({
      name,
      model,
      price,
      ownerId,
    });
    await newBike.save();
    alert({ message: 'Bike added successfully', bike: newBike });
  } catch (error) {
    alert({ error: 'Failed to add bike' });
  }
});

module.exports = router;
