const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Item = require("../models/Item");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

const router = express.Router();

// Fetch All Users
router.get("/users", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password for security
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
});

// Add Users
router.post("/add-users", isAuthenticated, isAdmin, async (req, res) => {
    const { email, password, roles } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        roles: roles || ["Renter"],
        verified: true, // Assuming admin-registered users are verified
      });
  
      await user.save();
      res.status(201).json({ message: "User added successfully.", user });
    } catch (error) {
      console.error("Error adding user:", error);
      res.status(500).json({ message: "Failed to add user." });
    }
  });

  
// Delete a User
router.delete("/users/:userId", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Optionally, clean up related data like their items
    await Item.deleteMany({ owner: userId });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

// Fetch All Items
router.get("/items", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const items = await Item.find().populate("owner", "email");
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Failed to fetch items." });
  }
});

router.post("/add-items", isAuthenticated, isAdmin, async (req, res) => {
    const { name, description, price, ownerEmail } = req.body;
  
    try {
      const owner = await User.findOne({ email: ownerEmail });
      if (!owner) {
        return res.status(404).json({ message: "Owner not found." });
      }
  
      const item = new Item({
        name,
        description,
        price,
        owner: owner._id,
      });
  
      await item.save();
      res.status(201).json({ message: "Item added successfully.", item });
    } catch (error) {
      console.error("Error adding item:", error);
      res.status(500).json({ message: "Failed to add item." });
    }
});
// Delete an Item
router.delete("/items/:itemId", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    res.status(200).json({ message: "Item deleted successfully." });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Failed to delete item." });
  }
});


module.exports = router;