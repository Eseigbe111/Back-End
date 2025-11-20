// ENVIRONMENT VARIABLES: We install dotenv by doing "npm i dotenv"
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');

const app = require('./app');

// Getting the password from the config.env file
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Connecting to Mongo Atlas
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ DB connection successful!'))
  .catch((err) => console.error('❌ Connection error:', err));

// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// ERRORS OUTSIDE EXPRESS: UNHANDLED PROMISE REJECTN
// In this lecture, we will learn about Unhandled Promise Rejections in Node.js. Even though we already handle operational
// errors inside Express using our global error handling middleware, some errors happen outside Express, such as database
// connection failures. When a promise rejects and we do not handle it with .catch(), Node produces an unhandled promise
// rejection. This can happen, for example, when MongoDB fails to connect.

// To handle these cases globally, we use the process event listener:
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => process.exit(1));
});

// This ensures that any rejected promise we forgot to catch is still handled, logged, and the application is shut down
// gracefully. We first close the server to allow any pending requests to finish, and then exit the application. This acts
// as a safety net for errors that occur outside the Express app.

// CATCHING UNCAUGHT EXCEPTIONS
// Uncaught exceptions are errors in synchronous code that are not handled anywhere in the application. When such an error occurs,
// the Node.js process enters an unclean state, meaning the application may behave unpredictably. Therefore, uncaught exceptions
// must be caught and handled at the process level, and the application should be shut down and restarted.

// To handle uncaught exceptions, Node.js provides the process.on('uncaughtException') event listener. It should be placed at the
// very top of the application, before any other code runs. For example:
// process.on('uncaughtException', (err) => {
//   console.log('UNCAUGHT EXCEPTION: Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });

// Example of an uncaught exception:
// console.log(x); // x is not defined → triggers uncaught exception

// Important Points:
//a) The uncaught exception handler must run before any code, otherwise it will not catch errors that occur earlier.
//b) When an uncaught exception occurs, you must terminate the Node process to avoid running in a corrupted state.
//c) These global handlers (uncaught exceptions and unhandled promise rejections) should be considered safety nets, not primary error
// management. Errors should still be handled where they occur.
//d) Errors thrown inside Express middleware are automatically forwarded to the error-handling middleware when next(err) is triggered
// or when Express detects the error.

// Example middleware generating an uncaught error:
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   console.log(x); // Error triggered when request is received
//   next();
// });


