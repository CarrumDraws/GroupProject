const { Router } = require("express");
const { getReports } = require("../controllers/ReportController.js");

const {
  jwtValidation,
  isHR,
  isntHR,
} = require("../middlewares/AuthMiddleware.js");

const reportRouter = Router();

reportRouter.get("/", jwtValidation, isntHR, getReports);
// reportRouter.get("/:reportid", jwtValidation, getReport);
// reportRouter.post("/", jwtValidation, isntHR, addReport);
// reportRouter.post("/:reportid", jwtValidation, addComment);
// reportRouter.put("/:reportid", jwtValidation, editComment);
// reportRouter.get("/:houseid", jwtValidation, isHR, getHouseReports);
// reportRouter.patch("/:reportid", jwtValidation, isHR, toggleReport);

module.exports = reportRouter;
