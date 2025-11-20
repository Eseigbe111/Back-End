//NB // JONAS used " // query = query.sort('-createdAt');" for the sorting but it did not work for me when i needed it for //E) MAKING BETTER PAGINATN.
// So chatgpt helped me and said it was better to use  query = query.sort('_id'); rather than query = query.sort('-createdAt'); and it worked.

//
//Importing the Tour from tourModel
const Tour = require('./../models/tourModel'); // "./"=> current folder, "../"=>Go up 1 folder

//Importing apsFeatures.js as a module
//BUILDING A QUERY
const APIFeatures = require('./../utils/apiFeatures');

// Importing catchAsync.js:
// As we imported this, we will then wrap all the the handler fcs in "catchAsync()" and eliminate catch blocks
// and also add "next()" to each of the handler fcs
const catchAsync = require('./../utils/catchAsync');

// THIS IS FOR THIS LECTURE
//Importing the AppError
const AppError = require('./../utils/appError');
//Ends here

/// Middleware Handler for the top-5-cheap tours
exports.aliasTopTours = (req, res, next) => {
  // we are manipulating the query object, so that when it reaches the getAllTours() handler, it's then already dift
  req.query.limit = '5'; // Getting the limit from the query
  req.query.sort = '-ratingsAverage,price'; // Getting the sort from the query
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'; // We are also specifying sm fields here and not all,
  // so the user doesnot get access to all that we have
  next();
};

/////////

///// Fc for Handling the GET request
exports.getAllTours = catchAsync(async (req, res, next) => {
  //2) EXECUTE THE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // NOw u'll realize that i did not add the check "if(!tour)" in this fc.
  // So, when there are 0 results found, for e.g bcos there are no results matching for a filter(), or bcos the page was requested that does not
  // exist, then of course we coulld consider sending a 404 error and saying that the data was not found but in my opinion and also the opinion
  // of other devprs, that is not entirely correct in this request bcos there was not really an error. I mean, the request was correctly received.
  // THe database correctly searched for the tours and found exactly 0 records, and so these 0 records are exactly what we're gonna send back along
  // with the 200 HTTP code.
  // So again, i consider that there can not really be an error when a user requests all the tours, unless of couurse there is sm failure in the
  // database or smth like that. But in that case, Mongoose will automatically throw an error, which in turn is gonna get catched by our catchAsync(),
  // as u already know, handled in our globalErrorHandling() middleware

  //3) SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length, // We can do this bcos tours is an array
    data: {
      tours, // or u can just write tours:tours
    },
  });
});

// THIS IS FOR THIS LECTURE: ADDING 404 NOT FOUND ERRORS
// Lets now make sm more use of our AppError class by adding a couple of 404 errors in sm  of our tour handler fcs.
// Now just one thing that i wanted to say b4 we actually implement these 404 errors is that of course we could have used the catchAsync fc also in our Router i.e like this:
/* 
router
  .route('/') 
  .get(catchAsync(tourController.getAllTours)) like this
  .post(tourController.createTour); 

  instead of doing it right in the controller.js. And this would have had the exact same result, but i didn't do it that way bcos like the above, i have to remember which of 
  the handler() mthds in the "tourRoutes" is actually an async mthd.So only on those i actually add the catchAsync(). Now in our case, actually all of them are async fcs and
  so, that's not really the matter, but there will be sm examples later where not all the handlers are asynchronous fcs, and so, in that case, i would really have to remember 
  which of them i have to wrap into catchAsync()and which ones not and so, in doing it in the controller is much easier bcos, simply each time that i'm writing an async fc in
  // the "tourController", they already know i need to wrap it into catchAsync().

*/
// So now let's continue with the implementatnof 404 error.
// We tried to get a tour for an ID that did not exist and the error that was "Cast to ObjectId failed for value \"hoyttgjhhjkgjhj\" (type string) at path \"_id\" for model \"Tour\"".
// But what happens when we actually use a valid MongoDB ID with just one or two chars changed? U would see that it would give us ""status": "success", "data": { "tour": null}", saying
// our data is null. And so that's not really what we want. what we want is to show a 404 staus code in our Postman, and say that the tour was not found. So let's now use our AppError
// class in order to implement that.
// Just keep in mind that the tour that we got back during our test is null i.e "status": "success", "data": { "tour": null}". So we can now test for that and use it to write our logic.

//Ends here

//// Fc for Responding to URL parameters
exports.getTour = catchAsync(async (req, res, next) => {
  // This here will just be like the getAllTours(), but with the diff of "id" for a particular query
  const tour = await Tour.findById(req.params.id);
  // The ".findById()" is a short hand of writing "findOne with a specific argument or query or filter i.e .findOne({_id: req.params.id})".

  // THIS IS FOR THIS LECTURE: To test al the 404 errors use the ID of  deleted tour
  // Checking if not tour i.e if not null i.e "status": "success", "data": { "tour": null}".In javascript, null is a falsy value i.e a value that will convert
  // to false in an "if" statement
  if (!tour) {
    //Here if !tour, we will create our error message
    return next(new AppError('No tour found with that ID', 404)); //So this jumps straight to our error handling middlewarebcos ofthe next() as we said in prev lectures
    // we want to return this error immediately and not move on to the next line, which would be "res.status(200).json({})" below, which will then try to send two responses
  }

  // So let's paste this if statement in all the handlers that query a doc based on the ID
  // Ends here

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour, // or u can just write turs since the key and value have the same name i.e tour
    },
  });
});

//2)Fc for Posting request:
exports.createTour = catchAsync(async (req, res, next) => {
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
});

//
///Fc for Handling a PATCH request
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // THIS IS FOR THIS LECTURE: Checking if not tour i.e if not null i.e "status": "success", "data": { "tour": null}".In javascript, null is a falsy value i.e a value that will convert
  // to false in an "if" statement
  if (!tour) {
    //Here if !tour, we will create our error message
    return next(new AppError('No tour found with that ID', 404)); //So this jumps straight to our error handling middlewarebcos ofthe next() as we said in prev lectures
    // we want to return this error immediately and not move on to the next line, which would be "res.status(200).json({})" below, which will then try to send two responses
  }
  //Ends here

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//// Fc for Handling Delete request.
exports.deleteTour = catchAsync(async (req, res, next) => {
  // This will be pretty similar to updateTour()
  // THIS IS FOR THIS LECTURE:Assigning the await to const tour
  const tour = await Tour.findByIdAndDelete(req.params.id);
  //Ends here

  // THIS IS FOR THIS LECTURE: Checking if not tour i.e if not null i.e "status": "success", "data": { "tour": null}".In javascript, null is a falsy value i.e a value that will convert
  // to false in an "if" statement
  if (!tour) {
    //Here if !tour, we will create our error message
    return next(new AppError('No tour found with that ID', 404)); //So this jumps straight to our error handling middlewarebcos ofthe next() as we said in prev lectures
    // we want to return this error immediately and not move on to the next line, which would be "res.status(200).json({})" below, which will then try to send two responses
  }
  //Ends here

  res.status(204).json({
    status: 'success',
    data: null, // The data is null to show that the data no longer exists
  });
});

//Calcg=> calculating

// AGRREGATION PIPELINE:
exports.getTourStats = catchAsync(async (req, res, next) => {
  //1) CREATING STATS
  // Using our Tour Model in order to access the tour collectn
  const stats = await Tour.aggregate([
    // Each of the stages is an object
    //A)
    {
      //match is basically to select or to filter docs. It is just like a filter object in MongoDB
      $match: {
        //Selecting docs with a ratingsAverage >= 4.5
        ratingsAverage: { $gte: 4.5 },
      },
    },

    //B)
    {
      $group: {
        //1) grouping by difficulty
        _id: { $toUpper: '$difficulty' },

        //2) Calcg the average
        //a)numIs actually the number of tours
        numTours: {
          $sum: 1, // we are adding 1 for each docs, thats how it works. So basically for each of the
          // doc that is gonna go thru the pipeline, 1 will be added to this numTours counter.
        },

        //b) numRatings:We the sum of the ratingsQuantity
        numRatings: { $sum: '$ratingsQuantity' },

        //c) avgRating
        avgRating: {
          //$avg this is a MongoDB operator
          $avg: '$ratingsAverage', // "ratingsAverage" is how we have it in our schema i.e tourModel
        },

        //d) avgPrice
        avgPrice: { $avg: '$price' },

        //e) minPrice
        minPrice: { $min: '$price' },

        //f) maxPrice
        maxPrice: { $max: '$price' },
      },
    },

    //C) After a grp stage, we want a sort stage
    {
      $sort: { avgPrice: 1 }, // 1 signifies ascending while -1 repts descending
    },
  ]);

  //2) SENDING THE STATS
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
///
// So let's start by creating the fc:
// To test this in Postman we use this "127.0.0.1:3000/api/v1/tours/monthly-plan/:year (we can use year=2021)
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  //1)Defining the year variable
  const year = req.params.year * 1; // To convert to number
  //2) Defining th plan variable
  const plan = await Tour.aggregate([
    //a)
    {
      $unwind: '$startDates',
    },

    //b)Selecting the docs for the yr that was passed in. And we use the "$match" stage for this
    {
      // The year is in the startDates, so we will search for startDates
      $match: {
        // So we want the startDate to be in btw yr 2021 and 2022
        startDates: {
          // So this will be compared with the dates that is in each of the docs
          $gte: new Date(`${year}-01-01`), //we want our date to be >= jan 1, 2021 and
          $lte: new Date(`${year}-12-31`), //we want our date to be <= Dec 12, 2021(last day of that same year)
        },
      },
    },

    //c) Grp stage
    {
      $group: {
        //We want to grp by the month, but we have the entire date. From the documentatn,we can use $month to get the month
        _id: { $month: '$startDates' }, // This must be the first bcos it is what we use in grpg docs

        numTourStarts: { $sum: 1 },

        tours: { $push: '$name' },
      },
    },

    //d) Now let's add the month fields to those that pass the grpg above. This is actually changing the "$_id"
    // to month
    {
      $addFields: { month: '$_id' },
    },

    //e) Next let's get rid of "_id", bcos from our result, the month is actually the same as the id.
    // For this we use "$project"
    {
      $project: {
        _id: 0,
      },
    },

    //f) Now we need to  sort by the numTourStarts.
    {
      $sort: { numTourStarts: -1 }, // This is sorting in descending order
    },

    //g) Let me just show u one last stage here. It's not really helpful here but i just want to show u.
    {
      $limit: 12,
    },
  ]);
  //3) sending the result
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
