//envmts=> environments
//prodn=>production
//fclty=> functionality
/// NOW IF U HAVE ANY ISSUES WITH THE CODES U CAN WATCH THE VIDEOS FOE THE PARTS

// THIS IS FOR THIS LECTURE:=> This will be done in "app.js"

/////
const morgan = require('morgan');
const express = require('express');

// Ratelimit
const ratelimit = require('express-rate-limit');
// THIS IS FOR THIS LECTURE:helmet
const helmet = require('helmet');
// Ends here

/// Importing the AppError
const AppError = require('./utils/appError');
//Importing the AppError
const globalErrorHandler = require('./controllers/errorController');

/// IMPORTING THE ROUTERS SO THE MOUNTED ROUTERS CAN WORK
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//////
const app = express();

///////A) GLOBAL MIDDLEWARES
//THIS IS FOR THIS LECTURE
// Setting Security HTTP headers
// In this video, we are gonna use another npm package in order to set a couple of really important security http headers.
// So to set these headers we will yet again use a middleware fc which will come from an npm package. And it is called
// "helmet" an we will install it by doing "npm i helmet". It is a conventn that any one using this express app should
// use the helmet package

app.use(helmet()); // This willproduce the middleware fc that we need
// It is best to use the "helmet" package early in the middleware stack so that the headers are really sure to be set. so
// dont put it smw at the end but right at the beginning

// Watch how jonas tested this
//Ends here

// Devpt Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // There are others apart from dev e.g tiny. They have dift formatting of what they produce
}

/// Implementing Rate Limiting
const limiter = ratelimit({
  // The "ratelimit" receive an object of fcs. In side the object we can define how many requests per IP we are going to allow in a certain amount of time.
  max: 100,
  // For the " windowM " i.e window millisecs, i want to alow 100 reqs per 1hr as seen in the below:
  windowMs: 60 * 60 * 1000,
  // If the limit of 100reqs per 1hr is crossed, an error message will be rendered as seen below:
  message: 'Too many requests from this IP, Please try again in an hour!',
  // So we kind of need to find a balance which works best for our applicatn. For e.g if u are build ing an API which really needs a lot of requsts for one IP,
  // then of course, this number "max" here should be greater.
});

// We will then use the limiter it like below:
// What we actually want is to limit access to our API route and we can do this by adding "/api". And this will basically affect all the routes that basically
// start with this URL "/api"
app.use('/api', limiter);

// THIS IS FOR THIS LECTURE
// Body Parser, i.e Reading data from the body into req.body
app.use(express.json({ limit: '10kb' })); // Just passing an object of options, so that it a data exceeds this it will be rejected

// Rendering static file from our laptop
app.use(express.static(`${__dirname}/public`));

//Test Middleware we can create difft numbers of middleware fc.
//2) 2nd Middleware fc:  In this one below, we want to alter the res()
app.use((req, res, next) => {
  //a) Doing what we want in the code
  req.requestTime = new Date().toISOString(); // What we are doing here is just to add the current time to the request
  // console.log(req.headers); // This is how we get access to http headers i.e the ones client can send along with their request

  //b) calling the next()
  next();
});
///////

///C) ROUTES
//THIS IS CALLED MOUNTING THE ROUTER
app.use('/api/v1/tours', tourRouter); //This is using the tourRouter in our application on the '/api/v1/tours'
app.use('/api/v1/users', userRouter); //This is using the userRouter in our application on the '/api/v1/users'

// CREATING A MIDDLEWARE TO HANDLE UNHANDLED ROUTES: After the code below, we can test it using what we used initially i.e "127.0.0.1:3000/api/tours/"
// So with app.all(), below we are handling for any mthds or verbs that can be used in a URL i.e GET, POST, PATCH etc
app.all('*', (req, res, next) => {
  // "*" selects all mthds
  // we will write the error fc in the next()
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

///

// THIS FUNCTN IS AN ERROR HANDLING MIDDLEWARE
// So since this middleware is an error fc, then its 1st argument will be the err.
app.use(globalErrorHandler);
////
// Exporting our app so we can get it in server.js
module.exports = app;
