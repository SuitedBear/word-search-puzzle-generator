const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const { db } = require('./db');
const { getPuzzle, fetchFeedback } = require('./apihandlers');
const { sortTable, getRanges } = require('./dbhandlers');

// db cluster and index update at init

const app = express();
app.use(cors());
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

function dateCheck (lastUpdateTime) {
  let actualTime = new Date();
  let updateTime = new Date(lastUpdateTime);
  // updateTime.setHours(lastUpdateTime.getHours() + 24);
  // for testing
  updateTime.setMinutes(lastUpdateTime.getMinutes() + 2);
  return (actualTime > updateTime) ? true : false;
}

function updateLocals(feedbackTable, locals) {
  fetchFeedback(feedbackTable).then(update => {
    let checkDate = dateCheck(locals.lastUpdate);
    if (update && checkDate) {
      return buildLocals(locals.minWordLength, locals.maxWordLength);
    } else {
      return null;
    }
  }).then(newIndexes => {
    if (newIndexes != null) {
      locals.dbIndexes = newIndexes;
      locals.lastUpdate = new Date();
    }
  }).catch(e => console.log(`There was a problem fetching data: ${e}`));
}

(async function () {
  app.locals.dbIndexes = await buildLocals(app.locals.minWordLength, app.locals.maxWordLength);
  app.locals.lastUpdate = new Date();
  console.log(`Clustered at ${app.locals.lastUpdate}`);
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
  try {
    for (let row in feedbackTable) {
      if (!(wordRegex.test(row) && difficultyRegex.test(feedbackTable[row]))) {
        throw new Error('feedback format');
      }
    }
    res.status(202).send('Thank You for feedback!');
    updateLocals(feedbackTable, req.app.locals);
  } catch (e) {
    console.log(`error in feedback: ${e}`);
    res.status(400).send('wrong feedback format!');
  }
});

// test endpoint
// app.get('/cluster', (req, res) => {
//   try {
//     sortTable('12lenwords');
//     res.status(200).send('Clustered!');
//   } catch (e) {
//     console.log('clustering error:\n', e);
//   }
// });

module.exports = app;
