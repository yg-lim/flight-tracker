const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("express-flash");
const { body, validationResult } = require("express-validator");

const PORT = 3000;
const HOST = "localhost";
const app = express();
const flights = require("./lib/seed-data");
const Flight = require("./lib/flight");

app.set("view engine", "pug");

app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }))
app.use(session({
  name: "flight-tracker-session-id",
  resave: false,
  saveUninitialized: true,
  secret: "not-very-secure",
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.body.flash;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/flights");
});

app.get("/flights", (req, res) => {
  res.render("flights", { flights });
});

app.get("/add-flight", (req, res) => {
  res.render("add-flight");
});

app.post("/flights", (req, res) => {
  flights.push(new Flight(
    req.body.departureCode,
    req.body.destinationCode,
    req.body.airline,
    req.body.flightNumber,
    req.body.flightTime,
  ));

  req.flash("success", "Flight has been added to your list!");
  res.redirect("/flights");
});

app.listen(PORT, HOST, () => {
  console.log(`listening on port ${PORT}`);
});