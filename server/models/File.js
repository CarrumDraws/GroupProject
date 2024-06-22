const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const FileSchema = new Schema({
  employee_id: {
    type: refType,
    ref: "Employee",
    required: true,
  },
  filename: { type: String, required: true },
  key: { type: String, required: true }, // This can be the S3 object key
  bucket: { type: String, required: true }, // S3 bucket name
  url: { type: String, required: true }, // URL to access the file in S3
  size: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Not Started", "Pending", "Rejected", "Approved"],
    required: true,
  },
  notification_sent: {
    type: Date,
    default: Date.now,
  },
  feedback: {
    type: String,
    required: true,
  },
});

const File = mongoose.models.File || mongoose.model("File", FileSchema);

module.exports = File;
