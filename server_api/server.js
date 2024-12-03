"use strict";

const express = require('express');
const path = require("path");
const app = express();

app.use(
  "/uploads",
  express.static(
    path.resolve( // path fot users' uploads
      __dirname,
      "..",
      "..",
      "ancestry_architect_2024_2",
      "uploads",
    ),
    {
      maxAge: "60000", // uses milliseconds per docs
      lastModified: true,
    },
  ),
);

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Server listening port ${port}`);
});
