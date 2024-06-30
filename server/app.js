const express = require("express");

const cors = require("cors");
const morgan = require("morgan");

const authRouter = require("./routers/AuthRouter.js");
const onboardingRouter = require("./routers/OnboardingRouter.js");
const employeeRouter = require("./routers/EmployeeRouter.js");
const optRouter = require("./routers/OptRouter.js");
const houseRouter = require("./routers/HouseRouter.js");
const reportRouter = require("./routers/ReportRouter.js");
const fileRouter = require("./routers/FileRouter.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Frontend (React): "http://localhost:5173"
// Frontend (Angular): "http://localhost:4200"
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/", authRouter);
app.use("/onboarding", onboardingRouter);
app.use("/employee", employeeRouter);
app.use("/opt", optRouter);
app.use("/house", houseRouter);
app.use("/report", reportRouter);
app.use("/file", fileRouter);

module.exports = app;
