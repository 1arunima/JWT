require("dotenv").config();
require("express-async-errors");

const express = require("express");
const connectDB = require("./DB/connectDB");
const port = process.env.PORT || 5000;

const app = express();

const userRoutes = require("./Routes/userR");
const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

app.use(express.json());
app.use("/api/user", userRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`port is running at ${port}`);
    });
  } catch (error) {
    console.log(`somethings wrong with your port`, error);
  }
};
start();
