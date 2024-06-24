const { Router } = require("express");
const {
  sendRegistrationToken,
  getRegistrationTokens,
  register,
  login,
} = require("../controllers/AuthController.js");

const {
  jwtValidation,
  isHR,
  RegisterValidation,
  RegistrationValidation,
} = require("../middlewares/AuthMiddleware.js");

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", RegisterValidation, register);
authRouter.post(
  "/registration",
  jwtValidation,
  isHR,
  RegistrationValidation,
  sendRegistrationToken
);
authRouter.get(
  "/registrationtokens",
  jwtValidation,
  isHR,
  getRegistrationTokens
);

module.exports = authRouter;
