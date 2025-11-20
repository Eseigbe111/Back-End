// Importing AppError bcos we need it to create error message
const AppError = require('../utils/appError');

//1) HANDLING INVALID DATABASE IDS: To test this use GET 127.0.0.1:3000/api/v1/tours/uieoihosijosfius".
const handleCastErrorDB = (err) => {
  // With this, we transform the wierd error in our reponse in Mongoose to an operatnal error with a nice friendly message that an actaul human can read.
  const message = `Invalid ${err.path}: ${err.value}.`;
  // Returing our own error
  return new AppError(message, 404);
};

//2) HANDLING DUPLICATE DATABASE FIELDS
const handleDuplicateFieldsDB = (err) => {
  // The error message for any duplicate field can be in below
  // "errmsg": "E11000 duplicate key error collection: practicenatours.tours index: name_1 dup key: { name: \"Test Relevant Tour\" }"

  //1) Getting the error messsage from Postman
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 404);
};

// THIS IS FOR THIS LECTURE
// 3) HANDLING MONGOOSE VALIDATION ERRORS
const handleValidationErrorDB = (err) => {
  // Getting the values from the error obj and mapping over to get only the "message"
  const errors = Object.values(err.errors).map((el) => el.message);
  console.log(errors); // errors is currently an array
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 404);
};

// Ends here

//////////
// ERRORS DURING DEVEPT VS PRODUCTION
// In Express applications, we often need to handle errors differently depending on the environment:
//1) Development environment: We want detailed error information, because this helps developers debug quickly.
//2) Production environment: We want to send only safe, user-friendly messages, so we don’t expose internal system details or sensitive data.

// 1) FC FOR THE DEVEPT
const sendErrorDev = (err, res) => {
  //So when we are devpt, we want to get all the information that we can .

  //All that we want to do to handle this error is to send a response to the client using the above
  res.status(err.statusCode).json({
    status: err.status,
    error: err, // We want the error also
    message: err.message,
    stack: err.stack, // We also want to get the err stack here
  });
};
//////
// 2) FC FOR THE PRODN
// In prodn, we have two Errors that can happen:
//a) Operational Errors = Expected and safe to show message Example: User enters invalid data, route not found, etc.
// These errors are marked with err.isOperational = true in the custom AppError class.
//b) Programming/Unknown Errors = Do not expose to the client Example: Bugs, Mongoose internal errors, package errors.
// These are not marked operational, so production sends generic responses.
const sendErrorProd = (err, res) => {
  //we want this code to be executed only when err is operational
  ///a) If Operational, Trusted error: send message  to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //b) Programming or other unknown error: don't leak error details to the client
  } else {
    // 1) log error: As devprs we want to know that this error occurred, so we will first log it to the console
    console.error('ERROR 💥', err);

    //2) We want to then send a generic error message as seen below
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

//////////
//  GLOBAL ERROR HANDLING MIDDLEWARE: To test this we can use 127.0.0.1:3000/api/tours in postman
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // The HTTP error code (default is 500).
  err.status = err.status || 'error'; // A simple text status like 'fail' or 'error'

  // CALLING FCS WHEN WE ENCOUNTER THE DIFFT ERRORS i.e
  // CALLING FOR DEVPT ERRORS
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  /////
  // CALLING FOR PRODN ERRORS: This should be Tested in Prodn
  else if (process.env.NODE_ENV === 'production') {
    //a) creating a new object (error) that inherits from the original error object just as we copy in arrays so we
    // do not tamper the original error object
    let error = Object.create(err);

    //b) USING handleCastErrorDB() when we encounter an invalid ID
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    // From response in Postman, we get "name": "CastError" in the Error obj

    // c) USING handleDuplicateFieldsDB() when we experience a duplicate field
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    // c) USING handleValidationErrorDB() when we experience a "ValidationError"
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
  
    // Sending Prodn Error
    sendErrorProd(error, res);
  }
};
