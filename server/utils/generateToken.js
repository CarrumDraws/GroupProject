const jwt = require("jsonwebtoken");

// Stores ID, email, userisHRname
const generateToken = (id, email, isHR) => {
  const token = jwt.sign({ id, email, isHR }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "6h",
  });
  return token;
};

module.exports = generateToken;
