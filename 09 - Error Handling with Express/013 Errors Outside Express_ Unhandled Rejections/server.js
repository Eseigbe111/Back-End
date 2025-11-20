//envmt=> environment
//envmtl=> environmental
/// Importing the app
const mongoose = require('mongoose');
const dotenv = require('dotenv');

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

//B) // A) When using MongDB Compass: This is what i will be using for now bcos of internet connection
// mongoose
//   .connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then(() => console.log('DB connection successful!'));

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

//smw=somewhere

//THIS IS FOR THIS LECTURE: UNHANDLED PROMISE REJECTN
// In this video, let's talk about smth, that we have in node.js called UNHANDLED rejectns and then learn how we can actually handle them.
// So at this pt, we have successfully handled errors in our express applicatn by passing "Operatnal Asynchronous" errors down into a global
// error handling MIDDLEWARE.This then sends relevant error messages back to the client depending on the type of error that occurred.
// However,there might also occur errors outside of express and a good e.g for that in our current applicatn is the MongoDB database connectn.
// So imagine that the database is down for sm reason or for sm reason, we cannot log in. And in that case, there are errors that we have to
// handle as well. But they didn't occur inside of our express applicatn and so, of course, our error handler that we implemented will not
// catch these errors.

// Now just to test what happens, let's go a head and change our MongoDB password bcos this way we will not be able to connect to the database.
// With this we will get sm kind of error, and so let's go to our server.js file and save it in order to reload our server.
// So from the vsc terminal, we have an unhandled promise rejectn.And so that is actually the topic of this video.
// UNHANDLED PROMISE REJECTN: This means that smw in our code, there is a promise that got rejected. But that rejectn has not been handled anywhere.
// And also we see a Deprecatn warning that says:In the future unhandled rejectns will simply exit the node program that's running which may
// not always be what u want. So let's fix this prob and get rid of this unhandled promise rejectn.
// Now, in this simple e.g, we tried with the PASSWORD, it would be actually quite easy to handle that rejectn by doing the below:
/* 
    mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => console.log('DB connection successful!'))
      .catch(err=>console.log("ERROR"));
      */

// Just adding a catch() to handle the error and then we will not have that error again, but only get the "ERROR" we logged to the console.
// This would work of course, but i really want to show u how to globally handle UNHANDLED rejected promises, bcos in a bigger applicatn,
// it can bcom a bit more difficult to always keep track of all promises that might bcom rejected at sm pt. And so at sm pt, u might have
// sm unhandled promise rejectn smw and so let me show u how to deal with that globally basically.

// MAin focus: HANDLING UNHANDLED REJECTED PROMISES
// So remember one of the sectns of this course we talked about events and event listeners. And so now, it's time to actully use that knowledge.
// So each time there is an unhandled rejectn smw in our applicatn, the process object will wmit an object called unhandled rejectn and so
// we can subscribe to that event just like that:
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message); // These are sm defaults that we ahev on all errors in node.js
  // After saving, we already have the error logged on the vsc terminal, with the name of the error and message(The message is actually very long).
  // So now the unhandled promise rejectn is actually already handled. And not just the one from this failed connectn due to "password" but any other
  // promise rejectn that we might not catch smw in the applicatn, is handled here in this fc. We always like to assume that we as programmers will
  // make error. And so it is always best to have a cental place like this to handle all promise rejectns like a last safety net.

  // Now if we really have like sm prob with the database connectn as we have in this e.g, then our applicatn is not gonna work at all. And so all we can
  // really do here is to shut down our applicatn. And to shut it down we use "process.exit":

  console.log(`UNHANDLED REJECTION: 💥 Shutting down...`); // Just letting us know that we are shutting down
  // process.exit(1); // 0 stands for success and 1 stands for UNCAUGHT EXCEPTN. And that's the one we usually use here

  // Problem with implementing shut down using process.exit(1);
  // This a very abrupt way of ending the program bcos this will just immediately abort all the requests that are currently still running or pending
  // and so that might not be a good idea. And so usually what we do is to shutdown gracefully where we 1st close the server and only then, we shut
  // down the applicatn. so we will need to save the server to a variable i.e const server = app.listen() above
  server.close(() => {
    // As its name, it closes the server and the runs the callback fc. And by using "close()", we give the server all the time to execute all the request
    // that are still pending and after that the server can be closed.
    process.exit(1); // 0 stands for success and 1 stands for UNCAUGHT EXCEPTN. And that's the one we usually use here
  });

  // So this above properly shuts down the server
});
// Ends here
