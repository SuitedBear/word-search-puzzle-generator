const {db, helper} = require('./db');
const {dictionary} = require('./txt_db');
const {getWordFromDB} = require('./search');

async function createTable (_db, name) {
  await _db.none('CREATE TABLE IF NOT EXISTS $1~ (id SERIAL PRIMARY KEY, word varchar(20) UNIQUE NOT NULL, difficulty integer NOT NULL DEFAULT 50)', name)
  .then(() => console.log(`table ${name} ready`)).catch(e => {
    console.log(e);
  });
}

async function populateDatabase (dict, _db) {
  if (dict === undefined) {
    throw new Error('dictionary unavailble!');
  }

  for (nLengthDict of dict) {
    let len = nLengthDict[0].length;
    let tableName = len + 'lenwords';
    let tempDict = nLengthDict.map(_word => {return {word: _word}});
    let cs = helper.ColumnSet(['word'], {table: tableName});
    let data = helper.insert(tempDict, cs);
    await createTable(_db, tableName).catch(e => {console.log(`error creating table ${tableName}`)});
    _db.none(data).then(console.log(`data fetched to ${tableName}`)).catch(e => {
      console.log(`babol w insercie do ${tableName}:\n${e}`);
    })
  }
}


populateDatabase(dictionary, db);
 
