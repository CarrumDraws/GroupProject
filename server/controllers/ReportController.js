const processFile = require("../utils/processFile.js");
const idToFileLink = require("../utils/idToFileLink.js");

const Registration = require("../models/Registration.js");
const Employee = require("../models/Employee.js");
const Onboarding = require("../models/Onboarding.js");
const File = require("../models/File.js");
const Opt = require("../models/Opt.js");

// Gets YOUR reports
const getReports = async (req, res) => {
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

module.exports = {
  getReports,
};
