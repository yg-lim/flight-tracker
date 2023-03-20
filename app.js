const express = require("express");

const PORT = 3000;
const HOST = "localhost";
const app = express();
const flights = require("./lib/seed-data");

app.set("view engine", "pug");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("flights", { flights });
});

app.get("/add-flight", (req, res) => {
  res.render("add-flight");
});

app.listen(PORT, HOST, () => {
  console.log(`listening on port ${PORT}`);
});