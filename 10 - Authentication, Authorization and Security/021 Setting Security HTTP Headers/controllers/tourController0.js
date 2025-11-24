// This contains the code b4 we used catchAsync for all the handler fcs

//NB // JONAS used " // query = query.sort('-createdAt');" for the sorting but it did not work for me when i needed it for //E) MAKING BETTER PAGINATN.
// So chatgpt helped me and said it was better to use  query = query.sort('_id'); rather than query = query.sort('-createdAt'); and it worked.

//Importing the Tour from tourModel
const Tour = require('./../models/tourModel'); // "./"=> current folder, "../"=>Go up 1 folder

//Importing apsFeatures.js as a module
//BUILDING A QUERY
const APIFeatures = require('./../utils/apiFeatures');

// Importing catchAsync.js: As we imported this, we will then wrap all the the handler fcs in "catchAsync()" and eliminate catch blocks
const catchAsync = require('./../utils/catchAsync');

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
exports.getAllTours = async (req, res) => {
  try {
    //2) EXECUTE THE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
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

// THIS IS FOR THIS LECTURE
// In this lecture, let's implement a better way of catching errors in all our async fcs.
// So right now, in all our async fcs, we have these try catch blocks bcos they are all async fcs and that's how we catch the errors inside a
// asynchronous fc. Now that really makes our code look messy and unfocused, so the goal of the createTour() here for e.g is just to run the
// code that creates tour and we actually do not want to mess with error handling. Also, we have a lot of duplicate code here bcos in each of
// these handlers below, we have quite a similar catch block. we are sending an error response, and these are not even to be handled here but
// instead in our global error handling middleware.
// For now  these "trycatch" block inside our handlers are not ideal and so let's now try to fix that. And the soln is to basically take the
// 'trycatch' block out of the handlers and put it on a higher level in another fc. So basically what we're gonna do is to create a fc, and
// then wrap this async fc into that fc. So i will call the fc we want to create "catchAsync()"

// All the handler fcs here are to have the next() bcos we need it to be able to pass the error into it as we learned in prev lectures. So that
// the error can then be handled in the globalErrorHandling()  middleware we created not too  long.
// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     // fn(req, res, next).catch((err) => next(err));
//     // we can actually write the above like this:
//     fn(req, res, next).catch(next); // So this catch() will pass the error into the next() which will then make it so that our error ends up in our
//     // globalErrorHandling middleware. This line of code is what allows us to easily get rid of the catch block.

//     //If we now create a new tour and sm error happens, for e.g from an invalid input, then tge error should of course be catched here in this catch(),
//     // and will then be propagated to our error handling middleware and so that one will then send back the error response that we're expected to
//     // receive. So lets' try that out by creating a new tour in Postman and exluding one of the required field
//   };
// };
/// So the fc that we passed into the async fc i.e "fn" is an ansynchronous fc. And remember that asynchronous fcs return promises, and when there
// is an error inside an async fc, that basically means that the promise gets rejected. And up here "const catchAsync = (fn) => {}" where we actually
// call that fc, we can then catch that error i.e "fn(req, res, next).catch(){}" instead of catching it in the 'trycatch' block

//THe above commented const catchAsync() is moved to a new file "catchAsync.js" in the utils folder

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

//smo=>someone
/* 
Now there are actually two big probs with the way that the code below is implemented now, and so this way it won't really work at all.

const catchAsync = (fn) => {
  fn(req, res, next).catch((err) => next(err));
  
  exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  // while 201 stands for created and 200 stands for success
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});
};

1) The fc call i.e "fn(req, res, next)" has no way of knowing "req, res, and next". We didnot pass them into the "catchAsync()"  and s really there's 
no way for the fc to know the value of these parameters. AND

2) We are actually calling the async fc i.e we have "catchAsync(async (req, res, next) => {}))" and we are then calling it using the parenthesis i.e ()
// And inside of the "catchAsync()" we are also then right away calling the fn() i.e "fn(req, res, next)", and that's not how it is supposed to work.
// So createTour() should really be a fc, but not the result of calling a fc. But thatt's what is happening right now. So right now "catchAsync()" is 
// being called, which then calls "fn()". So "fn()" should not be called, but instead it should sit and wait until Express calls it. And Express will
// of course call it as soon a s smo hits the route that needs this control fc.

// And so the soln to the above is to basically make the "catchAsync()" return another fc which is then gonna be assigned to createTour() and so that fc
// can then later be called when necessary.

// So we can correct this by doing:
const catchAsync = (fn) => {
  return((req, res, next)=>{
    fn(req, res, next).catch((err) => next(err));
  })
};
*/

// Ends here
//
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
//Calcg=> calculating

// AGRREGATION PIPELINE:
exports.getTourStats = async (req, res) => {
  try {
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
    //
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
///
// So let's start by creating the fc:
// To test this in Postman we use this "127.0.0.1:3000/api/v1/tours/monthly-plan/:year (we can use year=2021)
exports.getMonthlyPlan = async (req, res) => {
  try {
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
    //
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
// To test this in Postman we use this "127.0.0.1:3000/api/v1/tours/monthly-plan/2025

//
