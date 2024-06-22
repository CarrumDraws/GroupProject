const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const AddressSchema = new Schema({
  buildaptnum: {
    type: Number,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
});

const PersonSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  middlename: String,
  lastname: {
    type: String,
    required: true,
  },
  preferredname: String,
});

const ContactSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  middlename: String,
  lastname: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: { type: String, required: true },
  relationship: {
    type: String,
    required: true,
  },
});

const PhoneSchema = new Schema({
  cell: {
    type: Number,
    required: true,
  },
  work: {
    type: Number,
  },
});

const CarSchema = new Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const WorkAuthSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  startdate: {
    type: Date,
    required: true,
  },
  enddate: {
    type: Date,
    required: true,
  },
});

const LicenseSchema = new Schema({
  haslisence: {
    type: Boolean,
    required: true,
  },
  lisencenumber: String,
  expdate: Date,
  file: {
    type: refType,
    ref: "File",
  },
});

const OnboardingSchema = new Schema({
  employee_id: {
    type: refType,
    ref: "Employee",
    required: true,
  },
  name: {
    type: PersonSchema,
    required: true,
  },
  picture: {
    type: refType,
    ref: "File",
  },
  address: {
    type: AddressSchema,
    required: true,
  },
  phone: {
    type: PhoneSchema,
    required: true,
  },
  car: {
    type: CarSchema,
    required: true,
  },
  ssn: {
    type: Number,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  citizenship: {
    type: Boolean,
    required: true,
  },
  workauth: {
    type: WorkAuthSchema,
  },
  license: {
    type: LicenseSchema,
    required: true,
  },
  references: [
    {
      type: ContactSchema,
    },
  ],
  contacts: [
    {
      type: ContactSchema,
    },
  ],
  status: {
    type: String,
    enum: ["Not Started", "Pending", "Rejected", "Approved"],
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
});

const Onboarding =
  mongoose.models.Onboarding || mongoose.model("Onboarding", OnboardingSchema);

module.exports = Onboarding;
