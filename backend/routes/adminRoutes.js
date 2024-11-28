const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Item = require("../models/Item");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const { sendEmail } = require("../utils/email");
const multer = require("multer");


const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Set destination for file uploads

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
    const { email, password, phone, roles } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        phone,
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

 // Delete a User with a Reason
 router.put("/users/:userId/delete", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "A reason for deletion is required." });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await Item.deleteMany({ owner: userId });

    const emailSubject = "Account Deletion Notification";
    const emailText = `Your account has been deleted for the following reason:\n\n${reason}`;

    try {
      await sendEmail({
        to: user.email,
        subject: emailSubject,
        text: emailText,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    res.status(200).json({ message: "User deleted successfully and notified via email." });
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

router.post("/add-items", upload.array('images', 10), isAuthenticated, isAdmin, async (req, res) => {
    const { name, description, price, ownerEmail } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`); // Save file paths in DB

  
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
        images, // Store image paths
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
