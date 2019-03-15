const { dictionary } = require('./txt_db');
// const {db} = require('./app').locals;
const { db } = require('./db');

function getWord (len) {
  let filteredDict = dictionary[len - 3];
  if (filteredDict == null) return null;
  let word = filteredDict[Math.floor(Math.random() * (filteredDict.length + 1))];
  return word;
}

async function getWordFromDB (len) {
  let tableName = len + 'lenwords';
  try {
    let maxIndex = await db.one('SELECT MAX(id) FROM $1~', tableName);
    let randomIndex = Math.floor(Math.random() * (maxIndex.max)) + 1;
    let word = null;
    if (randomIndex) {
      let wordObj = await db.one('SELECT * FROM $1~ WHERE id = $2', [tableName, randomIndex]);
      word = wordObj ? wordObj.word : null;
    }
    return word;
  } catch (e) {
    console.log('error while getting word from db: ', e);
    return null;
  }
}

async function getIndexRange (tableName) {
  try {
    let indexRange = await db.task(async task => {
      let minIndex =
          await task.one('SELECT * FROM $1~ WHERE difficulty > $2 LIMIT 1', [tableName, 40]);
      let maxIndex =
          await task.one('SELECT * FROM $1~ WHERE difficulty < $2 ORDER BY id DESC LIMIT 1', [tableName, 60]);
      return {
        minIndex: minIndex.id,
        maxIndex: maxIndex.id
      };
    });
    return indexRange;
  } catch (e) {
    console.log('error while getting indexes from db: ', e);
    return null;
  }
}

async function sortTable (tableName) {
  try {
    return true;
  } catch (e) {
    console.log(`error while sorting ${tableName}:\n${e}`);
    return false;
  }
}

async function updateWord (word, newDifficulty) {
  let tableName = word.length + 'lenwords';
  try {
    // update in db
    console.log(word, newDifficulty);
    return true;
  } catch (e) {
    console.log(`error updating ${word} difficulty to ${newDifficulty}:\n${e}`);
    return false;
  }
}

module.exports = {
  getWord: getWord,
  getWordFromDB: getWordFromDB,
  getIndexRange: getIndexRange,
  updateWord: updateWord
};