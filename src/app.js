const express = require('express');
const bodyParser = require('body-parser');
// const { db } = require('./db');
const { getPuzzle, fetchFeedback } = require('./apihandlers');
const { sortTable, getRanges } = require('./dbhandlers');

// db cluster and index update at init

const app = express();
app.use(bodyParser.json());
// app.locals.db = db;
app.locals.minWordLength = 3;
app.locals.maxWordLength = 15;

// building locals
async function buildLocals (minLen, maxLen) {
  let dbIndexes = new Map();
  try {
    for (let i = minLen; i <= maxLen; i++) {
      let tableName = i + 'lenwords';
      // dbIndexes.set(tableName, await sortTable(tableName));
      dbIndexes.set(tableName, await getRanges(tableName));
    }
  } catch (e) {
    console.log('there was a problem while building locals!\n', e);
    return null;
  }
  return dbIndexes;
}

(async function () {
  app.locals.dbIndexes = await buildLocals(app.locals.minWordLength, app.locals.maxWordLength);
  app.emit('ready');
})();

app.get('/', (req, res) => {
  res.send("It's Alive!");
  console.log(app.locals.dbIndexes);
// res.sendFile(__dirname + '/index.html');
});

app.get('/puzzle', (req, res) => {
  getPuzzle(req, res);
});

app.post('/feedback', (req, res) => {
  let feedbackTable = req.body;
  console.log(feedbackTable);
  let wordRegex = /^[^\W_0-9]{3,15}$/;
  let difficultyRegex = /^\d\d?$/;
  const feedbackError = new Error('feedback format');
  try {
    for (let row in feedbackTable) {
      console.log(row, feedbackTable[row]);
      if (!(wordRegex.test(row) && difficultyRegex.test(feedbackTable[row]))) {
        throw feedbackError;
      }
    }
    // res before fetching data to db
    res.status(202).send('Thank You for feedback!');
    fetchFeedback(feedbackTable);
  } catch (e) {
    console.log(`error in feedback: ${e}`);
    if (e === feedbackError) {
      res.status(400).send('wrong feedback format!');
    } else {
      res.status(500).send('there was an internal server problem, sorry :<');
    }
  }
});

// test endpoint
app.get('/cluster', (req, res) => {
  try {
    sortTable('12lenwords');
    res.status(200).send('Clustered!');
  } catch (e) {
    console.log('clustering error:\n', e);
  }
});

module.exports = app;
