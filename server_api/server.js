"use strict";

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const path = require("path");
const app = express();

app.use(cors())

app.use(
  "/uploads",
  express.static(
    path.resolve(
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


app.options('/api/auth/login', cors())

const port = process.env.PORT || 3000;

app.post("/api/auth/login", urlencodedParser, function (req, res) {
  res.set('Access-Control-Allow-Origin', '*');     

  if(!req.body) return res.sendStatus(400);
  
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);

  setTimeout(() => {
    const user = {
      code: 200,
      payload: {
        id: 123,
        email: email,
        name: 'Aboba',
      }
    };
    res.json(user);
  },2000);
});

app.get('/', function(req, res){
  console.log('nice!');
  res.sendStatus(404);
});

app.listen(port, function () {
  console.log(`Server listening port ${port}`);
});
