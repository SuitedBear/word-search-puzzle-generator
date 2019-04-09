const { generatePuzzle } = require('./grid');
const { modifyDifficulty } = require('./dbhandlers');

// need to refactor srsly!
async function getPuzzle (req, res) {
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
      let puzzle = await generatePuzzle(x, y, _words, req.app.locals.dbIndexes);
      return res.json(puzzle);
    }
    return res.status(400).json('bad request');
  } catch (e) {
    console.log('error in /puzzle endpoint handler: ', e);
    return res.status(500).json('internal server error :<');
  }
};

async function fetchFeedback (feedbackTable) {
  let changed = 0;
  for (let row in feedbackTable) {
    try {
      if(await updateWord(row.toLowerCase(), feedbackTable[row])) changed++;
    } catch (e) {
      console.log(`error while updating ${row}:\n${e}`);
    }
  }
  return changed;
};

async function updateWord (word, difficultyRank) {
  try {
    // try to simplify this
    if (difficultyRank < 4) {
      modifyDifficulty(word, -1);
      return true;
    }
    if (difficultyRank > 7) {
      modifyDifficulty(word, 1);
      return true;
    } 
    return false;
  } catch (e) {
    console.log(`error updating ${word} difficulty, rank ${difficultyRank}:\n${e}`);
    throw e;
  }
}

module.exports = {
  getPuzzle: getPuzzle,
  fetchFeedback: fetchFeedback
};
