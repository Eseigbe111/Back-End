// IMporting tourModel
const Tour = require('../models/tourModel');

// DEFINING OUR HANDLER FCs
//a) Doing a get(): THis currently reads from our Local file
// Handler for getting all Tours
exports.getAllTours = async (req, res) => {
  try {
    //Getting all the tours
    const tours = await Tour.find();

    // Sending a res
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
    //
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

/////////

//c) Responding to URL parameters: This gets just one tour or an element with the ID
// Handler for getting a Tour
exports.getTour = async (req, res) => {
  try {
    // Getting the tour:
    const tour = await Tour.findById(req.params.id);
    //findById is an helper fc for writting findOne({_id: req.params.id}) with the filter object

    //Sending a response
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
    //
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

///////////

// b) Doing a post(): This currently creates a new tour
// Handler for creating a new Tour
exports.createTour = async (req, res) => {
  try {
    // Creating a new tour using our tourSchema above
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      // 201 means created
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

////////////

// d) Handler for a PATCH request
// A PATCH req is for updating.

exports.updateTour = async (req, res) => {
  try {
    // Getting he tour and updating it
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //Return the newly updated document
      runValidators: true, //Validate the data before savings
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
    //
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

/////

// e) Handler for a DELETE request
// A DELETE req is for removing.
exports.deleteTour = async (req, res) => {
  // finding and deleting the tour
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      // 204 is for deleted
      status: 'success',
      data: null,
    });
    //
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
