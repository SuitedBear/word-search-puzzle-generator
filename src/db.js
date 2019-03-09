const pgp = require('pg-promise')({
  capSQL: true
});

// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/dict_db_pl';
const connectionObject = {
  host: 'localhost',
  port: 5432,
  database: 'dict_db_pl',
  user: 'Sqll',
  password: 'krowosamolot'
};

const db = pgp(connectionObject);

module.exports = {
  db: db,
  helper: pgp.helpers
};
