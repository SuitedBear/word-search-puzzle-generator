const {getDictionary} = require('../src/db');

let dictSource = './src/slowa.txt';
let dictBadSource = 'badsource';

test('if dictionary is an array', () => {
    expect(getDictionary(dictSource)).toContain('aaa')
  }
);

test('if wrong filename returns undefined', () => {
  expect(getDictionary(dictBadSource)).toBeUndefined()
})
