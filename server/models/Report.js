const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const ReportSchema = new Schema({
  house_id: {
    type: refType,
    ref: "House",
    required: true,
  },
  employee_id: {
    type: refType,
    ref: "Employee",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Closed"],
    required: true,
  },
});

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

module.exports = Report;
