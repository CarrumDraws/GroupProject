// Main DB Connection Logic Happens Here!
const generateToken = require("../utils/generateToken.js");
const multer = require("multer");

const { uploadFileToS3, getFileUrl } = require("../config/s3.js");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const Registration = require("../models/Registration.js");
const Employee = require("../models/Employee.js");
const Onboarding = require("../models/Onboarding.js");
const File = require("../models/File.js");
const Opt = require("../models/Opt.js");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const getInfo = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    let profile = await Onboarding.findOne({
      employee_id: ID,
    })
      .populate("employee_id", "email") // Populate employee_id with email
      .exec();
    if (!profile) return res.status(404).json({ error: "Data Not Found" }); // is this best practice...?
    profile = profile.toObject(); // Converts mongo doc to plain object
    const { _id, ...profileWithoutId } = profile; // Remove _id from name
    profile = profileWithoutId;

    const opt = await Opt.findOne({
      employee_id: ID,
    });
    res.status(200).json({ profile, opt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateInfo = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    const field = req.params.field;
    let {
      firstname,
      middlename,
      lastname,
      preferredname,
      buildaptnum,
      street,
      city,
      state,
      zip,
      cell,
      work,
      ssn,
      dob,
      gender,
      title,
      startdate,
      enddate,
    } = req.body;

    const picture = req.files["picture"]?.[0];
    if (!field) return res.status(400).json({ error: "Missing Field Param" });
    if (
      field != "Main" &&
      field != "Address" &&
      field != "Contact" &&
      field != "Employment" &&
      field != "EmergencyContacts"
    )
      return res.status(400).json({
        error:
          "Invalid Field Value: Must be Main, Address, Contact, Employment, or EmergencyContacts",
      });
    if (field === "Main") {
      if (!firstname || !lastname)
        return res.status(400).send("Missing Name Fields");
      if (!picture)
        return res.status(400).send("Missing Profile Picture Field");
      if (!ssn) return res.status(400).send("Missing SSN Field");
      if (!dob) return res.status(400).send("Missing DOB Field");

      if (!gender) return res.status(400).send("Missing Gender Field");
      if (gender != "Male" && gender != "Female" && gender != "Other")
        return res
          .status(400)
          .send("Invalid Gender Field: Must be Male, Female, or Other");
    } else if (field === "Address") {
      if (!buildaptnum || !street || !city || !state || !zip)
        return res.status(400).send("Missing Address Fields");
    } else if (field === "Contact") {
      if (!cell) return res.status(400).send("Missing Cell Field");
    } else if (field === "Employment") {
      if (!title || !startdate || !enddate)
        return res.status(400).send("Missing Work Authorization Fields");
    } else if (field === "EmergencyContacts") {
      if (!contacts) res.status(400).send("Missing Emergency Contacts");
      if (contacts.length == 0) {
        return res.status(400).send("Must Have at Least One Emergency Contact");
      } else {
        for (let i = 0; i < contacts.length; i++) {
          if (!validateContact(contacts[i]))
            return res.status(400).send("Invalid Emergency Contact");
        }
      }
    }

    // Construct the update object dynamically based on the field
    let updateObject = {};
    switch (field) {
      case "Main":
        const pictureFileID = await processFile(ID, picture, "picture");
        updateObject = {
          name: {
            firstname: firstname,
            middlename: middlename,
            lastname: lastname,
            preferredname: preferredname,
          },
          ssn: Number(ssn),
          dob: Date(dob),
          gender: gender,
          picture: pictureFileID,
        };
        break;
      case "Address":
        updateObject = {
          address: {
            buildaptnum: Number(buildaptnum),
            street,
            city,
            state,
            zip,
          },
        };
        break;
      case "Contact":
        updateObject = {
          phone: {
            cell: Number(cell),
            work: Number(work),
          },
        };
        break;
      case "Employment":
        updateObject = {
          workauth: {
            title: title,
            startdate: Date(startdate),
            enddate: Date(enddate),
          },
        };
        break;
      case "EmergencyContacts":
        updateObject = {
          contacts: contacts,
        };
        break;
    }
    console.log(updateObject);
    let updatedOnboarding = await Onboarding.updateOne(
      { employee_id: ID },
      { $set: updateObject }, // Use $set to update only specified fields
      { runValidators: true, context: "query" } // Options
    );
    if (updatedOnboarding.n === 0)
      return res.status(404).json({ message: "Employee not found" });

    updatedOnboarding = await Onboarding.findOne({ employee_id: ID });
    res.json(updatedOnboarding);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOne = async (req, res) => {
  try {
    const { name, email } = req.body;
    let token = generateRandomString(16);

    const { CLIENT_EMPLOYEE_PORT } = process.env;
    const link = CLIENT_EMPLOYEE_PORT + "/updateInfo/" + token;

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

    await newRegistration.save();
    res.status(201).json(newRegistration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.status(201).json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function processFile(employeeId, file, filetype) {
  if (file) {
    const { key, filename } = await uploadFileToS3(file);
    const newFile = new File({
      employee_id: employeeId,
      filekey: key,
      filename: filename,
      notification_sent: "",
      status: "Pending",
    });
    await newFile.save();
    console.log("Created " + filetype + " File");
    return newFile._id;
  }
  return null;
}

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
  getOne,
  getAll,
  updateInfo,
  getInfo,
  upload,
};
