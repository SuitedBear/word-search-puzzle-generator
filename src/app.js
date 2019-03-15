const express = require('express');
const bodyParser = require('body-parser');
// const { db } = require('./db');
const { getPuzzle, fetchFeedback } = require('./apihandlers');

// db cluster and index update at init

const app = express();
app.use(bodyParser.json());
// app.locals.db = db;

app.get('/', (req, res) => {
  res.send("It's Alive!");
// res.sendFile(__dirname + '/index.html');
});

app.get('/puzzle', (req, res) => {
  getPuzzle(req, res);
});

app.post('/feedback', (req, res) => {
  // sanitization
  let feedbackTable = req.body;
  // res before fetching data to db
  res.status(200).send('Thank You for feedback!');
  fetchFeedback(feedbackTable);
});

module.exports = app;
