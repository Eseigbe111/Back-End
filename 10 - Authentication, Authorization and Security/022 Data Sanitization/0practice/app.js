///THIS IS FOR THIS LECTURE
// THis will be coded in "app.js"
// Ends here

// Importing morgan
const morgan = require('morgan');

// Importing module of express
const express = require('express');

// Importing express-rate-limit
const ratelimit = require('express-rate-limit');

// Importing helmet
const helmet = require('helmet');

// Importing express-mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize');

// Importing xss-clean
const xss = require('xss-clean');

// Importing AppError
const AppError = require('./utils/appError');

// Importing our globalErrorHandler
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//  We create a variable called app. Again this is a kind of a standard
// We assign it the result of calling express. This adds a bunch of mthds to our app variable below
const app = express(); // This creates a new instance of express() which is store in app

// //////
// SETTING SECURITY HTTP HEADERS: we do "npm i helmet"
// We use "helmet", an npm package, to automatically set secure HTTP headers.
// These headers protect the app from common web attacks (XSS, clickjacking, etc).
app.use(helmet());
// helmet() returns a middleware function.
// app.use() adds that middleware to the global middleware stack.
// This means EVERY incoming request will pass through it.

// It is best to place helmet at the TOP of the middleware stack.
// Putting it early ensures the security headers are applied before any route is handled.

////////
//3rd-PARTY MIDDLEWARE: For this we will use "morgan". Morgan is a popular logging middleware for Express
// that lets you see details about each incoming request (like method, URL, status code, and response time)
// directly in the console i.e smth like this "GET /api/v1/tours 200 4.907 ms - 8681".
// We install by doing "npm i morgan", and we use it as below:
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // There are others apart from dev e.g tiny. They have dift formatting of what they produce
}
///////////////

// IMPLEMENTING RATE LIMITING: we install by doing "npm i express-rate-limit" and then require it above
// Rate limiting helps defend against Denial-of-Service (DoS), brute force, and spam attacks.
// It works by counting how many requests a single IP makes and blocking that IP after a limit.
// The rate limiter will be added as a GLOBAL middleware inside app.js i.e It affects all routes unless specified.
// 1) CREATING a rate limiter
const limiter = ratelimit({
  // a) Allowing 100 requests per IP
  max: 100, // You should adjust "max" depending on how many requests your API normally needs.
  // b) For the windowMs (window in milliseconds), allow 100 requests per hour:
  windowMs: 60 * 60 * 1000,
  // c) Message shown when an IP exceeds the limit:
  message: 'Too many requests from this IP, Please try again in an hour!',
});

// 2) Applying the limiter to API routes: This applies the limiter only to routes starting with /api
// We then use the limiter like below:
app.use('/api', limiter);
///////////////

// BODY PARSER
// Body Parser – Reading data from the request body into req.body
app.use(
  //1) express.json(): This middleware parses incoming JSON data from the request body. After parsing,
  // the JSON becomes available on req.body.
  express.json({ limit: '10kb' }),
  //2) { limit: '10kb' }: This restricts the size of incoming JSON data to 10 kilobytes.
  // If someone tries to send more (e.g., a huge JSON payload), Express rejects the request.
  // This is a security measure to prevent: denial-of-service attacks, overly large request bodies, unnecessary memory usage
);

/////////
// THIS IS FOR THIS LECTURE
// DATA SANITIZATION: This is done To clean incoming data in req.body, req.query, and req.params so attackers cannot inject malicious
// code into your app.
// 1) Sanitizing Against NoSQL Injection: we do "npm i express-mongo-sanitize"
// a) ⚠ The ATTACK: Which is a Malicious login payload like:
// { "email": { "$gt": "" }, "password": "anything" }
// which would trick MongoDB because $gt is a valid operator → always true → attacker could log in as any user.
// b) PROTECTION:
app.use(mongoSanitize());
// This Scans req.body, req.query, and req.params and Removes MongoDB operator characters: "$" and "." . Preventing
// attackers from injecting NoSQL operators into queries.

// 2) Sanitizing Against XSS (Cross-Site Scripting): we do "npm i xss-clean"
// a) ⚠ The ATTACK: An attacker injects malicious HTML/JS:
// <script>alert("hacked!")</script>
// If your app later renders that HTML, the script executes.
// b) PROTECTION:
app.use(xss());
// This cleans user input, Removes / escapes malicious HTML + JavaScript, Prevents XSS attacks (scripts running inside your pages).
// Note: Mongoose validators also help by blocking invalid data from entering the DB.
// Ends here

////////////

// EXPRESS MIDDLEWARES
// Telling Express to use the JSON body parser middleware
// The below tells Express "Whenever a request comes in with JSON data, please parse it and make it available as req.body."
// If not, we will only see the id of what is created without the body
app.use(express.json());
//////////

// SERVING STATIC FILE
// We can access the below in our browser by "127.0.0.1:3000/overview.html". And it can not be accessed like "127.0.0.1:3000/public/overview.html"
// bcos it is not found on the routes.
app.use(express.static(`${__dirname}/public`));
///////

// MIDDLEWARES
// Middleware: A function in Express that runs between a request and a response. It can modify the request, the response, or
// stop or pass the flow to the next function.
// NB: You can modify data without middleware, but middleware is the standard way to do it in Express because it lets you
// handle data before it reaches your routes.
// To use a middleware, we need to use "app.use()"  just like this "app.use(express.json());" above

// 1) 1st MIDDLEWARE: So this middleware will be logged on the terminal of vsc each time we send a req i.e in our POstman
app.use((req, res, next) => {
  console.log('Hello from the middleware ');
  next(); // without this next() we will have an unending req-res cycle
});

//2) 2nd MIDDLEWARE: So here we want to add time parameter to our req and we will call this in getAllTours()
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// /////

/// THIS IS CALLED MOUNTING THE ROUTER
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//////////////////
// MIDDLEWARE FOR HANDLING UNHANDLED ROUTES: To test this we can use 127.0.0.1:3000/api/tours in postman
// we add a middleware after all our route handlers (i.e., after mounting the routers). This middleware will only run if none of the
// existing routes matched the request.
app.all('*', (req, res, next) => {
  // app.all('*') means it applies to any HTTP method (GET, POST, PATCH, etc.) and any URL.
  // So after creating a class to handle the errors in appError.js,this is how we will call
  // it then in the next()
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  // Pass the error to the global error handling middleware
});
// NB: This must be placed at the very bottom of the route definitions. If we place it at the top, it would catch every request, making
// our actual routes unreachable.

////////////////////
//  GLOBAL ERROR HANDLING MIDDLEWARE: To test this we can use 127.0.0.1:3000/api/tours in postman
app.use(globalErrorHandler);

////////////////

module.exports = app;
