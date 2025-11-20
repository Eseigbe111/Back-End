/// Importing the app
const app = require('./app');

// STRAT SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
