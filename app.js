const express = require("express");
require("dotenv").config();
const passport = require("passport");
const generateData = require("./generateData.js");

require("./middlewares/passport");

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const utilsHelper = require("./helpers/utils.helper");

const app = express();
app.use(passport.initialize());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const mongoose = require("mongoose");
const { compare } = require("bcryptjs");
const mongoURI = process.env.MONGODB_URI;

/* DB Connections */
mongoose
  .connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Mongoose connected to ${mongoURI}`))
  .catch((err) => console.log(err));

app.use("/api", indexRouter);

// catch 404 and forard to error handler
app.use((req, res, next) => {
  const err = new Error("404 - Resource not found");
  next(err);
});

/* Initialize Error Handling */
app.use((err, req, res, next) => {
  console.log("ERROR", err);
  const statusCode = err.message.split(" - ")[0];
  const message = err.message.split(" - ")[1];
  if (!isNaN(statusCode)) {
    utilsHelper.sendResponse(res, statusCode, false, null, { message }, null);
  } else {
    utilsHelper.sendResponse(
      res,
      500,
      false,
      null,
      { message: err.message },
      "Internal Server Error"
    );
  }
});

module.exports = app;
