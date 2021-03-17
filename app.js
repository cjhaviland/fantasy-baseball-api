// Imports
require("dotenv").config();

const express = require("express"),
  logger = require("morgan"),
  session = require("express-session"),
  cors = require("cors"),
  createError = require("http-errors"),
  path = require("path");

// Routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const yahooRouter = require("./routes/yahoo");

// New Express App
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// App Middleware Setup
app.use(cors());
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  next()
})
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use('/yahoo', yahooRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
