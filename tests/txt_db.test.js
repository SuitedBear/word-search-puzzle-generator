const {getDictionary, getSortedDictionary} = require('../src/txt_db');

let dictSource = './src/slowa.txt';
let dictBadSource = 'badsource';

test('if dictionary is an array', () => {
    expect(getDictionary(dictSource)).toContain('aaa')
  }
);

test('if wrong filename returns undefined', () => {
  expect(getDictionary(dictBadSource)).toBeUndefined()
});

test('if sorted dictionary is an array of arrays', () => {
  expect(getSortedDictionary(getDictionary(dictSource)).length).toBeGreaterThan(0);
})
