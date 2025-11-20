// IMporting tourModel
const Tour = require('../models/tourModel');

// DEFINING OUR HANDLER FCs
//a) Doing a get(): THis currently reads from our Local file
// Handler for getting all Tours
exports.getAllTours = async (req, res) => {
  try {
    // FILTERING: THis filltering is done just to remove the ppts onthe query we do not want to use
    // while building this use this GET "http://127.0.0.1:3000/api/v1/tours?duration=2&difficulty=easy&sort=1&limit=10"
    //  BUILD QUERY
    const queryObj = { ...req.query }; //making a shallow copy so we do not tamper with the  req.body

    // Below are the fields we want to exclude from queryObj
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // THIS IS FOR THIS LECTURE
    // ADVANCED FILTERING:
    // That’s the main purpose of advanced filtering — to make your query parameters from the URL look like real MongoDB queries that the database can understand.
    // we sent GET "127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy" in Postman did a console.log(req.query);. We want the result which is "{ duration: { gte: '5' }, difficulty: 'easy' }"
    // to be like {  duration: { {$gte: 5}, difficulty: 'easy' } i.e adding $ to gte, which is easily understood by Mongodb. So we will perform it on the "queryObj"
    // console.log(req.query, queryObj);

    // COVERTING queryObj to STRING so we can use regrex on it
    let queryStr = JSON.stringify(queryObj);

    // USING regrex on queryStr to
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(queryObj, JSON.parse(queryStr));

    const query = Tour.find(JSON.parse(queryStr)); // We did not await the straight away like this "await Tour.find(queryObj)" we have other mthds
    // to be called on on the query.

    // Ends here

    // EXECUTE QUERY
    //Getting all the tours
    const tours = await query;

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
