//envmt=> environment
//envmtl=> environmental
/// Importing the app
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// UNCAUGHT EXCEPTION
process.on('uncaughtException', (err) => {
  console.log(`UNCAUGHT EXCEPTION: 💥 Shutting down...`); // Just letting us know that we are shutting down
  console.log(err.name, err.message);
});

// This is for this lecture: Evironment variable
dotenv.config({ path: './config.env' });

const app = require('./app');

// Connecting Mongoose: Inside the ".connect()", we will pass in our string for connectn and our password as seen below:
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
); // This is adding the real password to the string

//Connecting our Mongoose to our MongoDB
// A) When using MongDB Atlas
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

//////////////
// START SERVER
const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

// USing this to show us how to cles a server and shut down properly
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// HANDLING UNHANDLED REJECTED PROMISES
process.on('unhandledRejection', (err) => {
  // Now if we really have like sm prob with the database connectn as we have in this e.g, then our applicatn is not gonna work at all. And so all we can
  // really do here is to shut down our applicatn. And to shut it down we use "process.exit":

  console.log(`UNHANDLED REJECTION: 💥 Shutting down...`); // Just letting us know that we are shutting down
  console.log(err.name, err.message);

  // PROPER WAY OF SHUTTING A SERVER DOWN
  server.close(() => {
    // As its name, it closes the server and the runs the callback fc. And by using "close()", we give the server all the time to execute all the request
    // that are still pending and after that the server can be closed.
    process.exit(1); // 0 stands for success and 1 stands for UNCAUGHT EXCEPTN. And that's the one we usually use here
  });

  // So this above properly shuts down the server
});
