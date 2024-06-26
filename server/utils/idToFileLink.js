const { uploadFileToS3, getFileUrl } = require("../config/s3.js");
const File = require("../models/File.js");

// Route to generate a pre-signed URL for viewing/downloading a file
async function idToFileLink(fileid) {
  if (!fileid) return;
  try {
    const file = await File.findOne({ _id: fileid });
    if (!file) return res.status(404).send("File not found");
    const url = await getFileUrl(file.filekey);
    return url;
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating pre-signed URL.");
  }
}

module.exports = idToFileLink;
