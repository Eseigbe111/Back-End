// Importing files sys
const fs = require('fs');

// Importing moduleof express
const express = require('express');

//  We create a variable called app. Again this is a kind of a standard
// We assign it the result of calling express. This adds a bunch of mthds to our app variable below
const app = express(); // This creates a new instance of express() which is store in app

//

// Telling Express to use the JSON body parser middleware
// The below tells Express "Whenever a request comes in with JSON data, please parse it and make it available as req.body."
// If not, we will only see the id of what is created without the body
app.use(express.json());

//

// Reading the file from dev-data/data/tours-simple.json
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//
// DEFINING ROUTES
//a) Doing a get(): THis currently reads from our Local file
// Handler for getting all Tours
const getAllTours = (req, res) => {
  // res.status(200).send('Hello from the server side!'); // With this we send a string to the client
  res.status(200).json({
    // we can also send json to the client
    message: 'success',
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
    message: 'success',
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
        message: 'success',
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
    message: 'success',
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
    message: 'success',
    data: null,
  });
};

////////////
// These are the routes
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

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
