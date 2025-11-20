//envmts=> environments
//prodn=>production

/// NOW IF U HAVE ANY ISSUES WITH THE CODES U CAN WATCH THE VIDEOS FOE THE PARTS

// THIS IS FOR THIS LECTURE:=> This will be done in "appError.js", errorController and "app.js"
// In this video, let's now create a better and more useful error class, and also do sm refactoring. And starting with
// that error class, let's create a new file in our Utilities i.e utils folder called "appError.js". So over to appError.js

/////
const morgan = require('morgan');
const express = require('express');

//THIS IS FOR THIS LECTURE
/// Importing the AppError
const AppError = require('./utils/appError');
//Importing the AppError
const globalErrorHandler = require('./controllers/errorController');
//Ends here

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
  // we will write the error fc in the next()

  // THIS IS FOR THIS LECTURE
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  //Ends here
});

///

// THIS FUNCTN IS AN ERROR HANDLING MIDDLEWARE
// So since this middleware is an error fc, then its 1st argument will be the err.
app.use(globalErrorHandler);
// THIS IS FOR THIS LECTURE
//Finally i want to export this middleware "app.use((err, req, res, next) =>{})" i.e "THIS FUNCTN IS AN ERROR HANDLING MIDDLEWARE"
//bcos thru out the rest of the sectn, we're gonna build a couple of dift fcs for handling with dift types of errors, and so i want
// all  of these fcs to be all in the same file. And we can say that all of these fcs that i just mentned are handlers. And as handlers,
// we also call them controllers in the context of MVC architecture, and so let's now actually create an error controller file in our
// controller folder . So this part below is what we cut into the "errorController.js", which was inside "app.use();"

/* 
(err, req, res, next) => {
  // console.log(err.stack);
  // Now since we do not know which error is being handled, we need to get the status code of that error or define a
  // default code for the error that may occur, bcos dift errors can occur with out having status code.

  //500 is internal server error
  err.statusCode = err.statusCode || 500; // this is using optnal chaining
  // the "err.statusCode" will sho if defined and if not the default

  /// we do this just like the above
  err.status = err.status || 'error'; // 'error' is when we have a 400 status code and then it is a fail

  //All that we want to do to handle this error is to send a response to the client using the above
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // This message will be gotten from the error we created in this app.all('*', (req, res, next) =>{}) above
    // to test this fc
  });
  // For now, this is our error handling middleware
  // Now to test the above, let's create an error in the fc for UNHANDLED ROUTES i.e app.all('*', (req, res, next) =>{}) above
  // After the creating the error for testing this middleware in this "app.all('*', (req, res, next) =>{})", we can now test
  // this by trying to acess a route that was not defined in our Postman, by using this "127.0.0.1:3000/api/tours/"
}

*/

//Ends here
////
// Exporting our app so we can get it in server.js
module.exports = app;
