const jwt = require("jsonwebtoken");

// Stores ID, email, userisHR, name
const generateToken = (id, email, isHR) => {
  const token = jwt.sign(
    { ID: id, EMAIL: email, ISHR: isHR },
    process.env.ACCESS_TOKEN_SECRET
  );
  return token;
};

module.exports = generateToken;
