const fs = require('fs');

//Importing the Tour from tourModel
const Tour = require('./../models/tourModel'); // "./"=> current folder, "../"=>Go up 1 folder

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
    // The ".findById()" is a short hand of writing "findOne with a specific argument or query or filter i.e .findOne({_id: req.params.id})".

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

//// THIS IS FOR THIS LECTURE:
///Fc for Handling a PATCH request
exports.updateTour = async (req, res) => {
  try {
    // For this , we want to query for the doc that we want to update and update it.
    //  can actually do that in one command with mongoose. Remember again that we ere gonna update a tour
    // based on "id". So it is similar to the ".findById()".

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }); // The "req.params.id" is the "id" we want to update, "req.body"=> the data body where the "id" is found,
    //{new: true,}=> Puts that the new updated doc is what will be returned.
    //runValidators: true => This ensures that the validators i.e required field, we set on our tourSchema must be as it
    // is in the tourSchema(this part is seen in our "tourModel"). So if we put a string instead of a number which was stated in
    // any, it will give error. This can actually be seen when testing it with Postman app.

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//// Fc for Handling Delete request.
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null, // The data is null to show that the data no longer exists
  });
};

// THIS IS FOR THIS LECTURE:
// In this video, let's implement doc updating. So we will work on our updateTour(). Most of the mthds used
// in the handlers fcs, with the exceptn of createTour() are actually query mthds used in Mongoose. These
// are actually found in the Mongoose documentation.
// There are actually many mthds in Mongoose.
