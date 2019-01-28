const search = require('../src/search');

//zwróć słowo
test('should return string of given length', () => {
  let wordLength = 8;
  expect(search.getWord(wordLength).length).toEqual(wordLength);
});
