// Main DB Connection Logic Happens Here!
const generateToken = require("../utils/generateToken.js");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const Registration = require("../models/Registration.js");
const Employee = require("../models/Employee.js");

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

// Create link to {CLIENT_EMPLOYEE_PORT/login/xxxx} with random characters in query param
// Create a registration object in mongo
// [LATER] Send Email
// [LATER] implement timeout
const sendRegistrationToken = async (req, res) => {
  try {
    const { name, email } = req.body;
    let token = generateRandomString(16);

    const { CLIENT_EMPLOYEE_PORT } = process.env;
    const link = CLIENT_EMPLOYEE_PORT + "/register/" + token;

    const existingRegistration = await Registration.findOne({
      email: email,
    });
    if (existingRegistration)
      return res.status(400).json({ error: "Email Already in Use" });

    const newRegistration = new Registration({
      email: email,
      name: name,
      link,
      status: false,
    });

    // Send Email
    // let mailOptions = {
    //   from: process.env.EMAIL,
    //   to: email,
    //   subject: "Register for Calum's Illustration Workshop",
    //   text: `Congratulations, ${name}!\n\nYou've been selected to register for an upcoming Illustration Workshop.\nRegister with this link: ${link}\n\n Note: This link expires in 3 Hours.\n\nHope to see you soon!`,
    // };

    // transporter.sendMail(mailOptions, (error) => {
    //   if (error) {
    //     console.log(error);
    //     res.status(500).send("Failed to send email");
    //   }
    //   console.log("Email Sent");
    // });

    await newRegistration.save();
    res.status(201).json(newRegistration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const register = async (req, res) => {
  try {
    const { email, link } = req.body;
    const password = await bcrypt.hash(
      req.body.password,
      Number(process.env.SALT)
    );

    // check if email exists
    let registration = await Registration.findOne({ email: email })
      .lean()
      .exec();
    if (!registration)
      return res.status(401).json({ message: "Invalid Email" });

    // check if Link matches
    console.log(registration.link);
    console.log(link);
    if (registration.link != link)
      return res.status(401).json({ message: "Invalid Registration Link" });

    if (registration.status)
      return res.status(401).json({ message: "User Already Registered" });

    // Create newEmployee
    const newEmployee = new Employee({
      email,
      password,
      isHR: false,
    });

    // Stores ID, email, Employeename
    const jwttoken = generateToken(
      newEmployee._id,
      newEmployee.email,
      newEmployee.isHR
    );

    await newEmployee.save();
    await Registration.updateOne({ email }, { $set: { status: true } });

    // Generate + Return { token: {data}, employee: {data} }
    res.status(201).json({ token: jwttoken, employee: newEmployee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let employee = await Employee.findOne({ email }).lean().exec(); // check if email exists
    if (!employee) return res.status(401).json({ message: "Invalid Email" });

    // check if Password is correct
    const isPasswordCorrect = await bcrypt.compare(password, employee.password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid Password" });

    // Stores ID, email, Employeename
    const token = generateToken(employee._id, employee.email, employee.isHR);

    // Generate + Return { token: {data}, employee: {data} }
    res.status(200).json({ token: token, employee: employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Generate a random URL-safe string
function generateRandomString(length) {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .substring(0, length);
}

module.exports = {
  sendRegistrationToken,
  register,
  login,
};
