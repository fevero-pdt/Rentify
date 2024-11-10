const express = require('express');
const Bike = require('../models/Bike');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const bikes = await Bike.find({});
        res.json(bikes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});


// Add a new bike
router.post('/add', async (req, res) => {
    const { name, type, hourlyRate, location } = req.body;

    try {
        const existingBike = await Bike.findOne({ name, location });
        if (existingBike) {
            return res.status(400).send('Bike already exists in this location.');
        }
        const bike = new Bike({ name, type, hourlyRate, location, isAvailable: true });
        await bike.save();
        res.status(200).send('Bike added successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to add bike.');
    }
});

// Delete a bike
router.post('/delete', async (req, res) => {
    const { name, location } = req.body;
    try {
        const result = await Bike.deleteOne({ name, location });
        if (result.deletedCount === 0) {
            return res.status(404).send('Bike not found.');
        }
        res.status(200).send('Bike deleted successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete bike.');
    }
});

module.exports = router;
