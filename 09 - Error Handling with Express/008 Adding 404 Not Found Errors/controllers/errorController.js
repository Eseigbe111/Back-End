module.exports = (err, req, res, next) => {
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
};
