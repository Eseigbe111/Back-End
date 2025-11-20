//devpt=> development
//prodn=>production
// envmnt=> environment

const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  // From our error in the response we see "path", which is basically the name of the field for which the input data is in the wrong format in a ppt
  // called "value", which also shows the wrong string or ppt used.
  // So we will use the 'path' and 'value' to handle the error.
  const message = `Invalid ${err.path}: ${err.value}.`;
  // With this, we transform the wierd error in our reponse in Mongoose to an operatnal error with a nice friendly message that an actaul huan can read.
  return new AppError(message, 400); // And we will then simply return our own path error
};

const handleDuplicateFieldsDB = (err) => {
  // This is the message: "E11000 duplicate key error collection: natours.tours index: name_1 dup key: { name: \"The Sea Explorer\" }" gotten from the response
  // in postman. So to get this part \"The Sea Explorer\", we woud have to use requler expression to take it out of the whole string, so we can use it below.
  // For this part i googled the reqular expression bcos it is a bit difficult. So we got this from stackoverflow:
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0]; // This "match(/dup key: \{ name: "(.*?)" \}/)" can also be used
  // console.log(value); // Value is an array as we see in the vsc terminal, but what i need is actually the "The Sea Explorer"
  // So we can do:
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 404);
};

const handleValidationErrorDB = (err) => {
  // Now in order to create one big string out of allthe errors, we basically have to loop over all of the objects in our response
  // that contain the messages we need and extract all the error messages into a new array.
  const errors = Object.values(err.errors).map((el) => el.message);
  console.log(errors);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 404);
};

///// THIS IS FOR THIS LECTURE: Fc for handling jwt error
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);
//Ends here

// fcs for the if else statements
// fc for the development
const sendErrorDev = (err, res) => {
  //So when we are devpt, we want to get all the information that we can .

  //All that we want to do to handle this error is to send a response to the client using the above
  res.status(err.statusCode).json({
    status: err.status,
    error: err, // We want the error also
    message: err.message,
    // This message will be gotten from the error we created in this app.all('*', (req, res, next) =>{}) above
    // to test this fc
    stack: err.stack, // We also want to get the err stack here
  });
};

// fc for the productn
const sendErrorProd = (err, res) => {
  //we want this code to be executed only when err is operational
  /// Operational, Trusted error: send message  to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      // This message will be gotten from the error we created in this app.all('*', (req, res, next) =>{}) above
      // to test this fc
    });

    //Programming or other unknown error: don't leak error details to the client
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

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  //500 is internal server error
  err.statusCode = err.statusCode || 500; // this is using optnal chaining
  // the "err.statusCode" will sho if defined and if not the default

  /// we do this just like the above
  err.status = err.status || 'error'; // 'error' is when we have a 400 status code and then it is a fail

  // Checking if the env is for devpt
  if (process.env.NODE_ENV === 'development') {
    // Calling the fc for the devpt
    sendErrorDev(err, res);
    //
  } else if (process.env.NODE_ENV === 'production') {
    ////////
    //1) Trying an invalid ID
    let error = Object.create(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    //2)Handling Duplicate name: So this has no name ppt, so what we will use in identifying this error is using this " "code": 11000 ",
    // which is from the response when a duplicate name is sent in a request to create a tour in postman.
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    // THIS IS FOR THIS LECTURE: HAndling errors that maybe cause by jwt(token)
    //1) Error as a result of manipulated token
    // This error is gotten when smo tries to manipulate the token. To see this error we can go to the jwt debugger and try manipulating
    // the token and we will see that when we try the manipulated token in Postman we are going to arrive at this error: 'jsonwebTokenError'
    // and that we are handling now:
    if (error.name === 'jsonwebTokenError') error = handleJWTError(error);

    //2) Error from Expired token: To simulate this, we will change the time it takes for our toekn to expire in "config.env" file to 5s.
    // Then we go to postman and try to login again then a new token will be generated which will expire in 5000(5 millisecs). So we can
    // copy it and try it in our VALUE space to see the error it will give. B4 then we go back to developement i.e npm start. So we will
    // see the error name is "TokenExpiredError" i.e the token has expired.
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
    //Ends here

    ///
    // calling the fc for prod
    sendErrorProd(error, res);
  }
};

// After everything for the coding we will run "npm run start:prod" and then send he request with the
// wrong or not existing ID to see what error response it will give.
