"use strict";

const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();

app.use(cors())
app.options('/api/login', cors())

const port = process.env.PORT || 8080;

app.post("/api/login", urlencodedParser, function (req, res) {
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
