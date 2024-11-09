const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();
const Bike = require('../models/Bike');

router.post("/register", register);
router.post("/login", login);

// Endpoint to add a new bike
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
        res.status(201).json({ message: 'Bike added successfully', bike: newBike });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add bike' });
    }
});

module.exports = router;
