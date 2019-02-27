const {dictionary} = require('./txt_db');
// const {db} = require('./app').locals;
const { db } = require('./db');

// function getArrayOfDeclaredLengthWords(len) {
//   return dictionary[len-3];
// }

function getWord(len) {
  let filteredDict = dictionary[len-3];
  if (filteredDict == undefined) return null;
  let word = filteredDict[Math.floor(Math.random() * (filteredDict.length+1))];
  return word;
}

async function getWordFromDB(len) {
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
  } catch(e) {
    console.log('error while getting word from db: ', e);
    return null;
  }
}

async function getIndexRange(tableName) {
  try {
    let indexRange = await db.task(async task => {
      let minIndex = await task.one('SELECT * FROM $1~ WHERE difficulty > 40 LIMIT 1', tableName);
      let maxIndex = await task.one('SELECT * FROM $1~ WHERE difficulty < 60 ORDER BY id DESC LIMIT 1', tableName);
      return {
        minIndex: minIndex.id,
        maxIndex: maxIndex.id,
      }
    });
    return indexRange;
  } catch(e) {
    console.log('error while getting indexes from db: ', e);
    return null;
  }
}

async function sortTable(tableName) {

}

module.exports = {
  getWord: getWord,
  getWordFromDB: getWordFromDB,
  getIndexRange: getIndexRange,
};
