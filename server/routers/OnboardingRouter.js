const { Router } = require("express");
const {
  getOnboarding,
  submitOnboarding,
  reviewOnboardingApps,
  getEmployeeOnboarding,
  handleEmployeeOnboarding,
  upload,
  uploadFile,
  retrieveFile,
} = require("../controllers/OnboardingController.js");

const { jwtValidation, isHR } = require("../middlewares/AuthMiddleware.js");

const onboardingRouter = Router();

onboardingRouter.get("/", jwtValidation, getOnboarding);
onboardingRouter.post(
  "/",
  upload.fields([
    { name: "picture", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "optreciept", maxCount: 1 },
  ]),
  jwtValidation,
  submitOnboarding
);
onboardingRouter.get("/all", jwtValidation, isHR, reviewOnboardingApps);

onboardingRouter.get(
  "/:employeeid",
  jwtValidation,
  isHR,
  getEmployeeOnboarding
);
onboardingRouter.put(
  "/:employeeid",
  jwtValidation,
  isHR,
  handleEmployeeOnboarding
);
// onboardingRouter.put("/:employeeid", login);

onboardingRouter.post("/upload", upload.single("picture"), uploadFile);
onboardingRouter.get("/getfile/:fileKey", retrieveFile);

module.exports = onboardingRouter;
