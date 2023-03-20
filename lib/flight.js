const nextId = require("./next-id");

class Flight {
  static AIRPORT_CITIES = {
    sfo: "san francisco",
    lax: "los angeles",
    icn: "seoul",
    yyz: "toronto",
    lga: "new york",
  };

  static titleCaseCity(cityName) {
    return cityName.split(" ").map(word => {
      return word[0].toUpperCase() + word.slice(1);
    }).join(" ");
  }

  constructor(
    destination, departure, airline,
    flightNumber, flightTime
  ) {
    destination,
    departure,
    airline,
    flightNumber,
    flightTime,
    this.id = nextId();
  }
}

module.exports = {
  Flight,
};