const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const OptSchema = new Schema({
  employee_id: {
    type: refType,
    ref: "Employee",
    required: true,
  },
  optreciept: {
    type: refType,
    ref: "File",
    required: true,
  },
  optead: {
    type: refType,
    ref: "File",
    required: true,
  },
  i983: {
    type: refType,
    ref: "File",
    required: true,
  },
  i20: {
    type: refType,
    ref: "File",
    required: true,
  },
  status: {
    type: String,
    enum: ["OPT Receipt", "OPT EAD", "I-983", "I-20", "Approved"],
    required: true,
  },
});

const Opt = mongoose.models.Opt || mongoose.model("Opt", OptSchema);

module.exports = Opt;
