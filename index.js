const app = require('./src/app');

app.on('ready', () => console.log(app.locals.dbIndexes));

const PORT = process.env.PORT ? process.env.PORT : 3001;
app.listen(PORT, () => console.log(`App listening on port ${PORT.toString()} `));

// TODO:
// -rethink randomisation and retry counter
