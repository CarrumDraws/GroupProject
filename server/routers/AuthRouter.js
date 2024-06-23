const { Router } = require("express");
const {
  sendRegistrationToken,
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

authRouter.post(
  "/registration",
  jwtValidation,
  isHR,
  RegistrationValidation,
  sendRegistrationToken
);
authRouter.post("/register", RegisterValidation, register);
authRouter.post("/login", login);

module.exports = authRouter;
