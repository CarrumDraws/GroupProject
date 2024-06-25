const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const AddressSchema = new Schema({
  buildaptnum: {
    type: Number,
  },
  street: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip: {
    type: String,
  },
});

const PersonSchema = new Schema({
  firstname: {
    type: String,
  },
  middlename: String,
  lastname: {
    type: String,
  },
  preferredname: String,
});

const ContactSchema = new Schema({
  firstname: {
    type: String,
  },
  middlename: String,
  lastname: {
    type: String,
  },
  phone: {
    type: Number,
  },
  email: { type: String, required: true },
  relationship: {
    type: String,
  },
});

const PhoneSchema = new Schema({
  cell: {
    type: Number,
  },
  work: {
    type: Number,
  },
});

const CarSchema = new Schema({
  make: {
    type: String,
  },
  model: {
    type: String,
  },
  color: {
    type: String,
  },
});

const WorkAuthSchema = new Schema({
  workauth: {
    type: String,
  },
  title: {
    type: String,
  },
  startdate: {
    type: Date,
  },
  enddate: {
    type: Date,
  },
});

const LicenseSchema = new Schema({
  haslicense: {
    type: Boolean,
  },
  licensenumber: String,
  expdate: Date,
  licensefile: {
    type: refType,
    ref: "File",
  },
});

const OnboardingSchema = new Schema({
  employee_id: {
    type: refType,
    ref: "Employee",
  },
  name: {
    type: PersonSchema,
  },
  picture: {
    type: refType,
    ref: "File",
  },
  address: {
    type: AddressSchema,
  },
  phone: {
    type: PhoneSchema,
  },
  car: {
    type: CarSchema,
  },
  ssn: {
    type: Number,
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  citizenship: {
    type: Boolean,
  },
  citizenshiptype: {
    type: String,
    enum: ["Green Card", "Citizen"],
  },
  workauth: {
    type: WorkAuthSchema,
  },
  license: {
    type: LicenseSchema,
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
  },
  feedback: {
    type: String,
  },
});

const Onboarding =
  mongoose.models.Onboarding || mongoose.model("Onboarding", OnboardingSchema);

module.exports = Onboarding;
