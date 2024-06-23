// Main DB Connection Logic Happens Here!
const generateToken = require("../utils/generateToken.js");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const Onboarding = require("../models/Onboarding.js");
const Employee = require("../models/Employee.js");

const getOnboarding = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;

    const data = await Onboarding.findOne({
      employee_id: ID,
    });
    if (!data) return res.status(404).json({ error: "Data Not Found" }); // is this best practice...?

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const submitOnboarding = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;

    const data = await Onboarding.findOne({
      employee_id: ID,
    });
    if (!data) return res.status(404).json({ error: "Data Not Found" }); // is this best practice...?

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getOnboarding,
  submitOnboarding,
};
