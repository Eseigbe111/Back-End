// THIS IS FOR THIS LECTURE
// BETTER ERRORS AND REFACTORING:
//  GLOBAL ERROR HANDLING MIDDLEWARE: To test this we can use 127.0.0.1:3000/api/tours in postman
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // The HTTP error code (default is 500).
  err.status = err.status || 'error'; // A simple text status like 'fail' or 'error'

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
// Ends here
