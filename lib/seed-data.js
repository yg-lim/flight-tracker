const Flight = require("./flight");

let flight1 = new Flight("SFO", "LAX", "delta", "dl 559", "08:35");
let flight2 = new Flight("YYZ", "ICN", "asiana airlines", "aa 123", "13:55");
let flight3 = new Flight("LAX", "EWR", "united", "ua 567", "06:23");
let flight4 = new Flight("YVR", "LGA", "air canada", "ac 999", "19:01");

let flights = [
  flight1,
  flight2,
  flight3,
  flight4
];

module.exports = flights;