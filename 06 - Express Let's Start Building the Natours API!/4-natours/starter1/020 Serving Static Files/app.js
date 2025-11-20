// From the 18 lecture, that's when i started creating each folder for the lesson bcos we are working with the MVC architecture, which
// may require updating dift parts of the project. So for me remember how the codes were, that's why i started working in dift folders.

/// U WILL NEED TO WATCH THIS VIDEO TO SEE AND DO WHAT HE DID BCOS
// I WILL NOT BE ABLE TO WRITE THEM DOWN BCOS IT WAS DONE IN THE
// POSTMAN APP.

const express = require('express');
/// IMPORTING THE ROUTERS SO THE MOUNTED ROUTERS CAN WORK
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//////
const app = express();
///////A) ALL MIDDLEWARES
// 3rd-PARTY MIDDLEWARE
app.use(morgan('dev')); // There are others apart from dev e.g tiny. They have dift formatting of what they produce
// EXPRESS MIDDLEWARE
app.use(express.json());
/////
///This is for this lecture: SERVING STATIC FILE
// let's now learn how to serve static files with Express.
// What are static Files: It's the files that are sitting in our file sys that we currently cannot access using all the routes. So for e.g
// we have this overview.html in our public folder. But now there is no way that we can access this using a browser. And the same is also
// true for the files in the public folder. And this is bcos we have not define any route for the URL that leads to the folder. And so if,
// we actually want to access smth from our files sys, we need to use a built in Express MIDDLEWARE. Let us see how we can do that:
app.use(express.static(`${__dirname}/public`));
/// With the above, we will be serve our html in the browser. Now we will view it using this URL "127.0.0.1:3000/overview.html". We cannot
// access it using "127.0.0.1:3000/public/overview.html" that is why we used '127.0.0.1:3000/overview.html'. The reason we don't need the
// public folder in the URL is bcos when we open up a url that it can't find in any of our routes, it will then look in that public folder
// that we defined. And it kind of sets that folder to the root.
// Now the imgs are broken, that's is bcos this is not the way the htmlis to be served. I just want to a visual feedback as i an teaching
// that's why when we go to this "127.0.0.1:3000/overview.html" url, we can see the request that were made as we served the overview.html
// when we check our vsc terminal.

////////

//CREATING OUR MIDLEWARE FC
app.use((req, res, next) => {
  //a) Doing what we want in the code
  console.log('Hello from the middleware 👋');

  //b) Using the next()
  next();
});

//we can create difft numbers of middleware fc.
//2) 2nd Middleware fc:  In this one below, we want to alter the res()
app.use((req, res, next) => {
  //a) Doing what we want in the code
  req.requestTime = new Date().toISOString(); // Wgat we ae doing here is just to add the current time to the request
  //b) calling the next()
  next();
});
///////
///C) ROUTES
//THIS IS CALLED MOUNTING THE ROUTER
app.use('/api/v1/tours', tourRouter); //This is using the tourRouter in our application on the '/api/v1/tours'
app.use('/api/v1/users', userRouter); //This is using the userRouter in our application on the '/api/v1/users'

// Exporting our app so we can get it in server.js
module.exports = app;
