//envmts=> environments
//prodn=>production
// From the 18 lecture, that's when i started creating each folder for the lesson bcos we are working with the MVC architecture, which
// may require updating dift parts of the project. So for me remember how the codes were, that's why i started working in dift folders.

/// U WILL NEED TO WATCH THIS VIDEO TO SEE AND DO WHAT HE DID BCOS
// I WILL NOT BE ABLE TO WRITE THEM DOWN BCOS IT WAS DONE IN THE
// POSTMAN APP.

//////
/// This is for this lecture:
// In this video, u will learn all about environment variables.
// Nodejs or Express apps can run in dift envmts. And the most important ones are the devpt envmt and the prodn envmt. That's bcos, depending
// on the envmt, we might use dift databases for e.g, or we might turn login or off, or we might turn debugging on or off, or really all kinds
// of dift settings that might change depending on the devpt that we're in. So again the most important ones are the devpt and the prodn envmt.
// But there are other envmt that bigger teams might use. So this type of setting that i just mentnd, like dift databases or login turned on or
// off, that will be based on environment variables. Now by default Express sets the envmt to the devpt which makes a lot of sense bcos that's
// what we're doing when we start a new project.So let's for the sake of demonstratn look at that variable, and we're gonna do that in the server.js=> over to server.js
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
// This is for this lecture also
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
