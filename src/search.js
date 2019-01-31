const {dictionary} = require('./db');
// const app = require('../src/app');

function getArrayOfDeclaredLengthWords(len) {
  return dictionary[len-3];
}

function getWord(len) {
  let filteredDict = getArrayOfDeclaredLengthWords(len);
  if (filteredDict == undefined) return null;
  let word = filteredDict[Math.floor(Math.random() * (filteredDict.length+1))];
  return word;
}

module.exports = {
  getWord: getWord
};
