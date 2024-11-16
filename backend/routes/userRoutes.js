const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Item = require("../models/Item"); // Import the Item model
const { generateVerificationCode, sendVerificationEmail } = require("../utils/email");

const router = express.Router();

const verificationCodes = new Map(); // Temporary store for verification codes

// Register Route
router.post("/register", async (req, res) => {
  const { email, password, roles } = req.body;

  // Check email domain
  // if (!email.endsWith("@nitc.ac.in")) {
  //   return res.status(400).json({ message: "Only emails with @nitc.ac.in domain are allowed." });
  // }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const code = generateVerificationCode();
  verificationCodes.set(email, code);

  try {
    await sendVerificationEmail(email, code);
    res.status(200).json({ message: "Verification code sent to your email." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send verification email." });
  }
});

// Verify and Complete Registration
router.post("/verify", async (req, res) => {
  const { email, password, roles, code } = req.body;

  const storedCode = verificationCodes.get(email);
  if (!storedCode || storedCode !== code) {
    return res.status(400).json({ message: "Invalid or expired verification code." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    password: hashedPassword,
    roles: roles || ["Renter"],
    verified: true,
  });
  await user.save();

  verificationCodes.delete(email);

  res.status(201).json({ message: "User registered successfully." });
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check email domain
        // if (!email.endsWith("@nitc.ac.in")) {
        //   return res.status(400).json({ message: "Only emails with @nitc.ac.in domain are allowed." });
        // }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Email" });
        }

        if (!user.verified) {
            return res.status(401).json({ message: "Please verify your email first." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        req.session.user = user;
        res.status(200).json({ message: "Login successful" });

    } catch (error) {
        console.error("Error in login route:", error);
        res.status(500).json({ message: "An error occurred during login." });
    }
});

// Profile Route
router.get("/profile", async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.session.user._id;

    const user = await User.findById(userId).populate("items");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      email: user.email,
      roles: user.roles,
      ownedItems: user.items,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});



module.exports = router;