//envmts=> environments
//prodn=>production
// From the 18 lecture, that's when i started creating each folder for the lesson bcos we are working with the MVC architecture, which
// may require updating dift parts of the project. So for me remember how the codes were, that's why i started working in dift folders.

/// NOW IF U HAVE ANY ISSUES WITH THE CODES U CAN WATCH THE VIDEOS FOE THE PARTS

// THIS IS FOR THIS LECTURE: This connectn is done in the "server.js" and "config.env"
// Most of the below for connectn are done in the config.env
//1) CONFIGURATION
//a) For connecting to a MongoDB Atlas cloud database.
// So now it's finally time to connect the MongoDB database that we created with our Express application.
// And the 1st step in doing that is to actually get our connectn string from Atlas. So, just like b4 when we connected the database to Compass
// and to the Mongo Shell.
// This time we click "connect" => Under "Connect to your application" click=> "Drivers"=> ensure that Nodejs and latest version are clicked,
// "mongodb+srv://temple:<db_password>@cluster0.3wmyz3z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", then copy the string and save
// it in ur "config.env" file for easy accessibility.
// Now we can put the password we had into the space for password but For me i will like to save them in a separate variable and replace it in
// code. I will also change my "<db_password>" to "<PASSWORD>" to make it more visible and this part "cluster0.3wmyz3z.mongodb.net/?" which is our
// Host, so basically the place where the database is hosted and the "/?" => our database is to be in btw the "/" and "?". As we know that the
// database we created is called "natours", which we did by the end of last section. And so it is very important that we replace the space with
// the name of the DATABASE i.e "natours" in our "config.env" file. i.e "cluster0.3wmyz3z.mongodb.net/natours?". If we do not do it this way, it
// will not work.

// If u r using the above, no need to do the below.

//b) For connecting to ur Local Computer.
// Now if u r using ur local DATABASE for this, the connectn string is a lot easier. So let's create a variable for that one as well, DATABASE_LOCAL.
// So we will do:
/* 
DATABASE_LOCAL = mongodb://localhost:27017/natours. 
Now in order for the above to work, u need to keep ur MongoDB server, so "Mongod.exe" process running at all time

*/

// The above is all for installattn, whether u are using ur Local Computer or connecting to a MongoDB Atlas cloud database.

//2) INSTALLING A MONGODB DRIVER:
// So this is basically a software that allows our Node code to access and interact with a MongoDB database. And there are a couple of dift MongoDB drivers,
// but we are gonna use the one that i would say is the most popular one, which is called "MONGOOSE", which adds a couple of  features to the native
// MongoDB driver. We will actually learn all about Mongoose in the next lecture. So we do the below to install it:
/* 
The version i am installing is version 5, so go ahead ro install version 5 so we all are on the same page.
npm i mongoose@5

So after the above. let's go over to server.js, which is kind of the file where we do all of the setup of our application. So here we will conigure MongoDB.
as seen below:

const mongoose = require("mongoose")
mongoose.connect()

*/

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
