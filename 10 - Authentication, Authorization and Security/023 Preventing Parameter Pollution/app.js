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

// helmet
const helmet = require('helmet');

// express-mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize');

// xss
const xss = require('xss-clean');

// hpp
const hpp = require('hpp');

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

// Setting Security HTTP headers
app.use(helmet()); // This willproduce the middleware fc that we need
// It is best to use the "helmet" package early in the middleware stack so that the headers are really sure to be set. so
// dont put it smw at the end but right at the beginning

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

// Body Parser, i.e Reading data from the body into req.body
app.use(express.json({ limit: '10kb' })); // Just passing an object of options, so that it a data exceeds this it will be rejected.

// Data Sanitization
//1) Data sanitizatn against NoSQL query injectn:
app.use(mongoSanitize()); // This "mongoSanitize()" is a fc we call that will then return a middleware fc that we can use

// So we test this by watching the video

//2) Data Sanitizatn against cross-side-script attacks i.e XSS
app.use(xss()); // This will clean any user import from malicious HTML code.

//// THIS IS FOR THIS LECTURE
//Preventing Parameter Pollutn
// 1) When Dupilcate fields are not necessary
// So welcome to the last lecture of this section where we're gonna be preventing parameter pollutn, using yet another npm package.
// B4 we install any package, let's go a head to Postman and see why we need to prevent against parameter pollutn

// When we send a req like this "{{URL}}api/v1/tours?sort=duration&sort=price", we will get an error like this "this.queryString.sort.split is not a function".
// This error is actually due to the fact that the split(), actually works on array and not strings bcos we sent a request which will be
// converted to an array bcos we sorted twice in our query, hence, the split() will not work for it and then it throws an error.
// And so this is a typical prob which attackers can then make use of. And so basically, we are now gonna use a middleware which will
// simply remove these duplicate fields.
// We will install "hpp" which stands for HTTP Parameter pollutn by doing "npm i hpp"

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
    ],
  }),
);
// And this should be use here as the last middleware bcos what it does is to clear up the query string

// We can test this by watching jonas again

//2) When Dupilcate fields are necessary
// Now we will actually really need some duplicate fields in sm cases like "{{URL}}api/v1/tours?duration=5&duration=9". i.e tours with duration
// of 5 and 9. So here the above use of "app.use(hpp())" will not work but if we deactivate the code by commenting it, it will work perfectly well.
// So what we can do to the "app.use(hpp())" middleware to get the expected result we want like in the e.g of duratn, is that we can white list
// sm parameters. To do this we an pass an object into the "hpp({})" as seen below:
/* 
app.use(
  hpp({
    whitelist: ['duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty'],
  }),
);
The whitelist is simply an array of ppt for which we want duplicates in the query string
*/

///Ends here

//////////

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
