const { uploadFileToS3, getFileUrl } = require("../config/s3");
const File = require("../models/File.js");

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

module.exports = processFile;
