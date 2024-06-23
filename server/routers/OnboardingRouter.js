const { Router } = require("express");
const {
  getOnboarding,
  submitOnboarding,
  upload,
  uploadFile,
  retrieveFile,
} = require("../controllers/OnboardingController.js");

const { jwtValidation, isHR } = require("../middlewares/AuthMiddleware.js");

const onboardingRouter = Router();

onboardingRouter.get("/", jwtValidation, getOnboarding);
onboardingRouter.post("/", jwtValidation, submitOnboarding);
// onboardingRouter.post("/:employeeid", login);
// onboardingRouter.put("/:employeeid", login);
onboardingRouter.post("/upload", upload.single("picture"), uploadFile);
onboardingRouter.get("/getfile/:fileKey", retrieveFile);

module.exports = onboardingRouter;
