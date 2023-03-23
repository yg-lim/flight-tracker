const Flight = require("./flight");

let flight1 = new Flight("SFO", "LAX", "Delta", "DL 559", "08:35");
let flight2 = new Flight("YYZ", "ICN", "Asiana Airlines", "AA 123", "13:55");
let flight3 = new Flight("LAX", "EWR", "United", "UA 567", "06:23");
let flight4 = new Flight("YVR", "LGA", "Air Canada", "AC 999", "19:01");

let flights = [
  flight1,
  flight2,
  flight3,
  flight4
];

module.exports = flights;