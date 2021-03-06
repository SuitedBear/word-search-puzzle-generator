const search = require('./dbhandlers');

const getEmptyGrid = (x, y) => {
  let grid = [];
  for (let i = 0; i < x; i++) {
    let line = [];
    for (let j = 0; j < y; j++) {
      line.push(' ');
    }
    grid.push(line);
  }
  return grid;
};

const insertingWord = (word, coords, grid) => {
  let newGrid = grid;
  let direction = 0;
  // find better method
  while (direction === 0) {
    direction = coords[2] & (1 << Math.floor(Math.random() * 3));
  }
  for (let i = 0; i < word.length; i++) {
    switch (direction) {
      case 1:
        newGrid[coords[0] + i][coords[1]] = word[i];
        break;
      case 2:
        newGrid[coords[0]][coords[1] + i] = word[i];
        break;
      case 4:
        newGrid[coords[0] + i][coords[1] + i] = word[i];
        break;
    }
  }
  return newGrid;
};

const insertToGrid = (word, grid) => {
  let possibleStarts = [];
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      let possible = 0b111;
      // horizontal=1 vertical=2 diagonal=4
      for (let i = 0; i < word.length; i++) {
        if ((x > grid.length - word.length) || ((grid[x + i][y] !== word[i]) && (grid[x + i][y] !== ' '))) {
          possible = possible & 0b110;
        }
        if ((y > grid[x].length - word.length) || ((grid[x][y + i] !== word[i]) && (grid[x][y + i] !== ' '))) {
          possible = possible & 0b101;
        }
        if (((x > grid.length - word.length) || (y > grid[x].length - word.length)) ||
        ((grid[x + i][y + i] !== word[i]) && (grid[x + i][y + i] !== ' '))) {
          possible = possible & 0b011;
        }
      }
      if (possible !== 0) possibleStarts.push([x, y, possible]);
    }
  }
  if (possibleStarts.length > 0) {
    let coords = possibleStarts[Math.floor(Math.random() * possibleStarts.length)];
    // move direction randomization out of insertingWord fun
    return insertingWord(word, coords, grid);
  } else {
    // needed some response in case word won't fit
    return null;
  }
};

const fillWithLetters = (grid) => {
  let newGrid = [];
  for (let line of grid) {
    let newLine = [];
    for (let field of line) {
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
};

const checkSimilarities = (word, list) => {
  for (let listedWord of list) {
    for (let i = 0; i < listedWord.length - 3; i++) {
      if (word.includes(listedWord.slice(i, i + 3))) return true;
    }
  }
  return false;
};

const generatePuzzle = async (x, y, wordCount, indexMap, maxWordLength = 0) => {
  let newGrid = getEmptyGrid(x, y);
  let failCounter = 10;
  let wordList = [];
  let wordLengthLimit = 15;
  // maxWordLength could be greater than grid
  let wordLength = maxWordLength || Math.max(x, y);
  wordLength = Math.min(wordLength, wordLengthLimit);
  while ((wordList.length < wordCount) && failCounter) {
    let tableName = wordLength + 'lenwords';
    // isolate indexMap.get
    let word = await search.getWordFromDB(tableName, indexMap.get(tableName));
    if (word === null) {
      // failCounter--;
      wordLength--;
      continue;
    }
    if (checkSimilarities(word, wordList)) {
      failCounter--;
      continue;
    }
    let tempGrid = insertToGrid(word, newGrid);
    if (tempGrid === null) {
      failCounter--;
      continue;
    }
    newGrid = tempGrid;
    wordList.push(word);
    // needs verifying
    failCounter += 3;
    if (wordLength >= 4) wordLength -= Math.round(Math.random());
  }
  if (failCounter === 0) console.log(`generated only ${wordList.length} words`);
  newGrid = fillWithLetters(newGrid);
  return {
    grid: newGrid,
    list: wordList
  };
};

module.exports = {
  getEmptyGrid: getEmptyGrid,
  fillWithLetters: fillWithLetters,
  checkSimilarities: checkSimilarities,
  insertToGrid: insertToGrid,
  generatePuzzle: generatePuzzle
};
