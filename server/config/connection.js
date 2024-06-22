const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI);

const db = mongoose.connection;

module.exports = db;
