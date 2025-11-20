const fs = require('fs');

////
// Reading the file from dev-data/data/tours-simple.json
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//THIS SIS FOR THIS LECTURE
// THe Param MIDDLEWARE that only checks for ids
exports.CheckID = (req, res, next, val) => {
  const id = Number(req.params.id); // Number converting to number
  console.log(id, val);
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};
// Ends here
////

// DEFINING ROUTES
//a) Doing a get(): THis currently reads from our Local file
// Handler for getting all Tours
exports.getAllTours = (req, res) => {
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
exports.getTour = (req, res) => {
  //1)Get the ID from the Url which is located in the req.params.id
  const id = req.params.id * 1; // 1 there converts it to a number

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
exports.createTour = (req, res) => {
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
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
