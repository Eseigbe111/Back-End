//envmts=> environments
//prodn=>production
// From the 18 lecture, that's when i started creating each folder for the lesson bcos we are working with the MVC architecture, which
// may require updating dift parts of the project. So for me remember how the codes were, that's why i started working in dift folders.

/// NOW IF U HAVE ANY ISSUES WITH THE CODES U CAN WATCH THE VIDEOS FOE THE PARTS

// THIS IS FOR THIS LECTURE: THis will be coded in server.js, tourModel, tourController, tourRoutes
// We just learned a lot about MVC, and so lets now very quickly refactor our code in order to fit that architecture a bit better.
// And actually, we already have our controller folder and the tour and user controllers in them, and we already have the routes in the
// route folder.
// And so what we need to create a models folder, and create a tourModdel.js in there.
// we will then move the "schema and the entire model declaratn" in our server.js into the tourModel.js.

// Deleting most codes:
// We will also delete the testTour, we created created bcos we were just using it to test the applicatn.
// All we want to do in this file is to connect it to the database, but then everything that is about the models themselves, will always
// live inside of a file, inside of the model folder.
// Then our Tour which we moved to the tourModel will be exported so it can be used in the tourController where we want to create, query,
// delete and update tours.
// We will also get rid of "const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),);" bcos we do not
// need it again as it was for testing purpose also.
// We will also comment most of the codes in out "tourController.js" for this lecture so as not to get errors. But the same structure will
// be needed for the other lectures, hence we did not delete them.

//So what i am doing above is to basically clean the code that we wrote b4 in order to no longer depend on the data that we had in json file.

//So also we will be deleting the checKID() in the "tourModel" bcos from now we are gonna start working with the IDs that are coming from
// MongoDB, and Mongo itself will give us an error if we use an invalid ID, and so the checkID(), was very useful for showing u how middleware
// actually works, by giving u this very practical example here. And later in the course people, of course, use more middleware, but this
// particular fc i.e checkD(), we will no longer need.
// We will get ride of the fs import bcos it is for reading our local data.

//Also we will comment out router.param('id', tourController.checkID);

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
