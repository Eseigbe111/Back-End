const fs = require('fs');

// THIS IS FOR THIS LECTURE:=>
// Let'know keep working on our API.Over the next videos, we will implement a couple of command API features that make an API easier
// and more pleasant to use for whomever is gonna use it. In this lecture,we will start with filtering.

// So again the 1st feature we are gonna implement is to allow the user to basically filter data using a query string.
// This is what a query string look like "127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy".This is if u want to
// query tours that have duration=5 and difficulty=easy. And one very good thing is that the Postman App actually recognizes
// keys and values,which makes it easier for us. We now need a way of accessing the data "duration=5&difficulty=easy" in the
// query string, in our Express application. But luckily for us, that's very easy, bcos Express already took care of that.
// So that's just one of the many many things that Express does for us in order to really make Nodejs devpt a lot faster

/////
//Importing the Tour from tourModel
const Tour = require('./../models/tourModel'); // "./"=> current folder, "../"=>Go up 1 folder

///// Fc for Handling the GET request
exports.getAllTours = async (req, res) => {
  try {
    //THIS IS FOR THIS LECTURE
    // We do this kind of filtering in this route where we want to get all tour
    // console.log(req.query);
    // We head over to Postman app and send '127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy" in the GetAllTours
    //Then we will be able to see console.log(req.query);

    // WAYS TO WRITE DATABASE QUERY IN MONGOOSE:
    //1) USing filter objects i.e ({}),  just like we did in the mongoDB introduction section.
    /*    const tours = await Tour.find({
      duration: 5,
      difficulty: 'easy',
    }); */
    // For the above, if we send "127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy" in the GetAllTours, we will get
    // just two tours matching the criteria

    //2) Using Special Mongoose mthds: Tn this type we chain difft mongoose mthds to arrive at the same answer as the filter
    // object mthd. There are tons ofmthds to use fr dift things we want to do.
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //1)BUILD A QUERY
    //This is what we will use and then test it in Postman using this "127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy", we
    // will get the same answer as the above 2 mthds. This is actually the filter mthd.
    // const tours = await Tour.find(req.query);

    // Now the problem with the above implementation, is that its actually way too simple. And that's bcos later on we will have other
    // query parameters like for example "sort" for sorting fclty, "page" for paginatn. And so we need to make sure that we are not
    // querying for these in our database. So what we can do is to basically exclude these special field namesfromour query string b4
    // we actually do the filtering.

    // So what we will do is to
    //A) FILTERING
    //create a shallow copy of req.query object so as not to tamper with the original as seen below:
    const queryObj = { ...req.query }; // creating a new object using desrtucting
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    //Next we will need to basically remove these fields i.e excludedFields from our query object.
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log(req.query, queryObj);
    // To know if this worked, we will use this string "127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy&page=2&sort=1&limit=10" in
    // our Postman app to send a request to see what it will log from console.log(req.query, queryObj);. So from the log,it worked bcos it
    // excluded the "excludedFields"

    // const tours = await Tour.find(queryObj); // This will also return a promise which needs to be handled with async/await
    // Now as soon as we actually await the result of query i.e "await Tour.find(queryObj)", the query will then execute and come back with
    // docs that actually match our query. Then there will be no way of later implementing  "sorting",or "pagination", or all of these other
    // features. And so instead, what we will have to do, is to save this part "Tour.find(queryObj)" into a query, and then in the end, as
    // soon as we chain all the mthds to the query that we need to, only then can we await that query.
    // So we will do it this way below:

    const query = Tour.find(queryObj);

    //2) EXECUTE THE QUERY
    const tours = await query;

    ////Ends here

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
