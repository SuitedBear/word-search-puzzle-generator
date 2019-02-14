const {dictionary} = require('./txt_db');
// const {db} = require('./app').locals;
const { db } = require('./db');

function getArrayOfDeclaredLengthWords(len) {
  return dictionary[len-3];
}

async function getWordFromDB(len) {
  let tableName = len + 'lenwords';
  let maxIndex = await db.one('SELECT MAX(id) FROM $1~', tableName);
  let randomIndex = Math.floor(Math.random() * (maxIndex.max)) + 1;
  let word = null;
  if (randomIndex) {
    let wordObj = await db.one('SELECT * FROM $1~ WHERE id = $2', [tableName, randomIndex]).catch(e => {
      console.log('error while getting word from db: ', e);
      return null;
    });
    word = wordObj ? wordObj.word : null;
  }
  return word;
}

function getWord(len) {
  let filteredDict = getArrayOfDeclaredLengthWords(len);
  if (filteredDict == undefined) return null;
  let word = filteredDict[Math.floor(Math.random() * (filteredDict.length+1))];
  return word;
}

module.exports = {
  getWord: getWord,
  getWordFromDB: getWordFromDB
};
