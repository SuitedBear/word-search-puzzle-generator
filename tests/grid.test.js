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
