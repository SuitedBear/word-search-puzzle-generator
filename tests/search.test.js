const search = require('../src/search');

let emptyArray = [];
//zwróć listę słów
test('if function is returning an array', () => {
    expect(typeof(search.getListOfWords(10))).toEqual(typeof(emptyArray))
  }
);
//zwróć słowo
test('should return string of given length', () => {
  let wordLength = 8;
  expect(search.getWord(wordLength).length).toEqual(wordLength);
});

//zwróć grid
