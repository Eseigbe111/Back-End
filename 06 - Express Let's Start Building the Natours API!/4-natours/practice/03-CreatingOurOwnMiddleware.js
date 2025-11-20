// Importing files sys
const fs = require('fs');

// Importing moduleof express
const express = require('express');

//  We create a variable called app. Again this is a kind of a standard
// We assign it the result of calling express. This adds a bunch of mthds to our app variable below
const app = express(); // This creates a new instance of express() which is store in app

//
//3rd-PARTY MIDDLEWARE: For this we will use "morgan". Morgan is a popular logging middleware for Express
// that lets you see details about each incoming request (like method, URL, status code, and response time)
// directly in the console i.e smth like this "GET /api/v1/tours 200 4.907 ms - 8681".
// We install by doing "npm i morgan", and we use it as below:
const morgan = require('morgan');
app.use(morgan('dev'));
// Morgan is res

//

// EXPRESS MIDDLEWARES
// Telling Express to use the JSON body parser middleware
// The below tells Express "Whenever a request comes in with JSON data, please parse it and make it available as req.body."
// If not, we will only see the id of what is created without the body
app.use(express.json());

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

////
// Reading the file from dev-data/data/tours-simple.json
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//
// DEFINING ROUTES
//a) Doing a get(): THis currently reads from our Local file
// Handler for getting all Tours
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  // res.status(200).send('Hello from the server side!'); // With this we send a string to the client
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

/////////

//c) Responding to URL parameters: This gets just one tour or an element with the ID
// Handler for getting a Tour
const getTour = (req, res) => {
  //1)Get the ID from the Url which is located in the req.params.id
  const id = req.params.id * 1; // 1 there converts it to a number

  if (id > tours.length) {
    return res.status(404).json({
      // 404 means server could not find the webpage u requested
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  const tour = tours.find((el) => el.id === id);

  // res.status(200).send('Hello from the server side!'); // With this we send a string to the client
  res.status(200).json({
    // we can also send json to the client
    status: 'success',
    data: {
      tour,
    },
  });
};

///////////

// b) Doing a post(): This currently creates a new tour
// Handler for creating a new Tour
const createTour = (req, res) => {
  // For now we are creating the ID manually, but later in it will be handled by the MongoDB database
  // whch will create IDs on its own.

  //1) So here we will get the ID of the last element and add 1 to it so that our new element will just stay
  // behind it as seen below
  const newId = Number(tours[tours.length - 1].id) + 1;

  //2) Creating a new tour by adding the newId to the "req.body"
  const newTour = { id: newId, ...req.body };

  //3) Moving the newly created tour to tours which we see in our POstman
  tours.push(newTour);

  //4) Persisting the tours having the newTour into the dev-data/data/tours-simple.json so it can be stored
  //  accessed
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours), // We converted it to string bcoc that's how it is saved in the tours-simple.json file
    (err) => {
      // sending a response
      res.status(201).json({
        // 201 means created
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

////////////

// d) Handler for a PATCH request
// A PATCH req is for updating.
const updateTour = (req, res) => {
  //1)Get the ID from the Url which is located in the req.params.id
  const id = req.params.id * 1; // 1 there converts it to a number

  if (id > tours.length) {
    return res.status(404).json({
      // 404 means server could not find the webpage u requested
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  //So we will just send back a standard response. In our main project, we will do all those in full.
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

/////

// e) Handler for a DELETE request
// A DELETE req is for removing.
const deleteTour = (req, res) => {
  //1)Get the ID from the Url which is located in the req.params.id
  const id = req.params.id * 1; // 1 there converts it to a number

  if (id > tours.length) {
    return res.status(404).json({
      // 404 means server could not find the webpage u requested
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  //So we will just send back a standard response. In our main project, we will do all those in full.
  res.status(204).json({
    // 204 is for deleted
    status: 'success',
    data: null,
  });
};

// A better way to handle them is by chaining
// These have no IDs
app.route('/api/v1/tours').get(getAllTours).post(createTour);

// These have IDs
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//Starting up a server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
