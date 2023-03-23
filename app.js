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

const toTitleCase = string => {
  return string.split(" ").map(word => {
    return word[0].toUpperCase() + word.slice(1);
  }).join(" ");
}

const airportCode = typeOfCode => {
  return body(`${typeOfCode}Code`)
          .trim()
          .isLength({ min: 1 })
          .withMessage(`${typeOfCode[0].toUpperCase() + typeOfCode.slice(1)} airport is required.`)
          .bail()
          .customSanitizer(input => input.toUpperCase())
          .custom(input => /^[A-Z]{3}$/.test(input))
          .withMessage(`${typeOfCode[0].toUpperCase() + typeOfCode.slice(1)} airport should be 3 characters.`);
};

const flightInfoValidation = [
  airportCode("departure"),
  airportCode("destination"),
  body("airline")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Airline is required.")
    .bail()
    .customSanitizer(value => toTitleCase(value))
    .isLength({ max: 25 })
    .withMessage("Maximum length of characters for airline is 25.")
    .bail()
    .custom(input => /^[a-z]+(\s)*[a-z]*$/i.test(input))
    .withMessage("Invalid characters in Airline. Please use alphabetical characters and spaces only."),
  body("flightNumber")
    .trim()
    .isLength({ min: 1})
    .withMessage("Flight number is required.")
    .bail()
    .customSanitizer(input => input.toUpperCase())
    .custom(input => /^[A-Z]{2}\s\d{3}$/.test(input))
    .withMessage("Flight number must match IATO format of XX 123."),
  body("flightTime")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Flight time is required.")
    .bail()
    .custom(input => /^(0[0-9]|1[0-9]|2[0-4]):(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])$/.test(input))
    .withMessage("Invalid time. Time must be in military 00:00 format.")
];

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

app.post("/flights",
  flightInfoValidation,
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(error => req.flash("error", error.msg));
      res.render("add-flight", { flash: req.flash(), ...req.body });
    } else {
      flights.push(new Flight(
        req.body.departureCode,
        req.body.destinationCode,
        req.body.airline,
        req.body.flightNumber,
        req.body.flightTime,
      ));
  
      req.flash("success", "Flight has been added to your list!");
      res.redirect("/flights");
    }
  }
);

app.get("/flights/:id/edit", (req, res, next) => {
  let id = +req.params.id;
  let flight = flights.find(flight => flight.id === id);
  if (!flight) next(new Error("Not found."));

  res.render("edit-flight", { ...flight });
});

app.post("/flights/:id/edit",
  flightInfoValidation,
  (req, res, next) => {
    let id = +req.params.id;
    let flight = flights.find(flight => flight.id === id);
    if (!flight) {
      next(new Error("Not found."));
    } else {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach(error => req.flash("error", error.msg));
        res.render("edit-flight", {
          flash: req.flash(),
          ...flight,
        });
      } else {
        console.log("validation successful");
        console.log(req.body);
        for (let input in req.body) {
          flight[input] = req.body[input];
        }
    
        req.flash("success", "The flight details have been changed.");
        res.redirect("/");
      }
    }
  }
);

app.use((err, req, res, next_) => {
  res.status(404);
  res.send(err.message);
  console.log(err);
});

app.listen(PORT, HOST, () => {
  console.log(`listening on port ${PORT}`);
});