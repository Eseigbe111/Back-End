//envmts=> environments
//prodn=>production

/// NOW IF U HAVE ANY ISSUES WITH THE CODES U CAN WATCH THE VIDEOS FOE THE PARTS

// THIS IS FOR THIS LECTURE:=> This will be done in "app.js"

/////
const morgan = require('morgan');
const express = require('express');
/// IMPORTING THE ROUTERS SO THE MOUNTED ROUTERS CAN WORK
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//////
const app = express();

///////A) ALL MIDDLEWARES
// 3rd-PARTY MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // There are others apart from dev e.g tiny. They have dift formatting of what they produce
}
// EXPRESS MIDDLEWARE
app.use(express.json());
////////

//CREATING OUR MIDLEWARE FC
app.use((req, res, next) => {
  //a) Doing what we want in the code
  console.log('Hello from the middleware 👋');
  //b) Using the next()
  next();
});

//we can create difft numbers of middleware fc.
//2) 2nd Middleware fc:  In this one below, we want to alter the res()
app.use((req, res, next) => {
  //a) Doing what we want in the code
  req.requestTime = new Date().toISOString(); // Wgat we ae doing here is just to add the current time to the request
  //b) calling the next()
  next();
});
///////
///C) ROUTES
//THIS IS CALLED MOUNTING THE ROUTER
app.use('/api/v1/tours', tourRouter); //This is using the tourRouter in our application on the '/api/v1/tours'
app.use('/api/v1/users', userRouter); //This is using the userRouter in our application on the '/api/v1/users'

// CREATING A MIDDLEWARE TO HANDLE UNHANDLED ROUTES: After the code below, we can test it using what we used initially i.e "127.0.0.1:3000/api/tours/"
// So with app.all(), below we are handling for any mthds or verbs that can be used in a URL i.e GET, POST, PATCH etc
app.all('*', (req, res, next) => {
  // "*" selects all mthds
  // This app.all() will then run for all the mthds or verbs GET, POST, PATCH
  // So we want to simply send a response in the JSON format, so not the HTML that is always produced for UNHANDLED ROUTE
  // res.status(404).json({
  //   // 404 is Not Found status code
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  //   // So the new response that we're sending back now is a lot better than the HTML that we were receiving previously.
  // });

  // Creating an error to test our error handling middleware
  const err = new Error(`Can't find ${req.originalUrl} on this server`); // This is the message
  err.status = 'fail';
  err.statusCode = 404;
  // To read these variables, we use next() in a special way, by passing the error into the next(). So if the next
  // fc receives an argument, no matter what it is, Express will automatically know that there was an error. So it
  // will assume that whatever we pass into next is gonna be an error. And that applies to every next() in every
  // single middleware anywhere in our applicatn. So again, whenever we pass anything into next(), it will assume
  // that it is an error, and then skip all the other middlewares in the middleware stack and  send the error that
  // we passed in to our global error handling middleware, which will then, of course, be executed. So let pass in
  // the error below:
  next(err);
});
// So if there was another middleware b4 the error middleware below,it will skip all and move towards the fc below
// After the creating the error for testing this middleware in this "app.all('*', (req, res, next) =>{})", we can now test
// this by trying to acess a route that was not defined in our Postman, by using this ""127.0.0.1:3000/api/tours/""
//

// THIS IS FOR THIS LECTURE: THIS FUNCTN IS AN ERROR HANDLING MIDDLEWARE
// In this video, we're now going to implement the global error handling middleware that we just talked about b4.
// Remember that the goalis to write a middleware fc, which is gonna be able to handle operatnal errors like this
// fc below "app.all('*', (req, res, next)=>{})" for the UNHANDLED ROUTES. So when a user hits a URL that doesn't
// exist, well we can consider that an operatnal error, and we in this case handled it by sending back this response
// res.status(404).json({status: 'fail',message: `Can't find ${req.originalUrl} on this server`,});. but again, the
// goal is to do that in one central place. So all over our code we have snippets of codes just like the one i pasted
// that handles the errors. So we have the "try catch" and if there is an error, it is handled in the catch block.
// And so again, in the end we want to get rid of all of these snippets and handles the error in one central middleware.

// So lets start building the MIDDLEWARE. Remember how i told u that Express already comes with middleware handlers
// out of the box.
// So to define an error handling middleware, all we need to do is to give the middleware fc 4 arguments, and express
// will automatically recognize it as an error handling middleware. And there4, only call it when there is an error.
// So since this middleware is an error fc, then its 1st argument will be the err.
app.use((err, req, res, next) => {
  // Now since we do not know which error is being handled, we need to get the status code of that error or define a
  // default code for the error that may occur, bcos dift errors can occur with out having status code.

  //500 is internal server error
  err.statusCode = err.statusCode || 500; // this is using optnal chaining
  // the "err.statusCode" will show if defined and if not the 500

  /// Getting the status (either success or fail or error:if no defined status), we do this just like the above
  err.status = err.status || 'error'; // 'error' is when we have a 400 statusCode and then it is a fail, which we
  // defined in createTour()

  //All that we want to do to handle this error is to send a response to the client using the above
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // This message will be gotten from the error we created in this app.all('*', (req, res, next) =>{}) above
    // to test this fc
  });
});
// For now, this is our error handling middleware
// Now to test the above, let's create an error in the fc for UNHANDLED ROUTES i.e app.all('*', (req, res, next) =>{}) above
// After the creating the error for testing this middleware in this "app.all('*', (req, res, next) =>{})", we can now test
// this by trying to acess a route that was not defined in our Postman, by using this "127.0.0.1:3000/api/tours/"
////
// Exporting our app so we can get it in server.js
module.exports = app;
