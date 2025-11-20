//envmts=> environments
//prodn=>production

/// NOW IF U HAVE ANY ISSUES WITH THE CODES U CAN WATCH THE VIDEOS FOE THE PARTS

// THIS IS FOR THIS LECTURE:=> This will be done in "app.js"
/////
const morgan = require('morgan');
const express = require('express');
/// IMPORTING THE ROUTERS SO THE MOUNTED ROUTERS CAN WORK
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//////
const app = express();

///////A) ALL MIDDLEWARES
// 3rd-PARTY MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // There are others apart from dev e.g tiny. They have dift formatting of what they produce
}
// EXPRESS MIDDLEWARE
app.use(express.json());
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

// THIS IS FOR THIS LECTURE:
// Now b4 we go deep into actual error handling, lets 1st write a handler for undefined routes. So basically for routes that we
// didn't assign any handler yet
// And 1st up, we need to start our application which we did quit during the debugging session. After that, let's go to postman
// and send a request to a route can not be found. So let's say , we  send this GET "127.0.0.1:3000/api/tours/". So the response we
// will get here is an html result. So Express automatically sends an HTML code, along with a 404 Not Found error code in case
// that there is not any handler for the route that was requested. Or we can easily misspell tour for e.g 127.0.0.1:3000/api/v1/tourss,
// in this case we will still get the same error. Now there is also another situatn which is if after tours we specify smth else
// i.e 127.0.0.1:3000/api/v1/tours/qwerty.So the error we get is that the "Cast to ObjectId failed for value ". And this is bcos we
// actually have a route that accepts an ID parameter after the tour slash i.e tour/. And so MongoDB is trying to find a doc with
// this ID, but cannot convert it to a valid MOngoDB object ID. And so again that is a difft situatn. So we will create a route
// for all the route that was not handled.

// So we will work in the 'app.js'.
// How are we gonna implement a route handler for a route that was not cached by any of our route handlers? So for doing that,
// remember that all these middleware fcs are executed in the order they are in the code.And so the idea is that if we have a request
// that makes it into this pt(means just below the TWO MOUNTED ROUTERS) of our code, then it means that neither the tourRouter nor
// the userRouter were able to cache it. So if we add a middleware just after the TWO MOUNTED ROUTERS, it will only be reached again
// if not handled by any of our routers.

// So let's implement it below here:
// CREATING A MIDDLEWARE TO HANDLE UNHANDLED ROUTES: After the code below, we can test it using what we used initially i.e "127.0.0.1:3000/api/tours/"
// So with app.all(), below we are handling for any mthds or verbs that can be used in a URL i.e GET, POST, PATCH etc
app.all('*', (req, res, next) => {
  // "*" selects all mthds
  // This app.all() will then run for all the mthds or verbs GET, POST, PATCH etc

  // So we want to simply send a response in the JSON format, so not the HTML that is always produced for UNHANDLED ROUTE
  res.status(404).json({
    // 404 is Nt Found status code
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
    // So the new response that we're sending back now is a lot better than the HTML that we were receiving previously.
  });
});
// So why did the above code work? Again the idea is that if we are able to reach this pt  i.e the code i just wrote "app.all('*', (req, res, next)=>{}) "
// then it means that the request response cycle was not yet finished at this pt (i.e the code i just wrote) in our code. Bcos remember that MIDDLEWARE
// is added to the middleware stack in the order that it's defined here inour code. And so basically this "app.use('/api/v1/tours', tourRouter);"
// runs 1st, and so if the route was matched here in our tourRouter then our request would never even reach this code "i.e the code i just wrote"
// and so the code will not get executed. And this basically should be the last Route after all our Route.
// Now if we were to put the code we just wrote on the top of our applicatn i.e jsut below "const app = express();", then u will see that no matter
// what request we gonna do, we will always get this same response i.e "status: 'fail'," and "message: `Can't find ${req.originalUrl} on this server`,".
// And this is bcos all request no reach this route handler "app.all('*', (req, res, next)=>{})", and it's actually matched bcos it's a GET request,
// which is part of all the verbs, and then all the routes, so all the URLs are cached here, and so of course it handles that URK that we just did
// in the POstman.

////
// Exporting our app so we can get it in server.js
module.exports = app;
