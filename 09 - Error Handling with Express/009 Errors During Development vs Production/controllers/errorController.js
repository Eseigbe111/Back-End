//devpt=> development
//prodn=>production
// envmnt=> environment

// THIS IS FOR THIS LECTURE:
// In this video, we're gonna implement sm logic in order to send dift error messages for the devpt and prodn envmnts.
// So now we are sending the below basically to everyone,no matter if we're in devpt or in prodn
/* This code is from errorController
    res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    });
*/
// But the ideal is that in prodn, we want to leak as litle informatn about our errors to the client as possible. So in that case, we only want to send
// like a nice, human-friendly message so that the user knows what's wrong. But on the other hand, when written in devpt, we want to get as much informatn
// about the error that occurred as possible, and we want that right in the error message that's coming back. So we could log that informatn also to the
// console, but i think it's way more useful to have that informatn right in Postman, in this case. So we already know how to distinguish btw the devpt
// and the prodn envmnt.

// fcs for the if else statements
//1) fc for the development
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

//2) fc for the productn
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

  // Now in order for this to work, there is smth really important that we need to do. Right now, there are errors that are
  // for e.g that are coming from Mongoose, which we do not mark as Operational. In so, in this case, they would right now
  // simply be handled using the generic error message. for e.g a Validation error. Rightnow, that's an error that's coming
  // for Mongoose and not from out our own AppError class. We do not create these errors by ourselves. And so again, they are
  // right now not mrked as operational, but we of  course need to mark them as operational so that we can send the appropriate
  // error message back to the client "that the input data is invalid"
};
// Ends here

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  //500 is internal server error
  err.statusCode = err.statusCode || 500; // this is using optnal chaining
  // the "err.statusCode" will sho if defined and if not the default

  /// we do this just like the above
  err.status = err.status || 'error'; // 'error' is when we have a 400 status code and then it is a fail

  // THIS IS FOR THIS LECTURE
  // We will move this if else block to their own fcs and call them
  if (process.env.NODE_ENV === 'development') {
    //So when we are devpt, we want to get all the information that we can .

    //All that we want to do to handle this error is to send a response to the client using the above
    // res.status(err.statusCode).json({
    //   status: err.status,
    //   error: err, // We want the error also
    //   message: err.message,
    //   // This message will be gotten from the error we created in this app.all('*', (req, res, next) =>{}) above
    //   // to test this fc
    //   stack: err.stack, // We also want to get the err stack here
    // });

    // Calling the fc for the devpt
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // res.status(err.statusCode).json({
    //   status: err.status,
    //   message: err.message,
    //   // This message will be gotten from the error we created in this app.all('*', (req, res, next) =>{}) above
    //   // to test this fc
    // });

    // calling the fc for prod
    sendErrorProd(err, res);
  }
  //Ends here

  // So this code below as used tomodify the if else block
  // //All that we want to do to handle this error is to send a response to the client using the above
  // res.status(err.statusCode).json({
  //   status: err.status,
  //   message: err.message,
  //   // This message will be gotten from the error we created in this app.all('*', (req, res, next) =>{}) above
  //   // to test this fc
  // });
};

// THIS IS FOR THIS LECTURE
// So lets' take the above to the next level and talk about OPERATNAL ERRORS
// Now let's remember in our AppError class that we created, and let's remember we set all the errors that we create, using AppError as "isOperatnal: true".
// So all the errors that we create ourselves will basically be operatnal errors. And in fact, it's only these operatnal errors for which we want to send the
// error message down to the client, in the prodn phase. So when we , on the other hand, have a programming error, orsm other unknown error that comes for e.g,
// from a 3rd party package, we do not want to send any error message about that to the client in prodn. And so let's now use the "isOperanal" ppt in our "errorController".
// So we will add the below to our "sendErrorProd()" as seen below:
/* 
if(err.isOperational){
i.e we want to send the code in the block
status: err.status,
    error: err, // We want the error also
    message: err.message,
    // This message will be gotten from the error we created in this app.all('*', (req, res, next) =>{}) above
    // to test this fc
    stack: err.stack, // We also want to get the err stack here
  });
} else {
  res.status(500).json({
status:'error',
message: 'Something went very wrong'
  })
  }
 
  // And doing smth like this is actually a standard procedure
*/

// Ends here
