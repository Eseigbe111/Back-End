// In this lecture, let's now completely refactor our application that we have so far, and create a lot of new files,
// and a whole new file structure. So remember from the last video that we wanted to separate our routers into dift
// files. And so that's going t be th 1st step that we will do.

//1) So i am going to create a new folder called Routes, and in there i will have one file for tourRoutes.js, userRoutes.js.

//2) We will also create controllers folder which will contain the route Handlers code. Later in this course, we will
// start using a software architecture called the  "Model View Controller", and in that architecture, the handlers fcs
// are actually called controllers. That's why i called the folder controller and will also call the files controllers.

//3)We will also create a server.js file, bcos it's a good practice to have everything that is related to exxpress in
// one file, and then everything that is related to the server in another main file So we will make sever.js to be our
// starting file i.e were everything starts, and it's there we will listen to our server.

//4) To finish,we will no longer run nodemon "filename", but instead we will run server.js, bcos we hve moved the app
// or the starting of the server into server.js. So bcos of this, i will write an npm script in our package.json file,
//  which will be run to start the server
///////

/// U WILL NEED TO WATCH THIS VIDEO TO SEE AND DO WHAT HE DID BCOS
// I WILL NOT BE ABLE TO WRITE THEM DOWN BCOS IT WAS DONE IN THE
// POSTMAN APP.

const express = require('express');
const morgan = require('morgan');
/// IMPORTING THE ROUTERS SO THE MOUNTED ROUTERS CAN WORK
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
//////
const app = express();
///////A) ALL MIDDLEWARES
// 3rd-PARTY MIDDLEWARE
app.use(morgan('dev')); // There are others apart from dev e.g tiny. They have dift formatting of what they produce

// EXPRESS MIDDLEWARE
app.use(express.json());
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
