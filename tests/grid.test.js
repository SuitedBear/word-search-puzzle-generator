const grid = require('../src/grid');

test('should generate x by y sized grid', () => {
  let x=10, y=10;
  let testGrid = grid.getEmptyGrid(x, y);
  expect(testGrid.length).toBe(x);
  expect(testGrid[x-1].length).toBe(y);
  expect(testGrid[x-1][y-1]).toBe(' ');
});
