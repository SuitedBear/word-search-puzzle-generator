const express = require('express');
const { dictionary } = require('./db');
const { generatePuzzle } = require('./grid');

const app = express();
app.locals.dictionary = dictionary;

app.get('/', (req, res) => {
  res.send("It's Alive!");
//  res.sendFile(__dirname + '/index.html');
});

app.get('/puzzle', (req, res) => {
  let width=req.query.width;
  let height=req.query.height;
  let words=req.query.words;
  let puzzle = generatePuzzle(width, height, words);
  res.send(JSON.stringify(puzzle));
});

app.post('/feedback', (req, res) => {
  res.statusCode(404);
})

module.exports = app;
