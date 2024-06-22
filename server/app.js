const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRouter = require("./routers/AuthRouter.js");

const app = express();

app.use(express.json());
// app.use(
//   cors({
//     origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
//     methods: ["GET", "POST", "PUT"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/", authRouter);

module.exports = app;
