const { Router } = require("express");
const multer = require("multer");
const {
  getOnboarding,
  submitOnboarding,
  reviewOnboardingApps,
  getEmployeeOnboarding,
  handleEmployeeOnboarding,
  uploadFile,
  retrieveFile,
} = require("../controllers/OnboardingController.js");

const {
  jwtValidation,
  isHR,
  isntHR,
} = require("../middlewares/AuthMiddleware.js");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const onboardingRouter = Router();

onboardingRouter.get("/", jwtValidation, isntHR, getOnboarding);
onboardingRouter.post(
  "/",
  upload.fields([
    { name: "picture", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "optreciept", maxCount: 1 },
  ]),
  jwtValidation,
  isntHR,
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

// TESTING ROUTES ----

onboardingRouter.post("/upload", upload.single("picture"), uploadFile);
onboardingRouter.get("/getfile/:fileKey", retrieveFile);

module.exports = onboardingRouter;
