const { Router } = require("express");
const multer = require("multer");
const {
  getOpt,
  postOpt,
  handleOpt,
  getVisaEmployees,
} = require("../controllers/OptController.js");

const {
  jwtValidation,
  isHR,
  RegisterValidation,
  RegistrationValidation,
} = require("../middlewares/AuthMiddleware.js");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const optRouter = Router();

optRouter.get("/", jwtValidation, getOpt);

optRouter.post(
  "/:type",
  upload.fields([
    { name: "fileone", maxCount: 1 },
    { name: "filetwo", maxCount: 1 },
  ]),
  jwtValidation,
  postOpt // Adds files + Updates OPT files that matches opt.status
);
optRouter.patch("/:fileid", jwtValidation, isHR, handleOpt); // Rejects / Accepts a specific file.
// On reject, adds reject to file status + adds feedback
// On Accept, adds accepted to file status + updates employee's OPT status
optRouter.get("/visaholders", jwtValidation, isHR, getVisaEmployees);

module.exports = optRouter;
