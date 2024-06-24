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
  },
  optead: {
    type: refType,
    ref: "File",
  },
  i983: {
    type: refType,
    ref: "File",
  },
  i20: {
    type: refType,
    ref: "File",
  },
  status: {
    type: String,
    enum: ["OPT Receipt", "OPT EAD", "I-983", "I-20", "Approved"],
    required: true,
  },
});

const Opt = mongoose.models.Opt || mongoose.model("Opt", OptSchema);

module.exports = Opt;
