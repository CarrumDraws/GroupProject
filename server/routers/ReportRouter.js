const { Router } = require("express");
const {
  getReports,
  getReport,
  addReport,
  addComment,
  editComment,
  getHouseReports,
  toggleReport,
} = require("../controllers/ReportController.js");

const {
  jwtValidation,
  isHR,
  isntHR,
} = require("../middlewares/AuthMiddleware.js");

const reportRouter = Router();

// Gets array of YOUR reports
reportRouter.get("/", jwtValidation, isntHR, getReports);
// Gets a report and the comments of the report
reportRouter.get("/:reportid", jwtValidation, getReport);
reportRouter.post("/", jwtValidation, isntHR, addReport);
reportRouter.post("/:reportid", jwtValidation, addComment);
reportRouter.put("/:commentid", jwtValidation, editComment);
reportRouter.get("/house/:houseid", jwtValidation, isHR, getHouseReports);
reportRouter.patch("/:reportid", jwtValidation, isHR, toggleReport);

module.exports = reportRouter;
