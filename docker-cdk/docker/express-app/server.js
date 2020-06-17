const express = require("express");

const PORT = 8080;
const HOST = "0.0.0.0";

const api = express();
api.get("/", (req, res) => {
  res.send("Sample Endpoint\n");
});

api.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);