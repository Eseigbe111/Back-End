const fs = require('fs');

// THIS IS FOR THIS LECTURE:
// As the next feature in our API, we have field Limiting, so basically in order to allow clients to choose which fields they want to get back in
// the response.
// So for a client, it's always ideal to receive as little data as possible, in order to reduce the bandwith that is consumed with each request.
// And that's of course, especially true when we have really data-heavy data sets. And so it's a very nice feature to allow the API to only
// request sm of the fields.

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

    //C) SORTING: Remember sorting was in the excludedFields so if we want to sort by prices and do "127.0.0.1:3000/api/v1/tours?sort=price"
    // in Postman, nothing will happen.But let's now handle that case
    if (req.query.sort) {
      // Mongoose requests a string with sort name separated by spaces
      const sortBy = req.query.sort.split(',').join(' '); //console.log(req.query.sort); will give a string that's why we can use split() and join().
      // This gives them space so we can use their values
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // THIS IS FOR THIS LECTURE
    //D) FIELD LIMITING:
    // Just as always let me show u how it will work in Postman, we sill send this string "127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price"
    // So the implementation will actually be similar with what we did to sorting
    if (req.query.fields) {
      // Mongoose requests a string with the field name separated by spaces just like above
      const fields = req.query.fields.split(',').join(' ');
      //This below removes the fields we do not want to send to the client
      query = query.select(fields); // Here it expects string like "name duration price etc". And this called projecting
    } else {
      // Just like b4, a default if the user does not specify the fields
      query = query.select('-__v'); // So we will remove any field that we can not send to the client e.g "__v" that mongoose creates on it own b4 sending to the client
      // For this the "-" inside the select is for excluding. As we send this response "127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price", we will see
      // that the "__v" no longer comes with the response.
      // This "query.select()" works for anything we do not want i our API
    }

    //NB: We can also exclude fields right from the schema. And that can be very useful for e.g, when we have sensitive data that
    // should only be used internally. For e.g stuffs like password should never be exposed to the client, and so, we can exclude
    // sm fields right in the schema. Now let's say, we always want to hide the "createdAt" field, we can do the below in the schema:
    /*
    we will add the select field and set it to false. This way the createdAt will not be seen
    
    createdAt: {
    type: Date,
    default: Date.now(),
    select: false
    }
      The schema is in the tourModel
    */

    //Ends here

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
