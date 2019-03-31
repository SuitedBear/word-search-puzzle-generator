const app = require('./src/app');

const PORT = process.env.PORT ? process.env.PORT : 3001;
// include setting to production

app.once('ready', () => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT.toString()} `));
});

// TODO:
// -rethink randomisation and retry counter
