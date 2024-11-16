require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const connectDB = require("./config/db");
const { PORT, SESSION_SECRET } = require("./config/config");

const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true,              // Allow credentials (cookies)
  })
);

// Session Middleware
app.use(
  session({
    secret: SESSION_SECRET, // Secure secret from config
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Authentication Middleware
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    req.userId = req.session.user._id; // Attach userId to req object
    next();
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

// Routes
app.use("/users", userRoutes);
app.use("/items", itemRoutes);

// Admin Users List Route
app.get("/admin/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
});

// Assign Items to Owners Route
app.put("/assign-items-to-owners", async (req, res) => {
  try {
    const items = await Item.find();

    for (const item of items) {
      if (item.owner) {
        const user = await User.findById(item.owner);

        if (user && !user.items.includes(item._id)) {
          user.items.push(item._id);
          await user.save();
          console.log(`Added item '${item.name}' to user '${user.email}'`);
        }
      }
    }

    res.status(200).json({ message: "Items successfully assigned to owners." });
  } catch (error) {
    console.error("Error assigning items to owners:", error);
    res.status(500).json({ message: "Failed to assign items to owners." });
  }
});






// Session Route
app.get("/session", (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

// Logout Route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out." });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully." });
  });
});

// Dashboard Route
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.json({ message: `Welcome, ${req.session.user.email}` });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export Middleware for Use in Routes
module.exports = {
  isAuthenticated,
};
