//  THIS IS FOR THIS LECTURE
// THE main use of this fc is to handle errors by eliminating trycatch block

// When we write asynchronous route handlers in Express, we usually use try/catch blocks to handle errors. However, repeating try/catch in every async
// function makes the code messy and repetitive. Also, error handling does not belong inside controllers; it should be handled in the global error middleware.

// To solve this, we create a helper function called catchAsync().
// This function wraps any async route handler and automatically catches any errors that occur. Because async functions return Promises, if an error happens
// the Promise rejects — so we use .catch(next) to pass the error to next(), which sends it to our global error handling middleware.
module.exports = (fn) => {
  return (req, res, next) => {
    // fn(req, res, next).catch((err) => next(err));
    // we can actually write the above like this:
    fn(req, res, next).catch(next); // So this catch() will pass the error into the next() which will then make it so that our error ends up in our
    // globalErrorHandling middleware. This line of code is what allows us to easily get rid of the catch block.

    //If we now create a new tour and sm error happens, for e.g from an invalid input, then the error should of course be catched here in this catch(),
    // and will then be propagated to our error handling middleware and so that one will then send back the error response that we're expected to
    // receive. So lets' try that out by creating a new tour in Postman and exluding one of the required field
  };
};

// Ends here
