const search = require('../src/search');

//zwróć słowo
test('should return string of given length', () => {
  let wordLength = 8;
  expect(search.getWord(wordLength).length).toEqual(wordLength);
});

test('should return string of given length', async () => {
  expect.assertions(1);
  let wordLength = 8;
  let word = await search.getWordFromDB(wordLength);
  expect(word.length).toEqual(wordLength);
});
