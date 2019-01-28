const search = require('./search');

const getEmptyGrid = (x, y) => {
  let grid = [];
  for (let i=0; i<x; i++) {
    let line = [];
    for(j=0; j<y; j++) {
      line.push(' ');
    }
    grid.push(line);
  }
  return grid;
}

const fillWithLetters = (grid) => {
  let newGrid =  [];
  for (line of grid) {
    let newLine = [];
    for (field of line) {
      if (field !== ' ') {
        newLine.push(field);
      } else {
        let randomLetter = Math.floor(Math.random() * 25) + 97;
        newLine.push(String.fromCharCode(randomLetter));
      }
    }
    newGrid.push(newLine);
  }
  return newGrid;
}

const compareWords = (word1, word2) => {

}

const checkSimilarities = (word, list) => {
  for (listedWord of list) {
    for (let i=0; i<listedWord.length-3; i++) {
      if (word.includes(listedWord.slice(i, i+3))) return true;
    }
  }
  return false;
}

module.exports = {
  getEmptyGrid: getEmptyGrid,
  fillWithLetters: fillWithLetters,
  checkSimilarities: checkSimilarities
}
