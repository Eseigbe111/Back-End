//envmt=> environment
//envmtl=> environmental
/// Importing the app
const mongoose = require('mongoose'); //we install mongoose@5, so we will be at the same page incase we run into an error
//during the lecture
const dotenv = require('dotenv'); // This is so we can access ourr env variables and also read our "config.env"
const app = require('./app');

// This is for this lecture: Evironment variable
dotenv.config({ path: './config.env' });
//Reason we read the file using "dotenv.config({ path: './config.env' })" and not "require('./config.env')":
// Because require('./config.env') won’t load environment variables into process.env, and will read the config.env file as a
// javascript file which will throw an error bcos it is not expressed in javascript syntaxes whereas  dotenv.config() Reads
// the contents of ./config.env (which is just a plain text file with key=value pairs like PORT=3000), parses the .env file
// and Sets them as environment variables in process.env automatically.

/////
// THIS IS FOR THIS LECTURE:
// Connecting Mongoose: Inside the ".connect()", we will pass in our string for connectn and our password as seen below:
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
); // This is adding the real password to the string

//Connecting our Mongoose to our MongoDB
// The 1st argument is the connectn string "DB" and the 2nd=> we pass in an object with sm optns, and these are optns that
// we need to specify in order to deal with sm deprecation warnings. The connect() will eturn a promise, so we will handle
// it by using the then(), which will get access to a connectn object.

// A) When using MongDB Atlas
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

/// B) When Using local Host
// mongoose
//   .connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then(() => console.log('DB connection successful!'));

// After the above, we can then run "npm start" not "npm run start:dev", bcos jonas changed it.

// Now as a final part, let me show u how we can connect to ur LOCAL DATABASE incase u are using that one:
/* 
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

// For the above to work, ur "mongod.exe" must be running

*/

// Then finally I will delete what we have in our collectns so it does not interfere wirh our database or project.

////
// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
