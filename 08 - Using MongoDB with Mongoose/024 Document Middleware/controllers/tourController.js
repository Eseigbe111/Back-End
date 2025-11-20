//NB // JONAS used " // query = query.sort('-createdAt');" for the sorting but it did not work for me when i needed it for //E) MAKING BETTER PAGINATN.
// So chatgpt helped me and said it was better to use  query = query.sort('_id'); rather than query = query.sort('-createdAt'); and it worked.

//Importing the Tour from tourModel
const Tour = require('./../models/tourModel'); // "./"=> current folder, "../"=>Go up 1 folder


//Importing apsFeatures.js as a module
//1) BUILDING A QUERY
const APIFeatures = require('./../utils/apiFeatures');

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
//Calcg=> calculating

// AGRREGATION PIPELINE:
// After creating the above fc, we will go to the tourRoute to create a route for this.
// To test this, we will send this in our Postman app "127.0.0.1:3000/api/v1/tours/tour-stats"
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
        //This is just like the above, I just want to grp it using "difficulty" and others as i said that we can grp with
        // any ppt. So i want to show u that it works actually, so i will comment the original and do the below:
        $group: {
          //1) grouping by difficulty
          //_id: null,
          // _id: '$difficulty',
          // _id: '$ratingsAverage',
          //We can try anything for e.glet's convert
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
        //Here in the sort, we actually use the names specified in the grp and not the old name,
        // bcos at this pt they are already gone. They no longer exist.
        $sort: { avgPrice: 1 }, // 1 signifies ascending while -1 repts descending
      },

      //D) We can also repeat stages, so let's do another match stage

      {
        $match: { _id: { $ne: 'EASY' } }, //"ne":means not easy. Like this, we will select docs that are not easy
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
// After creating the above fc, we will go to the tourRoute to create a route for this.
// To test this, we will send this in our Postman app "127.0.0.1:3000/api/v1/tours/tour-stats"

// el=> element

// So let's imagine that we are really building this application for the "natours" company. And so let's say that they ask
// us to implement a fc to calc the busiest month of a given year. So basically calculating how many tours start in each of
// the month of the given year. Andthe company really needs this fc to prepare accordingly for these tours, like to hire
// tour guides or buy the equipt and handle all the stuff like that. And so this is a real business prob that we can solve
// using the aggregation pipelines.

// So let's start by creating the fc:
// To test this in Postman we use this "127.0.0.1:3000/api/v1/tours/monthly-plan/:year (we can use year=2021)
exports.getMonthlyPlan = async (req, res) => {
  try {
    //1)Defining the year variable
    const year = req.params.year * 1; // To convert to number
    //2) Defining th plan variable
    // To define variables, lets go to Postman to analyze our all tours data. So u can see that each tour has "startDates". So
    // these dates is what we actually need as a starting pt to create this fc or to create the this aggregatn pipline below.
    // Bcos remember, we want to count how many tours there are for each of the months in a given year. To be able to add these
    // tours in a year, the easiest way would be basically be to have 1 tour for each of the dates in the "startDates" array.
    // There is actually a stage for doing exactly that, which is called "unwind"
    const plan = await Tour.aggregate([
      //a)
      {
        // So what unwind will do is to basically desconstruct an array field from the input docs and
        // then output one doc for each element of the array. That's what i was saying b4, that we want to have 1 tour for each of
        // these dates in the array.
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

          // The information we want for each of the month is how many tours start in that month.
          // And for that all we can do is to count the amount oftours that have a certain month.
          numTourStarts: { $sum: 1 },

          // We also want know which tours have the above dates i.e the name. So what we can do is to create an array
          // bcos thats how we can specify 2 or 3 difft tours in one field, and to do this, we use the "$push":
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
        // So project works by giving each of the field names 0 or a 1. Giving a field 0, means it will not
        // show up, but a 1 means it will show up
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
        //This one is just the same as the limit in the query. So basically it is gonna allow the number of
        // of docs that is allowed when specified
        // $limit: 6, // This will allow us have just 6 docs i.e 6 outputs. Initially we had more than
        // 6, but with the limit set to 6, we will only have 6 displayed when we send a request again.
        //But lets set it to 12.
        $limit: 12,
      },

      // I put so many stages here in our e.g so u can see that we can do anything and also, that we have
      // dift mthds in mongoose. So aside from all the work we do here, it is very essential to read the
      // documentatn as u will be able to do more than what we have done and make u really good.
      // And from the starting pts u get from these videos, it will be easier to understand the documentatns
      //of whatsoever we use here and more
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
