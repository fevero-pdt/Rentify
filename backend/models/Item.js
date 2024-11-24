const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Owner of the item
    renter: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // User renting the item
    isAvailable: { type: Boolean, default: true }, // Availability status
    rentalRequests: [
        {
            renter: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Renter making the request
            status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }, // Request status
            requestDate: { type: Date, default: Date.now }, // When the request was made
            desiredDate: { type: Date, required: true }, // Desired rental date
        
        },
    ],
});

module.exports = mongoose.model("Item", itemSchema);
