const fs = require('fs');

// THIS IS FOR THIS LECTURE: This is our aim in this lecture: We want to replace all the part of the operators that don't have the "$"
// of MongoDB operator with that with the "$" i.e gte, gt, lte, lt etc to $gte, $gt, $lte, $lt etc respectively.

// So the filtering mthd we implemented from the last lecture already works great, but in this video we wanna take it to the next level
// by allowing sm even more complex queries.
// So right now, a user can only filter the docs by one key equal to a value as seen in Postman GetAllTours "127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy".
// But now, we actually want to also implement the ">", ">=", "<", "<=" operators. So instead of just having "=", wee want to actually be
// able to say "duration >= 5" and not just "equal = 5".So manually,we will write these like this for e.g {difficulty: 'easy', duration: { $gte: 5}} i.e gte=>greater than or equal to.
// But in real life or Postman we will do it like this "127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy", which is a standard way.
// So we will go ahead and take a look at the query string that Express gives us.
/////
//Importing the Tour from tourModel
const Tour = require('./../models/tourModel'); // "./"=> current folder, "../"=>Go up 1 folder

///// Fc for Handling the GET request
exports.getAllTours = async (req, res) => {
  try {
    //1) BUILD A QUERY
    //A) FILTERING
    // create a shallow copy of req.query object as seen below:
    const queryObj = { ...req.query }; // creating a new object using desrtucting
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    // Next we will need to basically remove these fields i.e excludedFields from our query object.
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query, queryObj);

    // THIS IS FOR THIS LECTURE:
    //Lets log req.query and send a response with this "127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy"
    // in POstman to see what we will get. For this ignore the error on Postman. It is the log on the Vsc terminal
    // i am interested in.
    // console.log(req.query);
    // We get this "{ duration: { gte: '5' }, difficulty: 'easy' }", which is similar to {difficulty: 'easy', duration: { {$gte: 5} },
    // if we were to write it in MongoDB. The only diff is the "$" which is ppt for MongoDB operator to say we are using special ppts.
    // SO we will implement this above in "ADVANCED FILTERING"

    //B) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    // We want to replace all the part of the operators that don't have the "$" of MongoDB operator with that with the "$" i.e
    // gte, gt, lte, lt etc to $gte, $gt, $lte, $lt etc respectively. There are so many ways to do this but i will stick with
    // regular expression. Jonas: Most of the time i google these things to know how to do it and the easiest mthd to use.
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //"g", makes it to replace all. replaceAll(), will not work bcos it does not take a fc
    console.log(JSON.parse(queryStr)); // we will send a response to see the log on the terminal. We see that it worked as we
    // now have the "$" sign in front of he operator i.e {duration: { {$gte: '5'}, difficulty: 'easy'}
    // Will not do this:
    // const query = Tour.find(queryObj);
    //But this:
    const query = Tour.find(JSON.parse(queryStr));

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
