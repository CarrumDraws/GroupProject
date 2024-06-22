const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

// const userRouter = require("./routers/UserRouter.js");
// const productRouter = require("./routers/ProductRouter.js");

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

// app.use("/api/user", userRouter);
// app.use("/api/products", productRouter);

// API
// app.all("/api/*", (_req, res) => {
//   return res.status(404).json({ message: "Not Found" });
// });

module.exports = app;
