const express = require('express');
// const { db } = require('./db');
const { getPuzzle } = require('./apihandlers');

const app = express();
// app.locals.db = db;

app.get('/', (req, res) => {
  res.send("It's Alive!");
//  res.sendFile(__dirname + '/index.html');
});

app.get('/puzzle', (req, res) => {
  getPuzzle(req, res);
});

app.post('/feedback', (req, res) => {
  res.statusCode(404);
})

module.exports = app;
