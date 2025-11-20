///THIS IS FOR THIS LECTURE
// THis will be coded in app.js i.e in here

// Importing morgan
const morgan = require('morgan');

// Importing module of express
const express = require('express');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//  We create a variable called app. Again this is a kind of a standard
// We assign it the result of calling express. This adds a bunch of mthds to our app variable below
const app = express(); // This creates a new instance of express() which is store in app

//
//3rd-PARTY MIDDLEWARE: For this we will use "morgan". Morgan is a popular logging middleware for Express
// that lets you see details about each incoming request (like method, URL, status code, and response time)
// directly in the console i.e smth like this "GET /api/v1/tours 200 4.907 ms - 8681".
// We install by doing "npm i morgan", and we use it as below:
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // There are others apart from dev e.g tiny. They have dift formatting of what they produce
}

// EXPRESS MIDDLEWARES
// Telling Express to use the JSON body parser middleware
// The below tells Express "Whenever a request comes in with JSON data, please parse it and make it available as req.body."
// If not, we will only see the id of what is created without the body
app.use(express.json());
//////////

// SERVING STATIC FILE
// We can access the below in our browser by "127.0.0.1:3000/overview.html". And it can not be accessed like "127.0.0.1:3000/public/overview.html"
// bcos it is not found on the routes.
app.use(express.static(`${__dirname}/public`));
///////

// MIDDLEWARES
// Middleware: A function in Express that runs between a request and a response. It can modify the request, the response, or
// stop or pass the flow to the next function.
// NB: You can modify data without middleware, but middleware is the standard way to do it in Express because it lets you
// handle data before it reaches your routes.
// To use a middleware, we need to use "app.use()"  just like this "app.use(express.json());" above

// 1) 1st MIDDLEWARE: So this middleware will be logged on the terminal of vsc each time we send a req i.e in our POstman
app.use((req, res, next) => {
  console.log('Hello from the middleware ');
  next(); // without this next() we will have an unending req-res cycle
});

//2) 2nd MIDDLEWARE: So here we want to add time parameter to our req and we will call this in getAllTours()
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// /////

/// THIS IS CALLED MOUNTING THE ROUTER
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//////////////////
// HANDLING UNHANDLED ROUTES: To test this we can use 127.0.0.1:3000/api/tours in postman
// In this lecture, we will learn how to handle undefined or unhandled routes in Express. When a user sends a request to a route
// that doesn’t exist (for example, wrong URL or spelling mistake), Express by default returns an HTML 404 Page Not Found response.
// However, we want to return a JSON error message instead. To do that, we add a middleware after all our route handlers
// (i.e., after mounting the routers). This middleware will only run if none of the existing routes matched the request.
app.all('*', (req, res, next) => {
  // app.all('*') means it applies to any HTTP method (GET, POST, PATCH, etc.) and any URL.
  /* res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  }); */

  // We changed the above to this below, so it can be handled by the GLOBAL ERROR HANDLING MIDDLEWARE below
  // THIS IS FOR THIS LETURE
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.statusCode = 404;
  err.status = 'fail';

  next(err); // Pass the error to the global error handling middleware
  // Ends here
});
// If execution reaches this middleware, it means no previous route matched, so we return a 404 error in JSON.
// NB: This must be placed at the very bottom of the route definitions. If we place it at the top, it would catch every request, making
// our actual routes unreachable.

////////////////////
// THIS IS FOR THIS LECTURE:
// IMPLEMENTING A GLOBAL ERROR HANDLING MIDDLEWARE: To test this we can use 127.0.0.1:3000/api/tours in postman
// This lecture introduces the global error handling middleware in Express. The purpose of this middleware is to handle all application
// errors in one central place, instead of writing separate error handling code in many different parts of the app (like multiple try/catch
// blocks or repeated res.status().json() responses).
// To create an error handling middleware, we define a middleware function with four arguments: (err, req, res, next). Express recognizes
// this automatically as an error handler and will call it whenever next(err) is triggered or an error occurs.
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // The HTTP error code (default is 500).
  err.status = err.status || 'error'; // A simple text status like 'fail' or 'error'

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
// Now, instead of directly responding to errors (e.g., in the app.all('*') route for unhandled URLs), we will eventually forward the error to
// this global handler, keeping error handling consistent and centralized.

////////////////

// Ends here
module.exports = app;
