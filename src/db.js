//db stub
const fs = require('fs');

const getDictionary = (dictSource) => {
  try {
    let dictRaw = fs.readFileSync(dictSource, 'utf8');
    let dictionary = dictRaw.split('\r\n');
    //last line is empty anyway
    dictionary.pop();
    return dictionary;
  } catch (error) {
    console.log(`couldn't open dictionary source: ${dictSource}\nerror code:${error.code}`);
    return undefined;
  }
}

const dictionary = getDictionary('./src/slowa.txt');

module.exports = {
  getDictionary: getDictionary,
  dictionary: dictionary
}
