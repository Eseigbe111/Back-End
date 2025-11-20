// IMporting tourModel
const Tour = require('../models/tourModel');

// THIS IS FOR THIS LECTURE:
// MAKING API BETTER ALIASING: We will use GET "127.0.0.1:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price"
/// Middleware Handler for the top-5-cheap tours
exports.aliasTopTours = (req, res, next) => {
  // We are manipulating the req.query obj bcos of this part
  req.query.limit = 5; // since we are talking about 5 tours
  req.query.sort = '-ratingsAverage'; // We want to sort them by these two
  // console.log(req.query.limit, req.query.sort);

  next();
};

// Ends here

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

    let query = Tour.find(JSON.parse(queryStr)); // We did not await the straight away like this "await Tour.find(queryObj)" we have other mthds
    // to be called on on the query.

    // SORTING: Remember sort was in the excludedFields so if we want to sort by prices and do GET 127.0.0.1:3000/api/v1/tours?sort=price,ratingsAverage
    // in Postman, nothing will happen.But let's now handle that case
    // console.log(req.query);
    if (req.query.sort) {
      // Getting the sort from the req.query
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy);

      // sorting the query by sortBy
      query = query.sort(sortBy);
    } else {
      //This is if no "sort()" on req.query, it should be sorted by the last to be created i.e so the newest ones appear first
      //bcos of the "-"
      query = query.sort('-createdAt'); // JONAS used this for the sorting but it did not work for me as it did for him.
      // So chatgpt told me it was better to use  query = query.sort('_id'); rather than query = query.sort('-createdAt');
      // query = query.sort('_id');
    }

    // FIELD LIMITING: Limiting fields (also called field selection or projection) is used to tell MongoDB:
    // “Only send me these specific fields — I don’t need the rest.”. We send a GET "127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price"
    if (req.query.fields) {
      // console.log(req.query.fields);
      const fields = req.query.fields.split(',').join(' ');
      // console.log(fields);
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // We want to exclude this in the selection
    }

    // MAKING BETTER PAGINATION : We used GET "127.0.0.1:3000/api/v1/tours?page=2&limit=3" for our query string in Postman bcos in total we just have 9 docs for now
    // PAGINATION - is the splitting a large set of data into smaller chunks (pages) so you don’t load everything at once. Let’s say you have 1000 documents (for example, 1000 tours, products, or users)
    // stored in a database. You don’t want to send all 1000 at once to the front-end, because: It’s slow, It wastes bandwidth, and The user can’t see everything on one screen anyway. So instead, you divide
    // them into pages, e.g lets say we have 1000 docs, results per page(which is limit) = 10, so 1000 / 100 = 10pages. So we will have Page 1 → documents 1–100, Page 2 → documents 101–200, Page 3 → documents
    // 201–300 and so on.

    // The SKIP() - When using MongoDB (or Mongoose), there’s a method called .skip() that tells the database how many results to skip before starting to return documents. The general formula is:
    // skip = (page - 1) * limit. E.g lets say we want 10 results per pages i.e For page 1: (1 - 1) * 10 = 0 → skip 0, start from doc 1, For page 2: (2 - 1) * 10 = 10 → skip 10, start from doc 11 and For page 3:
    // (3 - 1) * 10 = 20 → skip 20, start from doc 21. So this is how we use it below

    const page = req.query.page * 1 || 1; // to convert the string to number and also we used optional chaining
    // to define a default valueof 1 i.e  "|| 1"
    const limit = req.query.limit * 1 || 100; // This means If the user provides a limit in the query string (e.g. ?limit=5), use that value,
    // If not, use the default value, which here is 10.
    // console.log(typeof page, limit);

    const skip = (page - 1) * limit; //The number we want to be skipped

    query = query.skip(skip).limit(limit); //This is what we want to query

    // Checking if page exists
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
      // This error will be caught in the catch block below
    }

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
