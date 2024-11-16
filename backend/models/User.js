const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      enum: ["Owner", "Renter"],
      default: ["Renter"], // Default role is Renter
    },
    verified: { type: Boolean, default: false }, // Ensure email verification is required
    isAdmin: { type: Boolean, default: false }, // New field for admin users
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      }, // Items owned by the user
    ],
  });

module.exports = mongoose.model("User", userSchema);
