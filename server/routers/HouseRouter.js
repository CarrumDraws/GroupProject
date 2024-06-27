const { Router } = require("express");
const {
  getHouse,
  addHouse,
  getAllHouses,
} = require("../controllers/HouseController.js");

const {
  jwtValidation,
  isHR,
  isntHR,
} = require("../middlewares/AuthMiddleware.js");

const houseRouter = Router();

houseRouter.get("/", jwtValidation, isntHR, getHouse);
houseRouter.post("/", jwtValidation, isHR, addHouse);
houseRouter.get("/all", jwtValidation, isHR, getAllHouses);

module.exports = houseRouter;
