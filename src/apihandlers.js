const { generatePuzzle } = require('./grid');

// need to refactor srsly!
const getPuzzle = async (req, res) => {
  try {
    let { width, height, words } = req.query;
    let regexp = /\d{1,2}/;
    if (isNaN(width) || isNaN(height) || isNaN(words)) {
      return res.status(400).json('bad request');
    }
    let x = regexp.exec(width)[0];
    let y = regexp.exec(height)[0];
    let _words = regexp.exec(words)[0];

    // if (width < 3 || width > 30 || height < 3 || height > 30 || words < 1 || words > (width*height/3)) {
    //   return res.status(400).json('values out of range');
    // }
    if (x && y && _words) {
      let puzzle = await generatePuzzle(x, y, _words);
      return res.json(puzzle);
    }
    return res.status(400).json('bad request');
  } catch (e) {
    console.log('error in /puzzle endpoint handler: ', e);
    return res.status(500).json('internal server error :<');
  }
};

module.exports = {
  getPuzzle: getPuzzle
};
