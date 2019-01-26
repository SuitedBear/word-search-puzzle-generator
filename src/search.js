const {dictionary} = require('../src/db');

function getListOfWords (count) {
  let listOfWords = [];
  return listOfWords;
}

function getWord(len) {
  let filteredDict = dictionary.filter(word => word.length === len);
  return filteredDict[0];
}

module.exports = {
  getListOfWords: getListOfWords,
  getWord: getWord
};
