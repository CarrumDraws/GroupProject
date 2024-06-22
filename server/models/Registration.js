const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RegistrationSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  status: { type: Boolean, required: true },
});

const Registration =
  mongoose.models.Registration ||
  mongoose.model("Registration", RegistrationSchema);

module.exports = Registration;
