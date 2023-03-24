const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("express-flash");
const { body, validationResult } = require("express-validator");
const store = require("connect-loki");

const PORT = 3000;
const HOST = "localhost";
const app = express();
const Flight = require("./lib/flight");
const LokiStore = store(session);

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
          .withMessage(`${typeOfCode[0].toUpperCase() + typeOfCode.slice(1)} airport should be 3 characters.`)
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
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000,
    path: "/",
    secure: false,
  },
  name: "flight-tracker-session-id",
  resave: false,
  saveUninitialized: true,
  secret: "not-very-secure",
  store: new LokiStore({}),
}));

app.use(flash());

app.use((req, res, next) => {
  let flights = [];
  
  if ("flights" in req.session) {
    console.log(req.session.flights);
    req.session.flights.forEach(flight => {
      flights.push(Flight.makeFlight(flight));
    });
  }

  req.session.flights = flights;
  next();
});

app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});


app.get("/", (req, res) => {
  res.redirect("/flights");
});

app.get("/flights", (req, res) => {
  console.log(req.session.flights);
  res.render("flights", { flights: req.session.flights });
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
      req.session.flights.push(new Flight(
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
  let flight = req.session.flights.find(flight => flight.id === id);
  if (!flight) next(new Error("Not found."));

  res.render("edit-flight", { flight });
});

app.post("/flights/:id/edit",
  flightInfoValidation,
  (req, res, next) => {
    let id = +req.params.id;
    let flight = req.session.flights.find(flight => flight.id === id);
    if (!flight) {
      next(new Error("Not found."));
    } else {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach(error => req.flash("error", error.msg));
        res.render("edit-flight", {
          flash: req.flash(),
          flight,
        });
      } else {
        flight.departureCode = req.body.departureCode;
        flight.destinationCode = req.body.destinationCode;
        flight.airline = req.body.airline;
        flight.flightNumber = req.body.flightNumber;
        flight.flightTime = req.body.flightTime;
    
        req.flash("success", "The flight details have been changed.");
        res.redirect(`/flights/${id}/edit`);
      }
    }
  }
);

app.post("/flights/:id/delete", (req, res, next) => {
  let id = +req.params.id;
  let flightIndex = req.session.flights.findIndex(flight => flight.id === id);
  if (flightIndex === -1) {
    next(new Error("Not found."));
  } else {
    req.session.flights.splice(flightIndex, 1);
    req.flash("success", "The flight has been deleted from your list.");
    res.redirect("/flights");
  }
});

app.use((err, req, res, next_) => {
  res.status(404);
  res.send(err.message);
});

app.listen(PORT, HOST, () => {
  console.log(`listening on port ${PORT}`);
});