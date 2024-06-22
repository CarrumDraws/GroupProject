const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isHR: { type: Boolean, required: true },
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
