const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { EMAIL_USER, EMAIL_PASS } = require("../config/config");

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // Or your preferred email service
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Generate a random verification code
const generateVerificationCode = () => crypto.randomBytes(3).toString("hex");

// General function to send an email
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: EMAIL_USER,
      to,
      subject,
      text,
      html, // Optional HTML content for rich formatting
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

// Function to send a verification email
const sendVerificationEmail = async (email, code) => {
  const subject = "Verify Your Email";
  const text = `Your verification code is: ${code}`;
  const html = `<p>Your verification code is: <strong>${code}</strong></p>`;

  return sendEmail({ to: email, subject, text, html });
};

module.exports = { generateVerificationCode, sendVerificationEmail, sendEmail };
