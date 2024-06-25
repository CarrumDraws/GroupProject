const { uploadFileToS3, getFileUrl } = require("../config/s3.js");
const File = require("../models/File.js");

// Route to generate a pre-signed URL for viewing/downloading a file
const retrieveFile = async (req, res) => {
  const { fileid } = req.params;
  if (!fileid) return res.status(400).send("Missing fileid Param");

  try {
    const file = await File.findOne({ _id: fileid });
    if (!file) return res.status(404).send("File not found");
    const url = await getFileUrl(file.filekey);
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
  retrieveFile,
};
