const nextId = require("./next-id");

class Flight {
  static AIRPORT_CITIES = {
    sfo: "san francisco",
    lax: "los angeles",
    icn: "seoul",
    yyz: "toronto",
    lga: "new york",
    jfk: "new york",
    ewr: "newark",
    yvr: "vancouver",
  };

  static toTitleCase(string) {
    return string.split(" ").map(word => {
      return word[0].toUpperCase() + word.slice(1);
    }).join(" ");
  }

  constructor(
    departureCode, destinationCode, airline,
    flightNumber, flightTime
  ) {
    this.departureCode = departureCode;
    this.destinationCode = destinationCode;
    this.airline = airline;
    this.flightNumber = flightNumber;
    this.flightTime = flightTime;   
    this.id = nextId();
  }
}

module.exports = Flight;