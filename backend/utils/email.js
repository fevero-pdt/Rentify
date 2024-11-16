const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { EMAIL_USER, EMAIL_PASS } = require("../config/config");

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

// Generate a random verification code
const generateVerificationCode = () => crypto.randomBytes(3).toString("hex");

// Send a verification email
const sendVerificationEmail = async (email, code) => {
  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      text: `Your verification code is: ${code}`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { generateVerificationCode, sendVerificationEmail };
