const {db, helper} = require('./db');
const {dictionary} = require('./txt_db');

async function createTable (_db, name) {
  try {
    await _db.none('CREATE TABLE IF NOT EXISTS $1~ (id SERIAL PRIMARY KEY, word varchar(20) UNIQUE NOT NULL, difficulty integer NOT NULL DEFAULT 50)', name);
    let indexName = name + '_diff_index';
    // using variable for column name throws error
    await _db.none('CREATE INDEX IF NOT EXISTS $1~ ON $2~ (difficulty)', [indexName, name]);
    console.log(`table ${name} ready`)
  } catch(e) {
    console.log(`error creating table ${name}:`, e);
  };
}

async function populateDatabase (dict, _db) {
  if (dict === undefined) {
    throw new Error('dictionary unavailble!');
  }

  for (nLengthDict of dict) {
    let len = nLengthDict[0].length;
    let tableName = len + 'lenwords';
    try {
      let tempDict = nLengthDict.map(_word => {return {word: _word}});
      let cs = helper.ColumnSet(['word'], {table: tableName});
      let data = helper.insert(tempDict, cs);
      await createTable(_db, tableName);
      await _db.none(data)
      console.log(`data fetched to ${tableName}`);
    } catch(e) {
      console.log(`error during data insert to ${tableName}:\n${e}`);
    }
  }
}


populateDatabase(dictionary, db);
