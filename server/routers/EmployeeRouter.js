const { Router } = require("express");
const {
  getAll,
  getOne,
  updateInfo,
  getInfo,
  upload,
} = require("../controllers/EmployeeController.js");

const {
  jwtValidation,
  isHR,
  RegisterValidation,
  RegistrationValidation,
} = require("../middlewares/AuthMiddleware.js");

const employeeRouter = Router();

employeeRouter.get("/", jwtValidation, getInfo);
employeeRouter.put(
  "/:field",
  upload.fields([{ name: "picture", maxCount: 1 }]),
  jwtValidation,
  updateInfo
);
// employeeRouter.get("/all", jwtValidation, isHR, getOne);
// employeeRouter.get("/:employeeid", jwtValidation, isHR, getAll);

module.exports = employeeRouter;
