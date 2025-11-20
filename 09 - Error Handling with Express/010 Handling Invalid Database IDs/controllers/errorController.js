//devpt=> development
//prodn=>production
// envmnt=> environment

const AppError = require('./../utils/appError');

// THIS IS FOR THIS LECTURE
const handleCastErrorDB = (err) => {
  // From our error in the response we see "path", which is basically the name of the field for which the input data is in the wrong format in a ppt
  // called "value", which also shows the wrong string or ppt used.
  // So we will use the 'path' and 'value' to handle the error.
  const message = `Invalid ${err.path}: ${err.value}.`;
  // With this, we transform the wierd error in our reponse in Mongoose to an operatnal error with a nice friendly message that an actaul huan can read.
  return new AppError(message, 400); // And we will then simply return our own path error
};
// Ends here

/////
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
    // THIS IS FOR THIS LECTURE
    // There are 3 types of errors that might be created by Mongoose in which we need to mark as operatnal errors so that we can than
    // send back meaningful error messages to clients in prodn. And let's now start by simulating these 3 errors in Postman.

    //1) Trying an invalid ID: Send a request trying to get a tour with an invalid ID like "127.0.0.1:3000/api/v1/tours/uieoihosijosfius".
    // From the response, the error we get actually contains all the stuff that we defined in the prodns in an advent of an error.i.e
    // the err object, err stack etc. The response shows a perfect e.g of an Operatnal error,and this is smth thatmight well happen
    // during coding, and so we need send a meaningful error message in order to handle the error instead of "Cast to ObjectId failed for value \"uieoihosijosfius\" (type string) at path \"_id\" for model \"Tour\"",
    // which does not mean anything to any client. So the goal here is to mark this error as operatnal, and create a meaningful message,
    // but b4 then, let's go thru the remaining 2 types of errors

    //2) Trying a Duplicate name i.e creating a tour with a name that already exist: So we can try sending a request to create a new tour
    // with an existing name like "The Sea Explorer". It gives this error "E11000 duplicate key error collection: natours.tours index: name_1 dup key: { name: \"The Sea Explorer\" }".
    // So again this is an error that is going to happen at sm pt, and again, it doesn't have a very meaningful error message. And so again
    // we need to handle that also

    //3) Trying to update a tour with a value that is required not to be above  certain number for example we already required in our tourSchema
    // that the ratingsAverage should not be greater than 5 or lower than 1. Trying to update a ratingsAverage that goes against this will give
    // an error . And this is true for any required field. And so we need to handle these.

    // Now we will handle all these cases in the prodn, bcos we want to only do this in prodn. In devpt, we don't care about any of this, all we
    // want to do is to see our errors so we can basically fix them.

    ////////
    //1) Handling Duplicate name:
    //JOnas used the below, but it didnot work for me.
    // let error = { ...err };
    // BUT
    // ChatGpt told me to use th Object.creat() bcos: ...err does not copy non-enumerable properties like err.name, err.message, err.stack, etc.
    // That means error.name becomes undefined, so this condition. And it worked for me
    let error = Object.create(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    //Ends here
    // calling the fc for prod
    sendErrorProd(error, res);
  }
};

// After everything for the coding we will run "npm run start:prod" and then send he request with the
// wrong or not existing ID to see what error response it will give.
