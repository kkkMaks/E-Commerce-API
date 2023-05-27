require("dotenv").config();
require("express-async-errors");

const express = require("express");
const morgan = require("morgan");

const connectDB = require("./db/connect");

const authRouter = require("./routes/auth");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const app = express();

// middleware
app.use(morgan("tiny"));
app.use(express.json());

// routes

app.get("/", (req, res) => {
  return res.status(200).json({ msg: "Hello world" });
});

app.use("/api/v1/auth", authRouter);

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
