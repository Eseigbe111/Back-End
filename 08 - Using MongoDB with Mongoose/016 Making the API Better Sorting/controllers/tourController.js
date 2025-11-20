const fs = require('fs');

// THIS IS FOR THIS LECTURE:
// Let's now implement result sorting, in order to enable our users to sort result based on a certain field.
// To see all our results i.e lets get to Postman in our Get All Tours and see our tours by sending a response with "127.0.0.1:3000/api/v1/tours" as usual.
// So let's say we want to sort the tours results by price, starting with the lowest price and then moving up allthe way to the highest price. So let's allow
// the user to sort the results based on a string that can be passed using the query string. We can do this to sort by price "127.0.0.1:3000/api/v1/tours?sort=price"
//

/////
//Importing the Tour from tourModel
const Tour = require('./../models/tourModel'); // "./"=> current folder, "../"=>Go up 1 folder

///// Fc for Handling the GET request
exports.getAllTours = async (req, res) => {
  try {
    //1) BUILD A QUERY
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

    // THIS IS FOR THIS LECTURE
    //C) SORTING: Remember sort was in the excludedFields so if we want to sort by prices and do "127.0.0.1:3000/api/v1/tours?sort=price"
    // in Postman, nothing will happen.But let's now handle that case
    if (req.query.sort) {
      // Mongoose requests a string with sort name separated by spaces.
      const sortBy = req.query.sort.split(',').join(' '); //console.log(req.query.sort); will give a string that's why we can use split() and join().
      // This gives them space so we can use their values
      console.log(sortBy);
      query = query.sort(sortBy); // "req.query.sort" will be the value of the field in ur case "price" in this "127.0.0.1:3000/api/v1/tours?sort=price"
      // After this line of code "query.sort(req.query.sort)",we can then send a response to "127.0.0.1:3000/api/v1/tours?sort=price", we will
      // see that it will be sorted in Postman. So this is for ascending order. To sort for descending order, we do "127.0.0.1:3000/api/v1/tours?sort=-price".
      // Now to sort fields with the same price, we can then rank them according to a 2nd criteria i.e if there is a tie in price, we can then
      // sort them based on a 2nd criteria. In mongoose, we will do "sort('price ratingsAverage')". The URL in Postman will be like  this
      // 127.0.0.1:3000/api/v1/tours?sort=price,ratingsAverage
    } else {
      // The esle block is if the user does not specify any sort field in the URL query string, we are still going
      //to add a sort to the query with the "createdAt" field in a descending order. That's actuallythe time starting from
      // the last to be created i.e so the newest ones appear first
      query = query.sort('-createdAt');
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
