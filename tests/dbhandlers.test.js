/* eslint-env jest */

const dbHandler = require('../src/dbhandlers');
const { db } = require('../src/db');

async function generateStubIndexMap () {
  let indexMap = new Map();
  try {
    for (let i = 3; i <= 15; i++) {
      let tableName = i + 'lenwords';
      let minIndex = 1;
      let maxFromDb = await db.one('SELECT MAX(id) FROM $1~', tableName);
      let maxIndex = maxFromDb.max;
      indexMap.set(tableName, { minIndex, maxIndex });
    }
  } catch (e) {
    console.log('Error while creating index map stub!:\n', e);
  }
  return indexMap;
}

// zwróć słowo
test('should return string of given length', () => {
  let wordLength = 8;
  expect(dbHandler.getWord(wordLength).length).toEqual(wordLength);
});

test('should return string of given length', async () => {
  expect.assertions(1);
  let wordLength = 8;
  let tableName = wordLength + 'lenwords';
  let mapIndexStub = await generateStubIndexMap();
  let word = await dbHandler.getWordFromDB(tableName, mapIndexStub.get(tableName));
  expect(word.length).toEqual(wordLength);
});

test('should return min and max index at given difficulty range', async () => {
  expect.assertions(1);
  let wordLength = 8;
  let tableName = wordLength + 'lenwords';
  let returnedObject = await dbHandler.getIndexRange(tableName);
  expect(returnedObject).toEqual(expect.objectContaining({
    minIndex: expect.any(Number),
    maxIndex: expect.any(Number)
  }));
});
