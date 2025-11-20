const fs = require('fs');

//Importing the Tour from tourModel
const Tour = require('./../models/tourModel'); // "./"=> current folder, "../"=>Go up 1 folder

//// THIS IS FOR THIS LECTURE
///// Fc for Handling the GET request
exports.getAllTours = async (req, res) => {
  try {
    //TO get all the Tours from the database, we do "Tour.find()" without passing any arguments
    // (remember when we want to query for all the docs, we did that also):

    const tours = await Tour.find(); // This will also return a promise which needs to be handled with async/await

    res.status(200).json({
      status: 'success',
      results: tours.length, // We can do this bcos tours is an array
      data: {
        tours, // or u can just write tours:tours
      },
    });
  } catch (err) {
    // We will handle these errors well in the next section
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//// Fc for Responding to URL parameters
exports.getTour = async (req, res) => {
  try {
    // This here will just be like the getAllTours(), but with the diff of "id" for a particular query
    const tour = await Tour.findById(req.params.id);
    //Now we have ".find()" which gives all the docs, we have ".findOne()", which finds just one doc.
    // The ".findById()" is a short hand of writing "findOne with a specific argument or query or filter i.e .findOne({_id: req.params.id})".
    // So ".findOne({_id: req.params.id})" will work just like ".findById()"
    // In our "tourRoute.js", if it was another variable e.g name, title etc then it will be "req.params.name"
    // or "req.params.title"

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour, // or u can just write turs since the key and value have the same namei.e tour
      },
    });
  } catch (err) {
    // We will handle these errors well in the next section
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

///Ends here

//2)Fc for Posting request:
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body); // we pass the req.body bcos that is what contains what we are interested in
    // i.e the data that comes from the POST() request. Again, the data that comes from the the POST body. And so that's stored
    // inside of req.body

    // while 201 stands for created and 200 stands for success
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
    // Handling errors that can occur
  } catch (err) {
    // VALIDATION ERROR: Will be handled here
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!', // For now we will handle this error like this but late, we will learn how to handle these errors
    });
  }
  // To test this, we used the POStman app and used the the "Create New Tour" we saved already.
  // WATCH THIS AGAIN TO SEE HOW JONAS TESTED IT USING THE Postman app
};

///Fc for Handling a PATCH request
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>', // In this position, we are to send back the updated tour(i.e tour: tour OR tour), but
      // bcos of what i already explained, i will just send back a string
    },
  });
};

//// Fc for Handling Delete request.
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null, // The data is null to show that the data no longer exists
  });
};
//smo=> someone

// THIS IS FOR THIS LECTURE:
// So let's now learn how to read docs with Mongoose in order to implement our getTour() and getAllTours() route handlers.
// So go above to the handler fcs to see what we need to do.
