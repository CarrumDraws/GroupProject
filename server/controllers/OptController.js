const processFile = require("../utils/processFile.js");

const Registration = require("../models/Registration.js");
const Employee = require("../models/Employee.js");
const Onboarding = require("../models/Onboarding.js");
const File = require("../models/File.js");
const Opt = require("../models/Opt.js");

const getOpt = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    let opt = await Opt.findOne({
      employee_id: ID,
    })
      .populate("employee_id", "email") // Populate employee_id with email
      .exec();
    if (!opt) return res.status(404).json({ error: "Data Not Found" });
    opt = opt.toObject(); // Converts mongo doc to plain object
    const { _id, ...optWithoutId } = opt; // Remove _id from name
    opt = optWithoutId;

    res.status(200).json(opt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const postOpt = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    const type = req.params.type;
    if (!type) return res.status(400).send("Missing type Param");
    if (
      type != "OPT Receipt" &&
      type != "OPT EAD" &&
      type != "I-983" &&
      type != "I-20"
    )
      return res
        .status(400)
        .send(
          "Invalid type Param: Must be OPT Receipt, OPT EAD, I-983, or I-20"
        );

    const fileone = req.files["fileone"]?.[0];
    const filetwo = req.files["filetwo"]?.[0];
    if (!fileone) return res.status(400).send("Missing Fileone");
    if (type === "I-983" && !filetwo)
      return res.status(400).send("Missing Filetwo");

    // Get OPT Object
    let opt = await Opt.findOne({
      employee_id: ID,
    })
      .populate("employee_id", "email") // Populate employee_id with email
      .exec();
    if (!opt) return res.status(404).json({ error: "Data Not Found" });

    if (opt.status != type)
      return res.status(400).send("type doesn't match current OPT Stage");

    // Verify that Current OPT's file(s) are NOT pending or approved -------
    let fileid;
    let fileidtwo; // Used for checking I-983
    switch (type) {
      case "OPT Receipt":
        fileid = opt.optreciept;
        break;
      case "OPT EAD":
        fileid = opt.optead;
        break;
      case "I-983":
        fileid = opt.i983[0];
        fileidtwo = opt.i983[1];
        break;
      default:
        fileid = opt.i20;
    }

    // Check First File
    if (fileid) {
      let file = await File.findById(fileid);
      if (!file)
        return res.status(404).json({ error: "Previous OPT File Not Found" });
      if (file.status != "Rejected") {
        if (opt.status === "I-983") {
          // Check Second File
          if (fileidtwo) {
            let fileB = await File.findById(fileidtwo);
            if (!fileB)
              return res
                .status(404)
                .json({ error: "Previous OPT File Not Found" });
            if (fileB.status != "Rejected") {
              return res.status(400).json({
                error:
                  "Can't Post new I-983 files- both are either Pending or Approved",
              });
            }
          }
        } else {
          return res.status(400).json({
            error: "Can't Post to filetype thats currently Pending or Approved",
          });
        }
      }
    }

    // Upload New File(s) ----------
    const fileoneID = await processFile(ID, fileone, "fileone");
    const filetwoID =
      type === "I-983" ? await processFile(ID, filetwo, "filetwo") : null;

    // Construct the updateObject dynamically based on the field
    let updateObject = {};
    switch (type) {
      case "OPT Receipt":
        updateObject = {
          optreciept: fileoneID,
        };
        break;
      case "OPT EAD":
        updateObject = {
          optead: fileoneID,
        };
        break;
      case "I-983":
        updateObject = {
          i983: [fileoneID, filetwoID],
        };
        break;
      case "I-20":
        updateObject = {
          i20: fileoneID,
        };
        break;
      case "Approved":
        return res.status(400).send("All Files have already been accepted");
      default:
        return res.status(400).send("Opt Document Status Error");
    }

    // Overwrite OPT File Field
    const updatedOpt = await Opt.findOneAndUpdate(
      { employee_id: ID },
      { $set: updateObject },
      { new: true, runValidators: true }
    );

    if (!updatedOpt) return res.status(404).send("Opt document not found");

    res.status(200).json(updatedOpt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleOpt = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    const fileid = req.params.fileid;
    const { action, feedback } = req.body;

    if (!fileid) return res.status(400).send("Missing fileid Param");
    if (!action) return res.status(400).send("Missing action Field");
    if (action != "Approved" && action != "Rejected")
      return res
        .status(400)
        .send("Invalid action Field: Must be Approved or Rejected");
    if (action === "Rejected" && !feedback)
      return res.status(400).send("Missing feedback Field");

    const updateObject = {
      status: action,
      feedback: action === "Rejected" ? feedback : null,
    };

    // Update File ---
    let file = await File.findById(fileid);
    if (!file) return res.status(404).json({ error: "File Not Found" });
    if (file.status !== "Not Started" && file.status !== "Pending") {
      return res.status(400).json({
        error: "Can't Update a file thats already Accepted or Rejected",
      });
    }
    file = await File.findByIdAndUpdate(
      fileid,
      { $set: updateObject },
      { new: true, runValidators: true }
    );
    if (!file) return res.status(404).json({ error: "File Not Found" });

    if (action === "Rejected")
      return res.status(200).json({
        message: "Sucessfully Rejected File with feedback: " + feedback,
      });

    // Update Employee's OPT status ---
    // Find the opt of the employee whose file we're looking at
    const opt = await Opt.findOne({ employee_id: file.employee_id });
    if (!opt) return res.status(404).send("Opt document not found");

    // Decide new status
    let newStatus;
    switch (opt.status) {
      case "OPT Receipt":
        newStatus = "OPT EAD";
        break;
      case "OPT EAD":
        newStatus = "I-983";
        break;
      case "I-983":
        newStatus = "I-20";
        break;
      case "I-20":
        newStatus = "Approved";
        break;
      case "Approved":
        return res.status(400).send("Opt's Status is Already Approved");
      default:
        return res.status(400).send("Invalid Opt Status");
    }

    // Update OPT's status for non-i983 files
    if (opt.status != "I-983") {
      const updatedOpt = await Opt.findOneAndUpdate(
        { employee_id: file.employee_id },
        { $set: { status: newStatus } },
        { new: true, runValidators: true }
      );
      if (!updatedOpt) return res.status(404).send("Opt document not found");

      return res.status(200).json({
        message: "Sucessfully Accepted File",
      });
    } else {
      // Check if other file is approved or not
      // Find OPT where this fileid is in the i983 array
      let myopt = await Opt.findOne({ i983: { $in: [fileid] } });
      if (!myopt)
        return res
          .status(404)
          .json({ error: "Opt which I-983 Document belongs to Not Found" });
      let otherid = myopt.i983[0] == fileid ? myopt.i983[1] : myopt.i983[0];
      console.log(otherid); // Found otherid

      let otheridfile = await File.findById(otherid);
      if (!otheridfile)
        return res.status(404).json({ error: "Other I-983 File Not Found" });

      // Check if otheridfile is approved
      if (otheridfile.status === "Approved") {
        const updatedOpt = await Opt.findOneAndUpdate(
          { employee_id: file.employee_id },
          { $set: { status: newStatus } },
          { new: true, runValidators: true }
        );
        if (!updatedOpt) return res.status(404).send("Opt document not found");

        return res.status(200).json({
          message: "Sucessfully Accepted Both I-983 Files",
        });
      } else {
        return res.status(200).json({
          message: "Successfully Accepted One File for I-983",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getVisaEmployees = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    let profiles = await Onboarding.find()
      .populate("employee_id") // Populate employee_id with email and isHR, exclude _id
      .select("name phone ssn workauth -_id") // Select only specific fields from Onboarding
      .exec();

    if (!profiles.length) {
      return res.status(404).json({ error: "Data Not Found" });
    }

    // Filter out profiles where the populated employee_id.isHR is true
    profiles = profiles.filter((profile) => !profile.employee_id.isHR);

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
  handleOpt,
  getVisaEmployees,
  postOpt,
  getOpt,
};
