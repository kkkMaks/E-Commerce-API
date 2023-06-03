require("dotenv").config();
require("express-async-errors");

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./src/docs/swagger.yaml");

const connectDB = require("./db/connect");

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const uploadRouter = require("./routes/upload");
const reviewsRouter = require("./routes/reviews");
const ordersRouter = require("./routes/orders");

const { authenticatedUser } = require("./middleware/authentication");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

app.set("trust proxy", 1);
app.use(rateLimit({ windowMs: 60 * 1000, max: 600 }));
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(mongoSanitize());

// middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// routes test
app.get("/", (req, res) => {
  return res.send(
    `<h1>Welcome to E-Commerce API</h1> 
    <h2><a href='/api/v1/docs'>Documentation</a></h1>`
  );
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter, uploadRouter);
app.use("/api/v1/reviews", reviewsRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get("/api/v1/credentials/get-test-credentials", (req, res) => {
  return res.status(200).json({
    admin: {
      email: "admin@gmail.com",
      password: "adminadmin",
    },
    user: {
      email: "test@gmail.com",
      password: "testtest",
    },
  });
});

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
