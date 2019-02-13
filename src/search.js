const {dictionary} = require('./txt_db');
const {db} = require('../src/app').locals;

function getArrayOfDeclaredLengthWords(len) {
  return dictionary[len-3];
}

async function getWordFromDB(len) {
  let tableName = len + 'lenwords';
  let randomIndex = await db.one('SELECT CASE WHEN id = 0 THEN 1 ELSE id END FROM (SELECT ROUND(RANDOM() * (SELECT MAX(id) FROM $1~)) as id)', tableName);
  console.log(randomIndex);
  if (randomIndex) {
    let word = await db.one('SELECT * FROM $1~ WHERE id = $2', [tableName, randomIndex]);
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
