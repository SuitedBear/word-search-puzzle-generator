const {dictionary} = require('../src/db');

function getListOfWords (count) {
  let listOfWords = [];
  return listOfWords;
}

function getArrayOfDeclaredLengthWords(len) {
  return dictionary[len-3];
}

function getWord(len) {
  let filteredDict = getArrayOfDeclaredLengthWords(len);
  let word = filteredDict[Math.floor(Math.random() * (filteredDict.length+1))];
  return word;
}

module.exports = {
  getListOfWords: getListOfWords,
  getWord: getWord
};
