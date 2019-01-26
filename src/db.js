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
    console.log(`couldn't open dictionary source: ${dictSource}\nerror code: ${error.code}`);
    return undefined;
  }
}

const getSortedDictionary = (dictArray) => {
  let sortedDictionary = [];
  // let stillSearching = 3;
  let wordLength = 3;
  while(true) { // stillSearching > 0) {
    let tempArray = dictArray.filter(word => word.length === wordLength);
    if (tempArray.length <= 0) {
      break;
      // stillSearching--;
    } 
    sortedDictionary.push(tempArray);
    wordLength++;
  }
  // left for possible different dictionaries
  // for (let i=sortedDictionary.length-1; i>=0; i--) {
  //   if (sortedDictionary[i].length > 0) {
  //     break;
  //   }
  //   sortedDictionary.pop();
  // }
  return sortedDictionary;
}

const dictionary = getSortedDictionary(getDictionary('./src/slowa.txt'));

for (column of dictionary) {
  console.log(column.length);
}

module.exports = {
  getDictionary: getDictionary,
  getSortedDictionary: getSortedDictionary,
  dictionary: dictionary
}
