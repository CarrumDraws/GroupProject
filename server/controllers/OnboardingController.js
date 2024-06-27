const express = require("express");

const { uploadFileToS3, getFileUrl } = require("../config/s3.js");
const processFile = require("../utils/processFile.js");
const idToFileLink = require("../utils/idToFileLink.js");

const Onboarding = require("../models/Onboarding.js");
const Opt = require("../models/Opt.js");

const getOnboarding = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;

    const data = await Onboarding.findOne({
      employee_id: ID,
    })
      .populate("employee_id")
      .select("-_id");
    if (!data) return res.status(404).json({ error: "Data Not Found" }); // is this best practice...?

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Submit massive chunk of data with files...?
const submitOnboarding = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
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
      make,
      model,
      color,
      ssn,
      dob,
      gender,
      citizenship,
      citizenshiptype,
      workauth,
      title,
      startdate,
      enddate,
      haslicense,
      licensenumber,
      expdate,
    } = req.body;
    const picture = req.files["picture"]?.[0];
    const optreciept = req.files["optreciept"]?.[0];
    const license = req.files["license"]?.[0];
    let references;
    let contacts;

    try {
      references = JSON.parse(req.body.references);
      contacts = JSON.parse(req.body.contacts);
    } catch (error) {
      return res.status(400).json({
        error:
          "Invalid JSON format in references or contacts. If there are no references or contacts, pass in an empty array.",
      });
    }

    if (!firstname || !lastname)
      return res.status(400).send("Missing Name Fields");
    if (!picture) return res.status(400).send("Missing Profile Picture Field");

    if (!buildaptnum || !street || !city || !state || !zip)
      return res.status(400).send("Missing Address Fields");
    if (!cell) return res.status(400).send("Missing Cell Field");

    if (!ssn) return res.status(400).send("Missing SSN Field");
    if (!dob) return res.status(400).send("Missing DOB Field");

    if (!gender) return res.status(400).send("Missing Gender Field");
    if (gender != "Male" && gender != "Female" && gender != "Other")
      return res
        .status(400)
        .send("Invalid Gender Field: Must be Male, Female, or Other");

    if (!citizenship) return res.status(400).send("Missing Citizenship Field");
    if (citizenship != "true" && citizenship != "false")
      return res
        .status(400)
        .send(
          "Invalid Citizenship Field: Must be true or false (Case Sensitive)"
        );
    if (citizenship === "true") citizenship = true;
    else citizenship = false;
    if (citizenship) {
      if (!citizenshiptype)
        return res.status(400).send("Missing Citizenshiptype Field");
      if (citizenshiptype != "Green Card" && citizenshiptype != "Citizen")
        return res
          .status(400)
          .send("Invalid Citizenshiptype Type: Must be Green Card or Citizen");
    } else {
      if (!workauth || !startdate || !enddate)
        return res.status(400).send("Missing Work Authorization Fields");
      if (
        workauth != "H1-B" &&
        workauth != "L2" &&
        workauth != "F1(CPT/OPT)" &&
        workauth != "H4" &&
        workauth != "Other"
      )
        return res
          .status(400)
          .send(
            "Invalid workauth: Must be H1-B, L2, F1(CPT/OPT), H4, or Other"
          );
      if (workauth === "F1(CPT/OPT)") {
        if (!optreciept) return res.status(400).send("Missing OPT Reciept");
      } else if (workauth === "Other") {
        if (!title) return res.status(400).send("Missing Title Field");
      }
    }
    if (!haslicense) return res.status(400).send("Missing Haslisence Field");
    if (haslicense === "true") haslicense = true;
    else haslicense = false;
    if (haslicense) {
      if (!licensenumber || !expdate || !license)
        return res.status(400).send("Missing Lisence Data");
    }
    if (contacts.length == 0) {
      return res.status(400).send("Must Have at Least One Emergency Contact");
    } else {
      for (let i = 0; i < contacts.length; i++) {
        if (!validateContact(contacts[i]))
          return res.status(400).send("Invalid Emergency Contact");
      }
    }
    for (let i = 0; i < references.length; i++) {
      if (!validateContact(references[i]))
        return res.status(400).send("Invalid Reference");
    }

    // Add necessary files to files
    const pictureFileID = await processFile(ID, picture, "picture");
    const optFileID = await processFile(ID, optreciept, "optreciept");
    if (optFileID) initializeOpt(ID, optFileID, "optFileID");
    const licenseFileID = await processFile(ID, license, "license");

    // Create new/update onboarding
    const updatedOnboarding = await Onboarding.findOneAndUpdate(
      { employee_id: ID },
      {
        employee_id: ID,
        name: {
          firstname,
          middlename,
          lastname,
          preferredname,
        },
        picture: pictureFileID,
        address: {
          buildaptnum: Number(buildaptnum),
          street,
          city,
          state,
          zip,
        },
        phone: {
          cell: Number(cell),
          work: Number(work),
        },
        car: {
          make,
          model,
          color,
        },
        ssn: Number(ssn),
        dob: Date(dob),
        gender,
        citizenship: citizenship,
        citizenshiptype: citizenship ? citizenshiptype : null,
        workauth: {
          workauth: citizenship ? null : workauth,
          title: citizenship ? null : workauth === "Other" ? title : null,
          startdate: citizenship ? null : Date(startdate),
          enddate: citizenship ? null : Date(enddate),
        },
        license: {
          haslicense: haslicense,
          licensenumber: haslicense ? licensenumber : null,
          expdate: haslicense ? Date(expdate) : null,
          licensefile: haslicense ? licenseFileID : null,
        },
        references,
        contacts,
        status: "Pending",
        feedback: null,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true } // Options
    );
    console.log(updatedOnboarding);
    await updatedOnboarding.save();
    return res.status(200).json({
      message: "Onboarding submitted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const reviewOnboardingApps = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    const { type } = req.query;
    if (!type) return res.status(400).send("Missing type Query");
    if (type !== "Pending" && type !== "Rejected" && type !== "Approved")
      return res.status(400).send("Invalid type Query");

    // Get first name, preferredname, lastname, email, link to their profile pic
    let onboardings = await Onboarding.find(
      { status: type },
      "name picture employee_id -_id"
    )
      .populate("employee_id", "email isHR") // Populate employee_id with email
      .exec();

    // Filter out onboardings where the populated employee_id.isHR is true
    onboardings = onboardings.filter((profile) => !profile.employee_id.isHR);

    // Process Data
    const result = await Promise.all(
      onboardings.map(async (profile) => {
        console.log(profile);
        profile = profile.toObject(); // Converts mongo profile to plain object
        const { _id, ...nameWithoutId } = profile.name; // Remove _id from name
        const pictureUrl = await idToFileLink(profile.picture);
        return {
          ...profile,
          picture: pictureUrl,
          name: nameWithoutId,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getEmployeeOnboarding = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    const employeeid = req.params.employeeid;
    if (!employeeid) return res.status(400).send("Missing employeeid Param");

    const data = await Onboarding.findOne({
      employee_id: employeeid,
    })
      .populate("employee_id", "email")
      .lean();
    if (!data) return res.status(404).json({ error: "User Not Found" });

    delete data._id; // Delete onboarding id for better readability
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleEmployeeOnboarding = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    const { action, feedback } = req.body;
    const employeeid = req.params.employeeid;
    if (!employeeid) return res.status(400).send("Missing employeeid Param");
    if (!action) return res.status(400).send("Missing action in body");
    if (action != "Approved" && action != "Rejected")
      return res
        .status(400)
        .send("Invalid Action: must be Approved or Rejected");

    if (action == "Rejected" && !feedback)
      return res.status(400).send("Missing feedback in body");

    // Check if Onboarding is found or not
    const onboard = await Onboarding.findOne({ employee_id: employeeid });
    if (!onboard) return res.status(400).send("Onboarding not found");

    // Check if onboarding is already approved/rejected
    if (onboard.status === "Rejected" || onboard.status === "Approved")
      return res
        .status(400)
        .send(
          "Can't Reject/Approve an onboarding that's already Approved or Rejected"
        );

    const data = await Onboarding.findOneAndUpdate(
      { employee_id: employeeid },
      { status: action, feedback: action == "Rejected" ? feedback : null },
      { new: true }
    );
    if (!data)
      return res.status(404).json({ error: "User's Onboarding Not Found" });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// HELPER FUNCS ----

const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const { data, key } = await uploadFileToS3(file);

    res.status(200).send({
      message: "File uploaded successfully",
      fileKey: key, // Include the file key in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file.");
  }
};

// Route to generate a pre-signed URL for viewing/downloading a file
const retrieveFile = async (req, res) => {
  const { fileKey } = req.params;

  try {
    const url = await getFileUrl(fileKey);
    res.status(200).send({
      message: "Pre-signed URL generated successfully",
      url: url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating pre-signed URL.");
  }
};

function validateContact(contact) {
  contact.phone = Number(contact.phone);
  if (
    !contact.firstname ||
    !contact.lastname ||
    !contact.phone ||
    !contact.email ||
    !contact.relationship
  )
    return false;
  return true;
}

async function initializeOpt(employeeId, optFileID) {
  try {
    // Upsert operation with findOneAndUpdate
    const updatedOpt = await Opt.findOneAndUpdate(
      { employee_id: employeeId }, // Find document by employee_id
      {
        employee_id: employeeId,
        optreciept: optFileID,
        optead: null,
        i983: null,
        i20: null,
        status: "OPT Receipt",
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log(
      `Opt document ${updatedOpt ? "updated" : "created"} successfully:`,
      updatedOpt.status
    );
    return updatedOpt; // Return the updated or newly created Opt document
  } catch (error) {
    console.error("Error handling Opt document:", error);
    throw error; // Propagate the error for handling in the caller function
  }
}

module.exports = {
  getOnboarding,
  submitOnboarding,
  reviewOnboardingApps,
  getEmployeeOnboarding,
  handleEmployeeOnboarding,
  uploadFile,
  retrieveFile,
};
