require("dotenv").config();
require("express-async-errors");

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./db/connect");

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const app = express();

// middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
// routes

app.get("/", (req, res) => {
  console.log(req.cookies);
  return res.status(200).json({ msg: "Hello world" });
});

app.get("/api/v1", (req, res) => {
  // console.log(req.cookies);
  console.log(req.signedCookies);
  return res.status(200).json({ msg: "Hello world" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);

// error handler middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log("Connected to the database");
    app.listen(port, console.log(`Server is listening on port ${port} ...`));
  } catch (error) {
    console.log(error);
  }
};

start();
