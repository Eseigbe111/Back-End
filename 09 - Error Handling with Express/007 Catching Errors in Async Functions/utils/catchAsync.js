//  THIS IS FOR THIS LECTURE

module.exports = (fn) => {
  return (req, res, next) => {
    // fn(req, res, next).catch((err) => next(err));
    // we can actually write the above like this:
    fn(req, res, next).catch(next); // So this catch() will pass the error into the next() which will then make it so that our error ends up in our
    // globalErrorHandling middleware. This line of code is what allows us to easily get rid of the catch block.

    //If we now create a new tour and sm error happens, for e.g from an invalid input, then tge error should of course be catched here in this catch(),
    // and will then be propagated to our error handling middleware and so that one will then send back the error response that we're expected to
    // receive. So lets' try that out by creating a new tour in Postman and exluding one of the required field
  };
};

// Ends here 