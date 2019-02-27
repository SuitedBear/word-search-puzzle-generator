const dbHandler = require('../src/dbhandlers');

//zwróć słowo
test('should return string of given length', () => {
  let wordLength = 8;
  expect(dbHandler.getWord(wordLength).length).toEqual(wordLength);
});

test('should return string of given length', async () => {
  expect.assertions(1);
  let wordLength = 8;
  let word = await dbHandler.getWordFromDB(wordLength);
  expect(word.length).toEqual(wordLength);
});

test('should return min and max index at given difficulty range', async () => {
  expect.assertions(1);
  let wordLength = 8;
  let tableName = wordLength + 'lenwords';
  let returnedObject = await dbHandler.getIndexRange(tableName);
  expect(returnedObject).toEqual(expect.objectContaining({
    minIndex: expect.any(Number),
    maxIndex: expect.any(Number),
  }));
})
