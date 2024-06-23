const { Router } = require("express");
const {
  getOnboarding,
  submitOnboarding,
} = require("../controllers/OnboardingController.js");

const { jwtValidation, isHR } = require("../middlewares/AuthMiddleware.js");

const onboardingRouter = Router();

onboardingRouter.get("/", jwtValidation, getOnboarding);
onboardingRouter.post("/", jwtValidation, submitOnboarding);
// onboardingRouter.post("/:employeeid", login);
// onboardingRouter.put("/:employeeid", login);

module.exports = onboardingRouter;
