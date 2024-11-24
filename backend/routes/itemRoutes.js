const express = require("express");
const Item = require("../models/Item");
const User = require("../models/User");
const { sendEmail } = require("../utils/email");
// const { isAuthenticated } = require("../server");
// const { authenticate } = require("../middleware/auth");


const router = express.Router();

// console.log("isAuthenticated:", isAuthenticated);

// Get all items route
router.get("/", async (req, res) => {
    try {
      const items = await Item.find().populate("owner", "email"); // Fetch all items with owner email
      res.status(200).json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Failed to fetch items" });
    }
});

// Add item route
router.post("/addItem", async (req, res) => {
    const { name, description, price } = req.body;
  
    // Ensure the user is authenticated
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Not authenticated." });
    }
  
    try {
      // Create and save a new item
      const newItem = new Item({ name, description, price, owner: req.session.user._id });
      await newItem.save();
  
      // Update the user's role to include "Owner"
      const user = await User.findById(req.session.user._id);
      if (!user.roles.includes("Owner")) {
        user.roles.push("Owner");
        await user.save();
      }
      if (!user.items.includes(newItem._id)) {
        user.items.push(newItem._id);
        await user.save();
      }
      res.status(201).json({ message: "Item added successfully", item: newItem });
    } catch (error) {
      console.error("Error adding item:", error);
      res.status(500).json({ message: "Failed to add item." });
    }
});

// delete item route
router.delete("/:itemId", async (req, res) => {
    try {
      if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
  
      const userId = req.session.user._id; // Logged-in user's ID
      const itemId = req.params.itemId;
  
      // Find the item to check ownership
      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
  
      // Check if the logged-in user is the owner
      if (item.owner.toString() !== userId) {
        return res.status(403).json({ message: "You are not authorized to delete this item" });
      }
  
      // Delete the item
      await Item.findByIdAndDelete(itemId);
      res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Failed to delete item" });
    }
});

// Search Items Route
router.get("/search", async (req, res) => {
    try {
        const { query } = req.query; // Get the search query from URL parameters

        // Build dynamic search criteria
        const searchCriteria = {
          $or: [
            { name: { $regex: query, $options: "i" } }, // Search by item name
            { "owner.email": { $regex: query, $options: "i" } }, // Search by owner's email
          ],
        };
    
        // Fetch matching items and populate owner information
        const items = await Item.find(searchCriteria).populate("owner", "email");
    
        res.status(200).json(items);
    } catch (error) {
      console.error("Error searching items:", error);
      res.status(500).json({ message: "Failed to search items." });
    }
  });
  
// Request Item Route
router.post("/:itemId/request", async (req, res) => {
  try {
      const { desiredDate } = req.body;

      // Validate the desiredDate field
      if (!desiredDate) {
          return res.status(400).json({ message: "Desired date is required." });
      }

      const userId = req.session.user._id; // Assuming user session is active
      const itemId = req.params.itemId;

      const item = await Item.findById(itemId);
      if (!item) {
          return res.status(404).json({ message: "Item not found" });
      }

      // Check for existing requests
      const existingRequest = item.rentalRequests.find(
          (req) => req.renter.toString() === userId
      );
      if (existingRequest) {
          return res.status(400).json({ message: "Request already sent." });
      }

      // Push new rental request
      item.rentalRequests.push({
          renter: userId,
          desiredDate: new Date(desiredDate), // Ensure proper date formatting
      });
      await item.save();

      res.status(200).json({ message: "Rental request sent successfully." });
  } catch (error) {
      console.error("Error processing rental request:", error);
      res.status(500).json({ message: "Failed to send rental request." });
  }
});



// Get Rental Requests Route
router.get("/:itemId/requests", async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.session.user._id; // Logged-in user's ID
    const itemId = req.params.itemId;

    console.log("Fetching rental requests for item:", itemId, "by user:", userId);

    // Find the item and populate rental requests
    const item = await Item.findById(itemId).populate({
      path: "rentalRequests.renter", // Populate the renter field
      select: "email", // Select only the email field of the renter
    });

    if (!item) {
      console.log("Item not found:", itemId);
      return res.status(404).json({ message: "Item not found" });
    }

    // Verify ownership
    if (item.owner.toString() !== userId) {
      console.log("User is not the owner of the item.");
      return res.status(403).json({ message: "Access denied. You are not the owner of this item." });
    }

    console.log("Rental requests fetched successfully:", item.rentalRequests);
    res.status(200).json(item.rentalRequests);
  } catch (error) {
    console.error("Error fetching rental requests:", error);
    res.status(500).json({ message: "Failed to fetch rental requests." });
  }
});


// Respond to Rental Request Route
router.put("/:itemId/requests/:requestId", async (req, res) => {
  try {
    const { itemId, requestId } = req.params;
    const { status } = req.body; // "accepted" or "rejected"
    const userId = req.session.user._id; // Logged-in user's ID

    // Validate the status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    // Find the item and populate the renter's email in rentalRequests
    const item = await Item.findById(itemId).populate("rentalRequests.renter", "email");
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    // Verify that the logged-in user is the owner of the item
    if (item.owner.toString() !== userId) {
      return res.status(403).json({ message: "Access denied. You are not the owner of this item." });
    }

    // Find the specific rental request
    const request = item.rentalRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    // Update the status of the rental request
    request.status = status;

    if (status === "accepted") {
      // Assign the renter to the item and mark it as unavailable
      item.renter = request.renter;
      item.isAvailable = false;

      // If needed, you can reject other requests here
      // But the current logic does not automatically reject others
    }

    // Save the updated item
    await item.save();

    // Prepare to send an email to the renter
    const renterEmail = request.renter?.email;
    if (renterEmail) {
      const emailSubject = `Your rental request has been ${status}`;
      const emailText =
        status === "accepted"
          ? `Congratulations! Your rental request for the item "${item.name}" has been accepted.`
          : `Unfortunately, your rental request for the item "${item.name}" has been rejected.`;

      // Send email
      await sendEmail({
        to: renterEmail,
        subject: emailSubject,
        text: emailText,
        html: `<p>${emailText}</p>`,
      });
    } else {
      console.warn("Renter email is missing. Email notification was not sent.");
    }

    // Respond with success
    res.status(200).json({ message: `Request has been ${status}.` });
  } catch (error) {
    console.error("Error responding to rental request:", error);
    res.status(500).json({ message: "Failed to respond to rental request." });
  }
});



// Return Item Route
router.post("/:itemId/return", async (req, res) => {
  try {
    const { itemId } = req.params;

    const userId = req.session.user._id; // Logged-in user's ID

    // Find the item
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    // Check if the logged-in user is the current renter
    if (item.owner?.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner of this item." });
    }

    // Mark the item as available and remove the renter
    item.isAvailable = true;
    item.renter = null;

    // Delete accepted rental requests
    item.rentalRequests = item.rentalRequests.filter(
      (request) => request.status !== "accepted"
    );

    await item.save();

    res.status(200).json({ message: "Item returned successfully." });
  } catch (error) {
    console.error("Error returning item:", error);
    res.status(500).json({ message: "Failed to return the item." });
  }
});


module.exports = router;
