const jwt = require("jsonwebtoken");
const validator = require("validator");
const Employee = require("../models/Employee.js");

const jwtValidation = (req, res, next) => {
  try {
    // Get Token from Header
    const token = req.headers?.authorization?.split(" ")[1]; // Gets rid of "Bearer"
    if (!token || validator.isEmpty(token)) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // decode token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (
      !decoded.id ||
      !validator.isMongoId(decoded.id) ||
      !decoded.email ||
      !decoded.isHR
    ) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.body.id = decoded.id; // Assign id to req.body
    req.body.email = decoded.email; // Assign email to req.body
    req.body.isHR = decoded.isHR; // Assign isHR to req.body

    next();
  } catch (error) {
    console.error("JWT validation error:", error);
    return res.status(401).json({
      message: "jwtValidation Failed",
    });
  }
};

const isHR = async (req, res, next) => {
  try {
    let { isHR } = req.body;
    if (!isHR) {
      return res.status(403).json({
        message: "Unauthorized: Not HR",
      });
    }
    next();
  } catch (error) {
    console.error("isHR error:", error);
    return res.status(500).json({
      message: "isHR Failed",
    });
  }
};

const RegisterValidation = (req, res, next) => {
  const { password, email } = req.body;

  // Sanitize inputs
  req.body.password = validator.escape(password.trim());
  req.body.email = validator.normalizeEmail(email.trim());

  // Validate Password and Email
  if (
    !password ||
    !email ||
    validator.isEmpty(password) ||
    validator.isEmpty(email)
  ) {
    return res.status(400).json({ message: "Missing required fields!" });
  }

  //   if (!validator.isEmail(email)) {
  //     console.log("Invalid Email!");
  //     return res.status(400).json({ message: "Invalid Email!" });
  //   }

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/;
  if (!passwordPattern.test(password)) {
    return res.status(400).json({
      message:
        "Password must be 6-10 characters long and include uppercase, lowercase, number, and special character.",
    });
  }

  console.log(req.body.email);
  next();
};

module.exports = { jwtValidation, isHR, RegisterValidation };