const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRouter = require("./routers/AuthRouter.js");
const onboardingRouter = require("./routers/OnboardingRouter.js");

const app = express();

app.use(express.json());

// Frontend (React): "http://localhost:5173"
// Frontend (Angular): "http://localhost:4200"
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/", authRouter);
app.use("/onboarding", onboardingRouter);

module.exports = app;
