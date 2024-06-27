const { Router } = require("express");
const multer = require("multer");
const {
  getAll,
  getOne,
  updateInfo,
  getInfo,
} = require("../controllers/EmployeeController.js");

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

const employeeRouter = Router();

employeeRouter.get("/", jwtValidation, isntHR, getInfo);
employeeRouter.put(
  "/:field",
  upload.fields([{ name: "picture", maxCount: 1 }]),
  jwtValidation,
  isntHR,
  updateInfo
);

employeeRouter.get("/all", jwtValidation, isHR, getAll);
employeeRouter.get("/:employeeid", jwtValidation, isHR, getOne);

module.exports = employeeRouter;
