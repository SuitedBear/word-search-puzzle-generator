const {dictionary} = require('../src/db');

function getArrayOfDeclaredLengthWords(len) {
  return dictionary[len-3];
}

function getWord(len) {
  let filteredDict = getArrayOfDeclaredLengthWords(len);
  let word = filteredDict[Math.floor(Math.random() * (filteredDict.length+1))];
  return word;
}

module.exports = {
  getWord: getWord
};
