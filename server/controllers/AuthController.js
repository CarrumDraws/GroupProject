const generateToken = require("../utils/generateToken.js");
const processFile = require("../utils/processFile.js");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const fs = require("fs").promises;

const path = require("path");

const { transporter } = require("../config/nodemailer.js");

const Registration = require("../models/Registration.js");
const Employee = require("../models/Employee.js");
const Onboarding = require("../models/Onboarding.js");
const House = require("../models/House.js");
const File = require("../models/File.js");

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

    // Create new default profile pic, upload it as a file
    const filePath = path.resolve(__dirname, "../assets/default.jpg");
    const fileBuffer = await fs.readFile(filePath);
    const file = {
      buffer: fileBuffer,
      mimetype: "image/jpeg", // Set the correct MIME type
      originalname: path.basename(filePath),
    };
    const pictureFileID = await processFile(newEmployee._id, file, "picture");

    // Create new Empty Onboarding
    const newOnboarding = new Onboarding({
      employee_id: newEmployee._id,
      name: {
        firstname: "",
        middlename: "",
        lastname: "",
        preferredname: "",
      },
      picture: pictureFileID, // Picture will be null
      address: {
        buildaptnum: null,
        street: "",
        city: "",
        state: "",
        zip: "",
      },
      phone: {
        cell: null,
        work: null,
      },
      car: {
        make: "",
        model: "",
        color: "",
      },
      ssn: null,
      dob: null,
      gender: "Male",
      citizenship: null,
      citizenshiptype: "Citizen",
      workauth: {
        workauth: null,
        title: "",
        startdate: null,
        enddate: null,
      },
      license: {
        haslicense: null,
        licensenumber: "",
        expdate: null,
        licensefile: null, // Assuming refType allows null or you might set it to a valid ObjectId if needed
      },
      references: [],
      contacts: [],
      status: "Not Started",
      feedback: "",
    });

    // Add user to Random House
    const count = await House.countDocuments().exec();
    if (count === 0)
      return res.status(400).json({ message: "No houses found" });

    const random = Math.floor(Math.random() * count);
    const myHouse = await House.findOne().skip(random).exec();
    myHouse.members.push(newEmployee._id);
    console.log("New employee added to a Random House");

    // Stores ID, email, Employeename
    const jwttoken = generateToken(
      newEmployee._id,
      newEmployee.email,
      newEmployee.isHR
    );

    await newEmployee.save();
    await newOnboarding.save();
    await myHouse.save();
    await Registration.updateOne({ email }, { $set: { status: true } });

    // Generate + Return { token: {data}, employee: {data} }
    res.status(201).json({ token: jwttoken, employee: newEmployee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create link to {CLIENT_EMPLOYEE_PORT/login/xxxx} with random characters in query param
// Create a registration object in mongo
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

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Register for Calum's Illustration Workshop",
      text: `Congratulations, ${name}!\n\nYou've been selected to register for an upcoming Illustration Workshop.\nRegister with this link: ${link}\n\n Note: This link expires in 3 Hours.\n\nHope to see you soon!`,
    };

    // Send Email
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

const getRegistrationTokens = async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.status(201).json(registrations);
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
  getRegistrationTokens,
  register,
  login,
};
