const express = require("express");
const multer = require("multer");

// Main DB Connection Logic Happens Here!
const generateToken = require("../utils/generateToken.js");
const { uploadFileToS3, getFileUrl } = require("../config/s3.js");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const Onboarding = require("../models/Onboarding.js");
const Employee = require("../models/Employee.js");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Submit massive chunk of data with files...?
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

module.exports = {
  getOnboarding,
  submitOnboarding,
  upload,
  uploadFile,
  retrieveFile,
};
