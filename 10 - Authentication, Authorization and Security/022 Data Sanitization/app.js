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
app.use(express.json({ limit: '10kb' })); // Just passing an object of options, so that it a data exceeds this it will be rejected

// THIS IS FOR THIS LECTURE
// Data Sanitization
// In this lecture, we're going to use two more packages to improve our applicatn security, and this time to perform data sanitizatn.
// So Data Sanitizatn basically meansto clean all the data that comes into the applicatn form malicious code i.e code that is trying
// to attack our application. In this case, we're trying to defend against 2 attacks. Solet's write that down.

// So this middleware just above "app.use(express.json({ limit: '10kb' }));" reads the data into "req.body", and only after that we
// can actually clean that data. So this is a perfect place for doing the data sanitizatn.

//1) Data sanitizatn against NoSQL query injectn:
// B4 we do anything else, let me show u in Postman why it is very important to defend against this "NoSQL query injectn" type of attacks.
// If we send in Postman these login details ""email": {"$gt": ""}" with a valid password, we will be able to login to any acc bcos this
// is always true no matter what and this is a "malicious query injectn"
// To protect ourselves against this, let's install another middleware called "express-mongo-sanitize" by doing "npm i express-mongo-sanitize"

app.use(mongoSanitize()); // This "mongoSanitize()" is a fc we call that will then return a middleware fc that we can use
// So what this middleware does is to look at the req.body, the request query string and also at the req.params, and then it will basically
// filter out all of the dollar signs and dots, bcos that's how MongoDB operators are written. By removing that, well, these operators are
// then no longer going to work.

// So we test this by watching the video

//2) Data Sanitizatn against cross-side-script attacks i.e XSS
// We will install xss for this part by doing "npm i xss"
app.use(xss()); // This will clean any user import from malicious HTML code.
// Imagine that an attacker would try to insert sm malicious HTML code with sm javascript code attached to it. If that would then later be
// injected into our HTML site, it could really create sm damage then. And so using this "xss()" middleware, we prevent that baically by
//converting all these HTML symbols.
// Now as i said b4, the mongoose validatn itself is actually a very good protectn against XSS, bcos it won't relly allow any crazy stuff
// go into our database, as long as we useit correctly.

// So we test this by watching the video

// Ends here

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
