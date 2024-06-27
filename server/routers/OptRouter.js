const { Router } = require("express");
const multer = require("multer");
const {
  getOpt,
  postOpt,
  handleOpt,
  getVisaEmployees,
  sendNotification,
} = require("../controllers/OptController.js");

const {
  jwtValidation,
  isHR,
  isntHR,
  RegisterValidation,
  RegistrationValidation,
} = require("../middlewares/AuthMiddleware.js");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const optRouter = Router();

optRouter.get("/", jwtValidation, isntHR, getOpt);

// Adds files + Updates OPT files that matches opt.status
optRouter.post(
  "/:type",
  upload.fields([
    { name: "fileone", maxCount: 1 },
    { name: "filetwo", maxCount: 1 },
  ]),
  jwtValidation,
  isntHR,
  postOpt
);

// Rejects / Accepts a specific file.
// On reject, adds reject to file status + adds feedback
// On Accept, adds accepted to file status + updates employee's OPT status
optRouter.patch("/:fileid", jwtValidation, isHR, handleOpt);

// Gets all visaholders (noncitizens) data, and an array of links to their OPT files
// Note: If pending, show their pending files only (Note that I-983 has 2 pending files)
// Else, show all OPT files
optRouter.get("/visaholders", jwtValidation, isHR, getVisaEmployees);

// Takes in employeeid, sends notification to their email
optRouter.get(
  "/visaholders/:employeeid",
  jwtValidation,
  isHR,
  sendNotification
);

module.exports = optRouter;
