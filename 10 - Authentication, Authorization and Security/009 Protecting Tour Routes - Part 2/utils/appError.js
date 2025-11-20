// In this class, we actually want all of our "AppError" object to then inherit from the built-in error, and so let's extend the built-in
// error class like this "class AppError extends Error" as seen below:

class AppError extends Error {
  // Remember that this mthd below is called each time we create a new object from the AppError class
  constructor(message, statusCode) {
    // As usual when we extend a parent class, we call super in order to call the parent constructor. And we call it
    // with the message bcos this is the only parameter that the built-in error accepts
    super(message);
    // U might want to ask why did i not do "this.message= message". Well that's just bcos right here i called the parent class, and the
    // parent class is error, and whatever we  pass into it is gonna be the message ppt. And so by doing this super(message), we already
    // set the message ppty to our incoming message.

    this.statusCode = statusCode;
    //Also we want to set the status itself. So, remember the status can either be "fail" or "error", and we could pass that into the object,
    // but it's also not really necessary, bcos the status depends on the statusCode. So when the statusCode is 400, then the status will be
    // fail, and if it's  a 500, then it's going to be an error, and so let's simply test if the statusCode starts with a 4. So, i javascript,
    // there is a startsWith(), that we can  call on strings, and so let's basically convert the statusCode to a string, and test it as below:
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // So next up all the errors we will create using this class will be operatnal errors i.e erros that we can predict will happen at sm pt in
    // the future, like for e.g a user creating a tour without the required fields.
    this.isOperational = true; // Allour errors will get this ppt set to true. And i did this so that later we can then test for this ppt and
    // only send error messages back to the client for these operatnal errors that we created using this class. Now this is useful bcos sm other
    // crazy unexpected errors that might happen in our applicatn, for e.g a programming error, or sm bug in one of the packages that we require
    // into our app, and these errors will then of course not have this "isOPeratnal" ppt on them.

    //And now one last step is to capture the stack .
    //STACK TRACE: Each and every error has access to this ppt. This gives us the place where the error happened. To see this we can go to app.js
    // under this fc "app.use((err, req, res, next )=>{})" we do console.log(err.stack) as seen below i.e
    /* 
    app.use((err, req, res, next )=>{
      console.log(err.stack) 
      }) 
    */
    // This takes in the current object and the Apperror class itself
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
