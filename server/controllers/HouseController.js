const processFile = require("../utils/processFile.js");
const idToFileLink = require("../utils/idToFileLink.js");

const Registration = require("../models/Registration.js");
const Employee = require("../models/Employee.js");
const Onboarding = require("../models/Onboarding.js");
const House = require("../models/House.js");
const File = require("../models/File.js");
const Opt = require("../models/Opt.js");

const getHouse = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;

    let house = await House.findOne({ members: { $in: [ID] } })
      .populate({
        path: "members",
        model: "Employee", // Reference to the Employee model
      })
      .exec();

    if (!house) return res.status(404).json({ error: "House Not Found" });

    // Impossible to get detailed member info. YOu'll have to make API calls to /employee/:id
    res.status(200).json(house);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addHouse = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    let {
      firstname,
      middlename,
      lastname,
      phone,
      email,
      buildaptnum,
      street,
      city,
      state,
      zip,
      beds,
      mattresses,
      tables,
      chairs,
    } = req.body;

    if (!firstname || !lastname)
      return res.status(400).send("Missing Name Fields");
    if (!phone) return res.status(400).send("Missing Phone Field");
    if (isNaN(phone))
      return res.status(400).send("Phone field must be valid number");

    if (!email) return res.status(400).send("Missing email Field");
    if (!buildaptnum || !street || !city || !state || !zip)
      return res.status(400).send("Missing Address Fields");
    if (isNaN(buildaptnum))
      return res.status(400).send("Buildaptnum field must be valid number");
    if (isNaN(zip))
      return res.status(400).send("Zip field must be valid number");
    if (!beds || !mattresses || !tables || !chairs)
      return res.status(400).send("Missing Housing Accomidation Fields");
    if (isNaN(beds) || isNaN(mattresses) || isNaN(tables) || isNaN(chairs)) {
      return res
        .status(400)
        .send("Housing accommodation fields must be valid numbers.");
    }

    const house = new House({
      address: {
        buildaptnum: Number(buildaptnum),
        street,
        city,
        state,
        zip,
      },
      landlord: {
        firstname,
        middlename,
        lastname,
        phone: Number(phone),
        email,
      },
      members: [],
      beds: Number(beds),
      mattresses: Number(mattresses),
      tables: Number(tables),
      chairs: Number(chairs),
    });

    await house.save();
    res.status(200).json({ message: "House Created!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllHouses = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    let house = await House.find();
    res.status(200).json(house);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getHouse,
  addHouse,
  getAllHouses,
};
