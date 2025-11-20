// IMporting tourModel
const Tour = require('../models/tourModel');

// Importing APIFeatures
const APIFeatures = require('../utils/apiFeatures');

// MAKING API BETTER ALIASING: We will use GET "127.0.0.1:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price"
/// Middleware Handler for the top-5-cheap tours
exports.aliasTopTours = (req, res, next) => {
  // We are manipulating the req.query obj bcos of this part
  req.query.limit = 5; // since we are talking about 5 tours
  req.query.sort = '-ratingsAverage'; // We want to sort them by these two
  // console.log(req.query.limit, req.query.sort);

  next();
};

// DEFINING OUR HANDLER FCs
//a) Doing a get(): THis currently reads from our Local file
// Handler for getting all Tours
exports.getAllTours = async (req, res, next) => {
  // console.log(new APIFeatures(Tour.find(), req.query));
  try {
    // EXECUTE QUERY: Unlike Jonas own, we are awaiting bcos our paginate() is an async fc which is due to the fact
    // that we wanted the error message if a page that does not exist is clicked
    const features = await new APIFeatures(Tour.find(), req.query, Tour)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //Getting all the tours
    const tours = await features.query;

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
exports.getTour = async (req, res, next) => {
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
exports.createTour = async (req, res, next) => {
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

exports.updateTour = async (req, res, next) => {
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
exports.deleteTour = async (req, res, next) => {
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

// AGGREGATION PIPELINE MATCHING AND GROUPING: We used GET 127.0.0.1:3000/api/v1/tours/tour-stats
// This is used to filter documents with $match and then group them by a specific field using $group for data analysis.
// For our case, I am going to create a fc here, that is going to calc sm statistics about our tours
exports.getTourStats = async (req, res, next) => {
  try {
    // console.log(req.query);
    // 1)Creating Stats
    const stats = await Tour.aggregate([
      // A)
      {
        //match is basically to select or to filter docs. It is just like a filter object in MongoDB
        $match: {
          //Selecting docs with a ratingsAverage >= 4.5
          ratingsAverage: { $gte: 4.5 },
        },
      },

      // B)
      {
        // The $group stage in MongoDB’s aggregation pipeline groups documents that have the same value for a specified
        // field and then performs operations (like sum, count, average, etc.) on each group.
        $group: {
          // 1)
          // Now we can grp like this using the id:
          // _id: '$difficulty', // This means group by difficulty
          // _id: '$ratingsAverage', // This means grp by ratingsAverage
          // _id: null, // Means don’t group by any specific field — instead, treat all documents as one single group.
          _id: { $toUpper: '$difficulty' }, // This means group by difficulty

          // 2)
          numTours: {
            $sum: 1, // Counts how many documents are in that group (because you add 1 for every document).
          },

          // 3)
          numRatings: { $sum: '$ratingsQuantity' }, //Adds up all the ratingsQuantity values for each group

          // 4)
          avgRating: {
            $avg: '$ratingsAverage', //Averages up all the ratingsAverage values for each group
          },

          // 5)
          avgPrice: {
            $avg: '$price', // Averages up all the price values for each group
          },

          // 6)
          minPrice: {
            $min: '$price', // finds the smallest (minimum) value of a field within each group i.e price
          },

          // 7)
          maxPrice: {
            $max: '$price', // finds the smallest (maximum) value of a field within each group i.e price
          },
        },
      },

      // C)
      {
        $sort: { avgPrice: -1 }, // 1 Means to sort by ascending order while -1 is descending order
      },

      // D) We can do another match process after every step above
      // {
      //   $match: { _id: { $ne: 'EASY' } }, // "ne":means not equall to easy. Like this, we will select docs that are not easy
      // },
    ]);

    res.status(200).json({
      status: 'success',
      results: stats.length,
      data: {
        stats,
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

// AGGREGATION PIPELINE UNWINDING AND PROJECTING: We send GET "127.0.0.1:3000/api/v1/tours/monthly-plan/:year
// $unwind — Deconstructs arrays into individual documents
// If a field contains an array, $unwind will split that array so that each element becomes its own document.
// $project — Selects and reshapes fields
// $project lets you choose which fields to include, exclude, or transform in the output.
// Think of it as: “Control exactly what each document looks like after this stage.”

// PROBLEM STATEMENT:
// Imagine we're building this app for the "Natours" company.
// The company wants a function that calculates the busiest month in a given year —
// specifically, how many tours start in each month of that year.
// This information helps them plan ahead: hiring tour guides, purchasing equipment,
// and preparing logistics for high-demand periods.
// It’s a real-world business problem that we can solve efficiently using MongoDB’s aggregation pipeline.
exports.getMonthlyPlan = async (req, res, next) => {
  try {
    //1)Defining the year variable
    const year = req.params.year * 1;

    //2) Defining the plan variable
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates', // This deconstructs startDates array — meaning it creates one document per start date.
      },

      //3)Selecting the docs for the yr that was passed in. And we use the "$match" stage for this
      {
        // The year is in the startDates, so we will search for startDates
        $match: {
          // So we want the startDate to be in btw yr 2021 and 2022
          startDates: {
            // So this will be compared with the dates that is in each of the docs
            $gte: new Date(`${year}-01-01`), // we want our date to be >= jan 1, 2021 and
            $lte: new Date(`${year}-12-31`), // we want our date to be <= Dec 12, 2021(last day of that same year)
          },
        },
      },

      // 4) Grp Stage
      {
        $group: {
          //We want to grp by the month, but we have the entire date. From the documentatn,we can use $month to get the month
          _id: { $month: '$startDates' },

          // The information we want for each of the month is how many tours start in that month.
          // And for that all we can do is to count the amount of tours that have a certain month.
          numTourStarts: { $sum: 1 },

          // We also want know which tours have the above dates i.e the name. So what we can do is to create an array
          // bcos thats how we can specify 2 or 3 difft tours in one field, and to do this, we use the "$push":
          tours: { $push: '$name' },
        },
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

      //f) Now we need to sort by the numTourStarts.
      {
        $sort: { numTourStarts: -1 }, // This is sorting in descending order
      },

      // g) Let me show u one last stage although,its not very helpful here
      // $limit - tells MongoDB to return only the first N documents from the pipeline output.
      // In your case, { $limit: 12 } means only the first 12 documents that come out of the previous
      // stage will be kept — all others are discarded.
      // {
      //   $limit: 12,
      // },
    ]);

    //
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
      message: err.message,
    });
  }
};
