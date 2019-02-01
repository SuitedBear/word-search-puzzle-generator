const express = require('express');
const { dictionary } = require('./db');
const { getPuzzle } = require('./apihandlers');

const app = express();
app.locals.dictionary = dictionary;

app.get('/', (req, res) => {
  res.send("It's Alive!");
//  res.sendFile(__dirname + '/index.html');
});

app.get('/puzzle', (req, res) => {
  res = getPuzzle(req, res);
  return res;
});

app.post('/feedback', (req, res) => {
  res.statusCode(404);
})

module.exports = app;
