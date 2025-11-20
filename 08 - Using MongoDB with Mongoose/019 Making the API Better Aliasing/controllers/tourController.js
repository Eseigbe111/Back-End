//NB // JONAS used " // query = query.sort('-createdAt');" for the sorting but it did not work for me when i needed it for //E) MAKING BETTER PAGINATN.
// So chatgpt helped me and said it was better to use  query = query.sort('_id'); rather than query = query.sort('-createdAt'); and it worked.

/////
//Importing the Tour from tourModel
const Tour = require('./../models/tourModel'); // "./"=> current folder, "../"=>Go up 1 folder

// THIS IS FOR THIS LECTURE: MAKING THE API BETTER FOR ALIASING
// Another nice small feature that we can add to an API is to provide an alias route to a request that might be very popular,
// so that might be requested all the time. For e.g, we might want to provide a route specifically for the 5 best cheap tours.
// So the request would be like this "127.0.0.1:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price". So that means we have
// limit=5, and we will "sort by ratings and price". Now let's say this is a request "127.0.0.1:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price"
// that is done all the time and we want to produce a route that simple and easy to memorize for the user

/// Middleware Handler for the top-5-cheap tours
exports.aliasTopTours = (req, res, next) => {
  // we are manipulating the query object, so that when it reaches the getAllTours() handler, it's then already dift
  req.query.limit = '5'; // Getting the limit from the query
  req.query.sort = '-ratingsAverage,price'; // Getting the sort from the query
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'; // We are also specifying sm fields here and not all,
  // so the user doesnot get access to all that we have
  next(); // Without the next(), this fc will not be executed
};
// This fc above will set the ppts of the query object to the values specifid in the fc. Basically prefilling the parts of
// the query object b4 we then reach the "getAllTours" handler. As soon as we get to "getAllTours ", the query object is
// already prefilled, even if the user did not put any parameter in the query string.  In essence what we are doing is
// prefilling the query string so that the user doesn't have to do it on his own.
// To test this we send this response "127.0.0.1:3000/api/v1/tours/top-5-cheap" in the Postman

// We can do more with alias route but there is no need here,i just want to show u the power of MIDDLEWARE and ALIAS routing
//Ends here

///// Fc for Handling the GET request
exports.getAllTours = async (req, res) => {
  try {
    //1) BUILD A QUERY.
    //A) FILTERING
    //create a shallow copy of req.query object as seen below:
    const queryObj = { ...req.query }; // creating a new object using desrtucting
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    //Next we will need to basically remove these fields i.e excludedFields from our query object.
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query, queryObj);

    //B) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //"g", makes it to replace all. As at wheni am dooing this course we can use replaceAll().
    // console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));

    //C) SORTING: Remember sorting was in the excludedFields so if we want to sort by prices and do "127.0.0.1:3000/api/v1/tours?sort=price"
    // in Postman, nothing will happen.But let's now handle that case
    if (req.query.sort) {
      // Mongoose requests a string with sort name separated by spaces
      const sortBy = req.query.sort.split(',').join(' '); //console.log(req.query.sort); will give a string that's why we can use split() and join().
      // This gives them space so we can use their values
      console.log('sortBy:', sortBy);
      query = query.sort(sortBy);
      //
    } else {
      // query = query.sort('-createdAt');// JONAS used this for the sorting but it did not work for me when i used it for Pagination below.
      // So chatgpt told me it was better to use  query = query.sort('_id'); rather than query = query.sort('-createdAt');
      query = query.sort('_id');
    }

    //D) FIELD LIMITING:
    // Just as always let me show u how it will work in Postman, we sill send this string "127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price"
    // So the implementation will actually be similar with what we did to sorting
    if (req.query.fields) {
      // Mongoose requests a string with the field name separated by spaces just like above
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields); // Here it expects string like "name duration price etc". And this called projecting
    } else {
      // Just like b4, a default if the user does not specify the fields
      query = query.select('-__v');
    }

    //E) MAKING BETTER PAGINATN
    //Getting the page and limit from the query string
    const page = req.query.page * 1 || 1; // to convert the string to number and also we used optional chaining
    // to define a default valueof 1 i.e  "|| 1"
    const limit = req.query.limit * 1 || 100; // the 100 results is the default as we have 100 results per page.

    const skip = (page - 1) * limit; // "(page - 1) * limit" is all the results that come b4 the page that we're actually requesting now.
    //So if we are requesting page 3, our results are gonna start at page number 21. And so we wanna skip 20 results be that. That's bcos
    // we have "2pages * 10 results on each"
    query = query.skip(skip).limit(limit);
    // So we will send this response "127.0.0.1:3000/api/v1/tours?page=1&limit=3" since we have limited results. we try this
    // "127.0.0.1:3000/api/v1/tours?page=2&limit=3"

    // Handling when a page number is entered that does not exist
    if (req.query.page) {
      //getting the no. of tours with ".countDocuments()" which is a mthd in mongoose
      const numTours = await Tour.countDocuments(); // This counts the number of the docs
      if (skip >= numTours) throw new Error('This page does not exists'); // This will be caught in the
      //catch block
    }

    //2) EXECUTE THE QUERY
    const tours = await query;

    //3) SEND RESPONSE
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
      message: err, // For now we will handle this error like this but late, we will learn how to handle these errors
    });
  }
  // To test this, we used the POStman app and used the the "Create New Tour" we saved already.
  // WATCH THIS AGAIN TO SEE HOW JONAS TESTED IT USING THE Postman app
};

///Fc for Handling a PATCH request
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
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

//// Fc for Handling Delete request.
exports.deleteTour = async (req, res) => {
  try {
    // This will be pretty similar to updateTour()
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null, // The data is null to show that the data no longer exists
    });
  } catch (err) {
    // We will handle these errors well in the next section
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
