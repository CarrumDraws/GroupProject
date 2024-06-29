const processFile = require("../utils/processFile.js");
const idToFileLink = require("../utils/idToFileLink.js");

const Registration = require("../models/Registration.js");
const Employee = require("../models/Employee.js");
const Onboarding = require("../models/Onboarding.js");
const File = require("../models/File.js");
const Opt = require("../models/Opt.js");

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
    // const pictureUrl = await idToFileLink(profile.picture);
    // profile = { ...profile, picture: pictureUrl };
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
    const { ID, EMAIL, ISHR } = req.body;
    const employeeid = req.params.employeeid;
    if (!employeeid)
      return res.status(400).json({ error: "Missing Employeeid Param" });
    let profile = await Onboarding.findOne({
      employee_id: employeeid,
    })
      .populate("employee_id", "email") // Populate employee_id with email
      .exec();
    if (!profile) return res.status(404).json({ error: "Data Not Found" });
    profile = profile.toObject(); // Converts mongo doc to plain object
    const pictureUrl = await idToFileLink(profile.picture);
    profile.picture = pictureUrl;

    const { _id, ...profileWithoutId } = profile; // Remove _id from name
    profile = profileWithoutId;

    const opt = await Opt.findOne({
      employee_id: employeeid,
    });

    res.status(200).json({ profile, opt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    let profiles = await Onboarding.find()
      .populate("employee_id") // Populate employee_id with email and isHR, exclude _id
      .select("name phone picture ssn workauth -_id") // Select only specific fields from Onboarding
      .exec();
    if (!profiles.length) {
      return res.status(404).json({ error: "Data Not Found" });
    }

    // Filter out profiles where the populated employee_id.isHR is true
    profiles = profiles.filter((profile) => !profile.employee_id.isHR);
    // Filter out profiles where there isn't a firstname
    profiles = profiles.filter((profile) => profile.name.firstname);

    // Get profile picture URL's
    profiles = await Promise.all(
      profiles.map(async (profile) => {
        profile = profile.toObject(); // Convert to normal object

        const pictureUrl = await idToFileLink(profile.picture);
        return { ...profile, picture: pictureUrl };
      })
    );

    if (!profiles.length) {
      return res.status(404).json({ error: "No Non-HR Onboardings Found" });
    }

    res.status(200).json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getOne,
  getAll,
  updateInfo,
  getInfo,
};
