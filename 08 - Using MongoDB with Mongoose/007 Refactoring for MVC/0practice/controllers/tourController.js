const fs = require('fs');

// THIS IS FOR THIS LECTURE: we refactored, removing what we mght not need
// IMporting tourModel
const Tour = require('../model/tourModel');

// Chaining Multiple Middleware fc
// A MIDDLEWARE fc that checks if the body constains the name and price.
exports.CheckBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }

  next();
};

// DEFINING ROUTES
//a) Doing a get(): THis currently reads from our Local file
// Handler for getting all Tours
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  // res.status(200).send('Hello from the server side!'); // With this we send a string to the client
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

/////////

//c) Responding to URL parameters: This gets just one tour or an element with the ID
// Handler for getting a Tour
exports.getTour = (req, res) => {
  //1)Get the ID from the Url which is located in the req.params.id
  const id = req.params.id * 1; // 1 there converts it to a number

  // res.status(200).send('Hello from the server side!'); // With this we send a string to the client
  res.status(200).json({
    // // we can also send json to the client
    // status: 'success',
    // data: {
    //   tour,
    // },
  });
};

///////////

// b) Doing a post(): This currently creates a new tour
// Handler for creating a new Tour
exports.createTour = (req, res) => {
  res.status(201).json({
    // 201 means created
    // status: 'success',
    // data: {
    //   tour: newTour,
    // },
  });
};

////////////

// d) Handler for a PATCH request
// A PATCH req is for updating.
exports.updateTour = (req, res) => {
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
exports.deleteTour = (req, res) => {
  //So we will just send back a standard response. In our main project, we will do all those in full.
  res.status(204).json({
    // 204 is for deleted
    status: 'success',
    data: null,
  });
};

// Ends here
