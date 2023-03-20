const express = require("express");

const PORT = 3000;
const HOST = "localhost";
const app = express();

app.set("view engine", "pug");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, HOST, () => {
  console.log(`listening on port ${PORT}`);
});