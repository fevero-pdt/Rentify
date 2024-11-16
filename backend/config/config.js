require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5002,
  MONGO_URI: process.env.MONGO_URI,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  SESSION_SECRET: "yourSecretKey", // Replace with a strong secret
};
