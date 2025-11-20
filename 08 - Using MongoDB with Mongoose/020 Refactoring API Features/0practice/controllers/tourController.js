// IMporting tourModel
const Tour = require('../models/tourModel');
// THIS IS FOR THIS PART
const APIFeatures = require('../utils/apiFeatures');
// Ends here

// MAKING API BETTER ALIASING: We will use GET "127.0.0.1:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price"
/// Middleware Handler for the top-5-cheap tours
exports.aliasTopTours = (req, res, next) => {
  // We are manipulating the req.query obj bcos of this part
  req.query.limit = 5; // since we are talking about 5 tours
  req.query.sort = '-ratingsAverage'; // We want to sort them by these two
  // console.log(req.query.limit, req.query.sort);

  next();
};

// DEFINING OUR HANDLER FCs
//a) Doing a get(): THis currently reads from our Local file
// Handler for getting all Tours
// THIS IS FOR THIS LECTURE
exports.getAllTours = async (req, res, next) => {
  // console.log(new APIFeatures(Tour.find(), req.query));
  try {
    // EXECUTE QUERY: Unlike Jonas own, we are awaiting bcos our paginate() is an async fc which is due to the fact
    // that we wanted the error message if a page that does not exist is clicked
    const features = await new APIFeatures(Tour.find(), req.query, Tour)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //Getting all the tours
    const tours = await features.query;

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
// Ends here

/////////

//c) Responding to URL parameters: This gets just one tour or an element with the ID
// Handler for getting a Tour
exports.getTour = async (req, res, next) => {
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
exports.createTour = async (req, res, next) => {
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

exports.updateTour = async (req, res, next) => {
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
exports.deleteTour = async (req, res, next) => {
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
