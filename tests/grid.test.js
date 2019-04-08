/* eslint-env jest */

const grid = require('../src/grid');
const { db } = require('../src/db');

// test grid size
let x = 10;
let y = 10;
let testWord = 'przetestowany';

async function generateStubIndexMap () {
  let indexMap = new Map();
  try {
    for (let i = 3; i <= 15; i++) {
      let tableName = i + 'lenwords';
      let minIndex = 1;
      let maxFromDb = await db.one('SELECT MAX(id) FROM $1~', tableName);
      let maxIndex = maxFromDb.max;
      indexMap.set(tableName, { minIndex, maxIndex });
    }
  } catch (e) {
    console.log('Error while creating index map stub!:\n', e);
  }
  return indexMap;
}

test('should generate x by y sized grid', () => {
  let testGrid = grid.getEmptyGrid(x, y);
  expect(testGrid.length).toBe(x);
  expect(testGrid[x - 1].length).toBe(y);
  expect(testGrid[x - 1][y - 1]).toBe(' ');
});

test('should fill empty x by y grid', () => {
  let testGrid = grid.getEmptyGrid(x, y);
  testGrid = grid.fillWithLetters(testGrid);
  testGrid = grid.fillWithLetters(testGrid);
  for (let line of testGrid) {
    for (let field of line) {
      expect(field).toMatch(/\w/);
    }
  }
});

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
  expect(returnedGrid[returnedGrid.length - 1].length).toBe(testGrid[testGrid.length - 1].length);
});

test('should return null because word is to long', () => {
  let testGrid = grid.getEmptyGrid(x, y);
  expect(grid.insertToGrid('wordlongerthangridsize', testGrid)).toBeNull();
});

test('should return { grid:array of arrays, list:array } structure', async () => {
  expect.assertions(1);
  let indexMapStub = await generateStubIndexMap();
  expect(await grid.generatePuzzle(x, y, 10, indexMapStub)).toEqual(expect.objectContaining({
    grid: expect.any(Array),
    list: expect.any(Array)
  }));
});
