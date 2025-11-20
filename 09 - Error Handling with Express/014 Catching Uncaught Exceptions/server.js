//envmt=> environment
//envmtl=> environmental
/// Importing the app
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// THIS IS FOR THIS LECTURE : UNCAUGHT EXCEPTION
process.on('uncaughtException', (err) => {
  console.log(`UNCAUGHT EXCEPTION: 💥 Shutting down...`); // Just letting us know that we are shutting down
  console.log(err.name, err.message);
});

//Ends here
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

// THIS IS FOR THIS LECTURE : UNCAUGHT EXCEPTION
// Now to finish this sectn, let's learn how to CATCH UNCAUGHT EXCEPTNS.
// UNCAUGHT EXCEPTNS: All errors or let's also call them bugs, that occur in our synchronous code but are not handled anywhere are called
// UNCAUGHT EXCEPTNS. And like b4, so just like with the unhandled rejectns,we also have a way of handling uncaught exceptns. So let me
// quickly show u an e.g of uncaught exceptn.
// Logging smth that does not exist to the console i.e x
// console.log(x);
// So We can catch this Uncaught exceptn of x in the below:
// process.on('uncaughtException', (err) => {
//   console.log(`UNCAUGHT EXCEPTION: 💥 Shutting down...`); // Just letting us know that we are shutting down
//   console.log(err.name, err.message);

//   server.close(() => {
//     process.exit(1); // 0 stands for success and 1 stands for UNCAUGHT EXCEPTN. And that's the one we usually use here

//     // Now while it is optnal to exit the the Unhandled rejectn, then crashing the applicatn like we did for HANDLING UNHANDLED REJECTED PROMISES,
//     // when there is an uncaught exceptn, we really need to crash our applicatn, cos after there was an uncaught exceptn, the entire node process
//     // is in a so-called unclean state. And so to fix that, the process need to terminate and then be restarted. And again in prodn, we should have
//     // a tool in place which will restart the applicatn after crashing. And many hosting services already do that out of the box. So, completely
//     // automatically without us having to do anything.
//     // Now in Nodejs, it's really a good practice to just blindly rely on these two error handlers that we just implemented. So ideally errors should
//     // be handled right where they occur. So for e.g, in the prob connecting to the database, we should of course add a catch handler there
//   });
// });
// console.log(x);

// The above is the way to handle uncaught exceptn.
// Now in Nodejs, it's really a good practice to just blindly rely on these two error handlers that we just implemented. So ideally errors should
// be handled right where they occur. So for e.g, in the prob connecting to the database, we should of course add a catch handler there and not
// just simply rely on the UNHANDLED REJECTN callback that we have. And sm people even say that we shouldn't use these at all, but i disagree with
// that. I think that as a safety net, let's say, they can be very useful and play a part in our applicatn.
// So the "UNCAUGHT EXCEPTION" handler should be at the very top of our code, or at least b4 any other code is really executed. Bcos watch what
// happens if this line of code  "console.log(x);" is above "UNCAUGHT EXCEPTION" handler. U will that our handler doe not catch this exceptn, so
// the handler does not catch the exceptn "console.log(x);", bcos only at the end, we actually start listening for an uncaught exceptn. And in our
// case the "UNCAUGHT EXCEPTION" happens b4 we even lsiten to that event. And so there4, we have no way of catching it. So we should ideally put it
// again right at the top b4 any other code executes. Especially the one in our applicatn.

// Temple: So i will comment mine and copy it to the top.

// Now the prob will be that the server is not defined at where we put it. But that's not a prob, bcos actually we don't need the server there, bcos
// the errors i.e the "UNCAUGHT EXCEPTION", they are not gonna happen asynchronously. So they are not gonna have anything to do with the server actually.
// So we will remove this part  server.close(() => {process.exit(1);}); from the code there.

// If we now have "console.log(x);" in one of our files, U will see that we're still catching that exceptn in our error handler, which b4 would not be
// the case.

// Now again if "console.log(x);" happens in a middleware and we save it, u'll realize that nothing happens initially. This is bcos the middleware fc is
// only called when we send a request. So when we send a request we will end up wtith an error of "something went wrong" which is a non operatnal error.
// So when there is an error in an express middleware, Express will automatically go to the error-handling middleware with that error.
/*  This is the middleware we used in our app.js
app.use((req, res, next) => {
  //a) Doing what we want in the code
  req.requestTime = new Date().toISOString(); // Wgat we ae doing here is just to add the current time to the request

  // Testiing how middleware behaves with UNCAUGHT ERRORS
  // console.log(x);

  //b) calling the next()
  next();
});

*/
