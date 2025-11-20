//envmts=> environments
//prodn=>production
// From the 18 lecture, that's when i started creating each folder for the lesson bcos we are working with the MVC architecture, which
// may require updating dift parts of the project. So for me remember how the codes were, that's why i started working in dift folders.

/// U WILL NEED TO WATCH THIS VIDEO TO SEE AND DO WHAT HE DID BCOS
// I WILL NOT BE ABLE TO WRITE THEM DOWN BCOS IT WAS DONE IN THE
// POSTMAN APP.

// This is for this lecture: INSTALLING eslint
// B4 moving on to the next section and mongoDB, i want to show u how to setup "eslint" together with prettier in vsc in order to improve
// our code quality.
// What is esLint? This is basically a program that constantly scans our code and finds potental coding errors or simply bad coding practices
// that it thinks are wrong. It  is very configurable so that we can really fine tune it to our needs, and coding habits.

// Now we can also use esLint for code formatting, but we will continues using prettier that we already setup earlier for that. so we will
// set up this entire thing so that prettier is still main code formatter but based on sm esLint rules that we will define. And so all that
// esLint will do for us is to highlight the errors.

// The 1st thing to do is to install esLint extension on vsc by searching for "esLint"
// Next up, we need to install a bunch of dev dependencies: we will install esLint and prettier as npm packages: "npm i eslint prettier eslint-config-prettier
//  eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev".
//  I am installing multiple packages all at once. All these extensions are very import or this projects and future projects.

// The next step is that we need config files for both prettier andd eslint. For these i already did them and they are both in the starter files,
// so we don't waste time doing them together and making this vdeos extremely long
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
// We got access to "process.env.NODE_ENV" bcos the reading of the variables "dotenv.config({ path: './config.env' });" from the file in the server.js
// to the node process only needs to happen once. It's then in the process and the process is of course the same no matter in the what file we are.
// And so the process where our application is running is always the same and this is available to us in every single file in the project.
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // There are others apart from dev e.g tiny. They have dift formatting of what they produce
}
// EXPRESS MIDDLEWARE
app.use(express.json());
/////
// SERVING STATIC FILE
// let's now learn how to serve static files with Express.
// What are static Files: It's the files that are sitting in our file sys that we currently cannot access using all the routes.
app.use(express.static(`${__dirname}/public`));
/// With the above, we will be serve our html in the browser. Now we will view it using this URL "127.0.0.1:3000/overview.html".

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
