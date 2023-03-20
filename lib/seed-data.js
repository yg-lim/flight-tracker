const Flight = require("./flight");

let flight1 = new Flight("sfo", "lax", "delta", "dl 559", "08:35");
let flight2 = new Flight("yyz", "icn", "asiana airlines", "aa 123", "13:55");
let flight3 = new Flight("lax", "ewr", "united", "ua 567", "06:23");
let flight4 = new Flight("yvr", "lga", "air canada", "ac 999", "19:01");

let flights = [
  flight1,
  flight2,
  flight3,
  flight4
];

module.exports = flights;