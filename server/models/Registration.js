const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RegistrationSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  registration_link: { type: String, required: true, unique: true },
});

const Registration = mongoose.model("Registration", RegistrationSchema);

module.exports = Registration;
