const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.get("/api/hello", (req, res) => {
  res.send({ message: "Hello World" });
});

// Export the express app
module.exports = app;
