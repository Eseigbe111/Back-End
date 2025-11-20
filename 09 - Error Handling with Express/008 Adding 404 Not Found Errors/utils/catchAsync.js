module.exports = (fn) => {
  return (req, res, next) => {
    // fn(req, res, next).catch((err) => next(err));
    // we can actually write the above like this:
    fn(req, res, next).catch(next); // So this catch() will pass the error into the next() which will then make it so that our error ends up in our
    // globalErrorHandling middleware. This line of code is what allows us to easily get rid of the catch block.
  };
};
