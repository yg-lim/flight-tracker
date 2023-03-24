const nextId = require("./next-id");

class Flight {
  static makeFlight(rawFlight) {
    return Object.assign(new Flight(), rawFlight);
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