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
  filekey: { type: String, required: true }, // S3 object key
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
  },
});

const File = mongoose.models.File || mongoose.model("File", FileSchema);

module.exports = File;
