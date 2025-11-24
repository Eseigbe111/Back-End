
// CLASS FOR HANDLING UNHANDLED ROUTES

// Extending the built-in Error class
class AppError extends Error {
  // Error is JavaScript’s default error class.
  constructor(message, statusCode) {
    super(message); // This sets the message property in the parent Error class.
    this.statusCode = statusCode; // HTTP status code (e.g., 404, 500).

    // status: 'fail' for 4xx errors, 'error' for 5xx errors:
    // Since status is always fail, we want to check if it is a 4xx or 5xx error
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // we caon also do "`${this.statusCode}`" bcos it is still inside he constructor fc

    this.isOperational = true; //very error we create using the AppError class will have this property isOperational set to true.
    // The isOperational property helps distinguish between errors we create and unexpected errors from code or packages
    // Later, in the global error handling middleware, we can check this property to decide if it’s safe to send the error message
    // to the client.

    // The below creates a stack trace for the error object so you can see where the error was created in your code. This is extremely useful for debugging.
    Error.captureStackTrace(this, this.constructor);
    // this → refers to the current error object being created.
    // this.constructor → tells Node/JavaScript to exclude the constructor itself from the stack trace.
  }
}
// NB:
// The HTTP status codes themselves (401, 402, 403, 404, etc.) do not automatically
// have messages in JavaScript’s Error class. The Error class only has the message you
// provide when you create it.

module.exports = AppError;

