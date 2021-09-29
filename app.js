const express = require("express");
const app = express();

const movieRoute = require("./routes")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1", movieRoute);

module.exports = app;
