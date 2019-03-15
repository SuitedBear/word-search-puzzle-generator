const app = require('./src/app');

const PORT = process.env.PORT ? process.env.PORT : 3001;
app.listen(PORT, () => console.log(`App listening on port ${PORT.toString()} `));

// TODO:
// -rethink randomisation and retry counter
// -word length
// -integration tests
