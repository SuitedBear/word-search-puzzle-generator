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

module.exports = {
  getEmptyGrid: getEmptyGrid
}
