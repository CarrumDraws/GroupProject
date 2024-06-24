// Require Nodemailer module
const nodemailer = require("nodemailer");

// Create a transporter using SMTP
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASSWORD,
  },
});

module.exports = { transporter };
