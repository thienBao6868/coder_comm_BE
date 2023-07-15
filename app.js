const express = require("express");
require("dotenv").config();

const cors = require("cors")
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const {sendResponse} = require("./helpers/utils")
const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);

//connect MongoDB
const mongooes = require("mongoose");
const mongoURI = process.env.MONGODB_URI;
mongooes
  .connect(mongoURI)
  .then(() => console.log("Connected MongoDB"))
  .catch((err) => console.log(err)); 

// Error Hanlers
// catch 404
app.use((req,res,next)=>{
    const err =  new Error("Not Found page")
    next(err)
})
/* Initialize Error Handling */
app.use((err, req, res, next) => {
    console.log("ERROR", err);
      return sendResponse(
        res,
        err.statusCode ? err.statusCode : 500,
        false,
        null,
        { message: err.message },
        err.isOperational ? err.errorType : "Internal Server Error"
      );
  });   

module.exports = app;
