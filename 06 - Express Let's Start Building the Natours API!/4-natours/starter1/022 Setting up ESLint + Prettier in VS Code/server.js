//envmt=> environment
//envmtl=> environmental
/// Importing the app

const dotenv = require('dotenv');
// This is for this lecture: Evironment variable
dotenv.config({ path: './config.env' });

const app = require('./app');

// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
