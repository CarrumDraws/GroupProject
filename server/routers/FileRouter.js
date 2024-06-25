const { Router } = require("express");
const { retrieveFile } = require("../controllers/FileController.js");

const { jwtValidation, isHR } = require("../middlewares/AuthMiddleware.js");

const fileRouter = Router();

fileRouter.get("/:fileid", retrieveFile);

module.exports = fileRouter;
