//envmts=> environments
//prodn=>production
//fclty=> functionality
/// NOW IF U HAVE ANY ISSUES WITH THE CODES U CAN WATCH THE VIDEOS FOE THE PARTS

// THIS IS FOR THIS LECTURE:=> This will be done in "authController", "userRoutes" and "userModel"

/////
const morgan = require('morgan');
const express = require('express');

/// Importing the AppError
const AppError = require('./utils/appError');
//Importing the AppError
const globalErrorHandler = require('./controllers/errorController');

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
  req.requestTime = new Date().toISOString(); // What we are doing here is just to add the current time to the request
  // console.log(req.headers); // This is how we get access to http headers i.e the ones client can send along with their request

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
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

///

// THIS FUNCTN IS AN ERROR HANDLING MIDDLEWARE
// So since this middleware is an error fc, then its 1st argument will be the err.
app.use(globalErrorHandler);
////
// Exporting our app so we can get it in server.js
module.exports = app;
