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

// Define the Landlord subdocument schema
const LandlordSchema = new Schema({
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
  email: {
    type: String,
    required: true,
  },
});

// Define the House schema
const HouseSchema = new Schema({
  address: {
    type: AddressSchema,
    required: true,
  },
  landlord: {
    type: LandlordSchema,
    required: true,
  },
  members: [
    {
      type: refType,
      ref: "Employee",
    },
  ],
  beds: {
    type: Number,
    required: true,
  },
  mattresses: {
    type: Number,
    required: true,
  },
  tables: {
    type: Number,
    required: true,
  },
  chairs: {
    type: Number,
    required: true,
  },
});

const House = mongoose.model("House", HouseSchema);

module.exports = House;
