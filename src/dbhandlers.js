const { dictionary } = require('./txt_db');
const { db } = require('./db');

function getWord (len) {
  let filteredDict = dictionary[len - 3];
  if (filteredDict == null) return null;
  let word = filteredDict[Math.floor(Math.random() * (filteredDict.length + 1))];
  return word;
}

async function getWordFromDB (tableName, indexRange) {
  try {
    let { minIndex, maxIndex } = indexRange;
    // include min & max indexes
    console.log(minIndex, maxIndex);
    let randomRange = maxIndex - minIndex;
    // let maxIndex = await db.one('SELECT MAX(id) FROM $1~', tableName);
    let randomIndex = Math.floor(Math.random() * (randomRange)) + minIndex;
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
          await task.one('SELECT * FROM $1~ WHERE difficulty > $2 ORDER BY id LIMIT 1', [tableName, 40]);
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
  let indexName = tableName + '_diff_index';
  try {
    await db.tx(transaction => {
      transaction.none('CLUSTER $1~ USING $2~', [ tableName, indexName ]);
      transaction.none('CREATE SEQUENCE tempindex');
      transaction.none('UPDATE $1~ SET id = id + 1000000', tableName);
      transaction.none("UPDATE $1~ SET id = nextval('tempindex')", tableName);
      transaction.none('DROP SEQUENCE tempindex');
    });
    let newIndexRange = await getIndexRange(tableName);
    console.log(newIndexRange);
    return newIndexRange;
  } catch (e) {
    console.log(`error while sorting ${tableName}:\n${e}`);
  }
}

async function getRanges (tableName) {
  let indexName = tableName + '_diff_index';
  try {
    let newIndexRange = await getIndexRange(tableName);
    console.log(newIndexRange);
    return newIndexRange;
  } catch (e) {
    console.log(`error while sorting ${tableName}:\n${e}`);
  }
}

async function modifyDifficulty (word, modificator) {
  let tableName = word.length + 'lenwords';
  try {
    db.tx(async transaction => {
      let difficulty = await transaction.one('SELECT * FROM $1~ WHERE word = $2', [ tableName, word ])
        .then(response => response.difficulty);
      console.log(`${word} actual difficulty: ${difficulty}`);
      // to preserve difficulty range 1-100
      if (difficulty > 1 && difficulty < 99) {
        let newDifficulty = difficulty + modificator;
        console.log(`setting ${word} to ${newDifficulty} with modificator ${modificator}`);
        transaction.none('UPDATE $1~ SET difficulty = $2 WHERE word = $3', [ tableName, newDifficulty, word ]);
      }
    });
  } catch (e) {
    console.log(`error updating ${word} in modifyDifficulty:\n${e}`);
    throw e;
  }
}

module.exports = {
  getWord: getWord,
  getWordFromDB: getWordFromDB,
  getIndexRange: getIndexRange,
  modifyDifficulty: modifyDifficulty,
  sortTable: sortTable,
  getRanges: getRanges
};
