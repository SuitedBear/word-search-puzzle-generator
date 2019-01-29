const grid = require('../src/grid');

//test grid size
let x=10, y=10;

test('should generate x by y sized grid', () => {
  let testGrid = grid.getEmptyGrid(x, y);
  expect(testGrid.length).toBe(x);
  expect(testGrid[x-1].length).toBe(y);
  expect(testGrid[x-1][y-1]).toBe(' ');
});

test('should fill empty x by y grid', () => {
  let testGrid = grid.getEmptyGrid(x, y);
  testGrid = grid.fillWithLetters(testGrid);
  testGrid = grid.fillWithLetters(testGrid);
  for (line of testGrid) {
    for (field of line) {
      expect(field).toMatch(/\w/);
    }
  }
});

let testWord = 'przetestowany';

test('should return false for empty list', () => {
  expect(grid.checkSimilarities(testWord, [])).toBeFalsy();
});

test('should return false if no similar word on the list', () => {
  expect(grid.checkSimilarities(testWord, ['adfasdfer', 'fdsa', 'toster'])).toBeFalsy();
});

test('should return true if similar word is on the list', () => {
  expect(grid.checkSimilarities(testWord, ['aaaaa', 'protest'])).toBeTruthy();
});

test('should return same size grid', () => {
  let testGrid = grid.getEmptyGrid(x, y);
  let returnedGrid = grid.insertToGrid('test', testGrid);
  expect(returnedGrid.length).toBe(testGrid.length);
  expect(returnedGrid[returnedGrid.length-1].length).toBe(testGrid[testGrid.length-1].length);
});

test('should return null because word is to long', () => {
  let testGrid = grid.getEmptyGrid(x,y);
  expect(grid.insertToGrid('wordlongerthangridsize', testGrid)).toBeNull();
});

test('should return { grid:array of arrays, list:array } structure', () => {
  expect(grid.generatePuzzle(x, y, 10)).toBe(expect.objectContaining({
    grid: expect.toBe(Array),
    list: expect.toBe(Array)
  }));
})
