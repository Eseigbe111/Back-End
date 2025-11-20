//envmt=> environment
//envmtl=> environmental
/// Importing the app
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// This is for this lecture: Evironment variable
dotenv.config({ path: './config.env' });

// Connecting Mongoose: Inside the ".connect()", we will pass in our string for connectn and our password as seen below:
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
); // This is adding the real password to the string

//Connecting our Mongoose to our MongoDB
// A) When using MongDB Atlas
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

//////////////
// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
