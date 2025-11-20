// IMporting tourModel
const Tour = require('../models/practicingInTourModel');
// THIS IS FOR THIS PART
const APIFeatures = require('../utils/apiFeatures');
// Ends here

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
// THIS IS FOR THIS LECTURE
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
// Ends here

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
      message: err,
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

/////////////////////////
// PRACTICING
// AGGREGATION PIPELINE MATCHING AND GROUPING
// Use this to test this fc :  127.0.0.1:3000/api/v1/tours/tour-stats

exports.getTourStats = async (req, res, next) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },

      {
        $group: {
          _id: '$difficulty',

          numTours: { $sum: 1 }, // THis will count the number of tours in each group of difficulty

          avgRatingsQty: { $avg: '$ratingsQuantity' },

          avgRatings: { $avg: '$ratingsAverage' },

          sumUnder1000: {
            $sum: {
              $cond: [{ $lt: ['$price', 1000] }, '$price', 0],
              // $lt: ["$price", 1000] → checks if the price is less than 1000
              // "$price" → adds the price to the sum if the condition is true
              // 0 → adds 0 if the condition is false
            },
          },

          sumAbove1000: {
            $sum: {
              $cond: [{ $gte: ['$price', 1000] }, '$price', 0],
              // $gte: ["$price", 1000] → checks if the price is greater than or equal to 1000
              // "$price" → adds the price to the sum if the condition is true
              // 0 → adds 0 if the condition is false
            },
          },

          tourNames: { $push: '$name' }, // THis will give the names of the tours in an array
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: stats.length,
      data: {
        stats,
      },
    });
    ///
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
      error: err,
    });
  }
};

// Use this to test this fc :  127.0.0.1:3000/api/v1/tours/tour-stats1
exports.getTourStats1 = async (req, res, next) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },

      {
        $group: {
          _id: '$difficulty',
          // Tours under price 1000
          toursUnderprice1000: {
            $push: {
              $cond: [
                { $lt: ['$price', 1000] }, // condition tht we want price below 1000
                '$name', // value if true (push tour name)
                '$$REMOVE', // value if false (don’t include)
              ],
            },
          },

          // Tours and price that are under 1000
          toursAndpriceUnder1000: {
            $push: {
              $cond: [
                { $lt: ['$price', 1000] }, // Condition
                { name: '$name', price: '$price', imageCover: '$imageCover' }, // value if true (push tour name, price and imageCover)
                '$$REMOVE', // value if false (don’t include)
              ],
            },
          },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: stats.length,
      data: {
        stats,
      },
    });
    ///
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
      error: err,
    });
  }
};

// Use this to test this fc : 127.0.0.1:3000/api/v1/tours/tour-stats2
exports.getTourStats2 = async (req, res, next) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },

      {
        $group: {
          _id: '$difficulty',

          // Tours above price 1000
          toursAboveprice1000: {
            $push: {
              $cond: [
                { $gte: ['$price', 1000] },
                '$name', // value if true (push tur name)
                '$$REMOVE', // value if false (don’t include)
              ],
            },
          },

          // Tours and price that are above 1000
          toursAndpriceAbove1000: {
            $push: {
              $cond: [
                { $gte: ['$price', 1000] },
                { name: '$name', price: '$price', imageCover: '$imageCover' }, // value if true (push tour name, price and imageCover)
                '$$REMOVE', // value if false (don’t include)
              ],
            },
          },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: stats.length,
      data: {
        stats,
      },
    });
    ///
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
      error: err,
    });
  }
};
/////////////////////

// AGGREGATION PIPELINE UNWINDING AND PROJECTING
// PROBLEM STATEMENT:
// Imagine we're building this app for the "Natours" company.
// The company wants a function that calculates the busiest month in a given year —
// specifically, how many tours start in each month of that year.
// This information helps them plan ahead: hiring tour guides, purchasing equipment,
// and preparing logistics for high-demand periods.
// It’s a real-world business problem that we can solve efficiently using MongoDB’s aggregation pipeline.

// 👉 Try endpoint:
// Test using this 127.0.0.1:3000/api/v1/tours/monthly-plan/:year
exports.getMonthlyPlan = async (req, res, next) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates', // This deconstructs startDates array — meaning it creates one document per start date.
      },

      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      //
      {
        $group: {
          _id: { $month: '$startDates' }, // Groups all tours by the month number (1–12) extracted from each start date
          numTourStarts: { $sum: 1 },
          //numTourStarts: Counts how many tours start in that month : This means:
          /* 
          The aggregation pipeline looks at all the start dates of all tours in your database.
          Then, it checks which month each start date belongs to (January = 1, February = 2, etc.).
          For each month, it adds up (using $sum: 1) how many start dates fall in that month.
          */

          tours: { $push: '$name' }, //Collects the names of those tours into an array
        },
      },

      // Next let's get rid of "_id", bcos from our result, the month is actually the same as the id.
      // For this we use "$project"
      {
        // So project works by giving each of the field names 0 or a 1. Giving a field 0, means it will not
        // show up, but a 1 means it will show up
        $project: {
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: plan.length,
      data: {
        plan,
      },
    });
    //
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
      error: err,
    });
  }
};

// Exercise: Calculate the Most Profitable Month
// Problem Statement:
// The Natours company now wants to find the total revenue they made in each month of a given year, based on the price of each tour.
// They also want to know how many tours were run in that month and the average price.
// Each tour can have multiple start dates (startDates array), and for every start date, the company earns the tour’s full price.

//Your Task:
// Write an aggregation pipeline that returns the following fields for each month:
// Field      	  Description
// month	        The month number (1–12)
// numTours	      Total number of tours that started in that month
// totalRevenue	  Sum of all tour prices for that month
// avgPrice	      Average price of tours for that month
// tours	        Array of tour names for that month

// Hint:
// You’ll still use:
// $unwind (for startDates)
// $match (to filter by the given year)
// $group (to sum up totals)
// $project (to clean up fields, e.g., rename _id to month)

// 👉 Try endpoint:
// We use GET 127.0.0.1:3000/api/v1/tours/monthly-revenue/:year for testing
exports.getMonthlyRevenue = async (req, res, next) => {
  try {
    const year = req.params.year * 1;

    const revenue = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },

      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      // Listing the parts we want to see
      {
        $group: {
          _id: { $month: '$startDates' }, // Groups all tours by the month number (1–12) extracted from each start date

          numOfToursThatStartsInAMonth: {
            $sum: 1,
          },

          // total revenue for that month
          sumTourPrice: {
            $sum: '$price',
          },

          avgPrice: {
            $avg: '$price',
          },

          tours: {
            $push: '$name',
          },
        },
      },

      //Renaming or removing parts we dont want to see. 1 in project means that part should be included
      // and 0 means it should not be included.
      {
        $project: {
          _id: 0, //Removing the id
          month: '$_id', // Chnaging the _id to month
          numOfToursThatStartsInAMonth: 1, // We want to see all these fields, hence 1
          sumTourPrice: 1, // We want to see all these fields, hence 1
          avgPrice: { $round: ['$avgPrice', 2] }, // ✅ rounds to 2 decimal places
          tours: 1, // We want to see all these fields, hence 1
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: revenue.length,
      data: {
        revenue,
      },
    });
    //
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
      error: err,
    });
  }
};

// Exercise
// Problem Statement:
// Natours wants to know which tours made the most total revenue across all months.
// i.e the aggregation would calculate results for the entire lifetime of each tour, not just one year.

// You need to calculate, for each tour:
// Field	           Description
// name	             The name of the tour
// numStartDates	   How many times that tour ran (number of start dates)
// totalRevenue	     The total revenue from that tour (sum of all start dates × price)
// avgRevenue	       The average revenue per start date (total / number of start dates)

// Hint:
// You’ll use:
// $unwind → to separate each start date
// $group → by tour name
// $project → to clean up output

// 👉 Try endpoint:
// GET 127.0.0.1:3000/api/v1/tours/top-earning-tours
exports.getTopEarners = async (req, res, next) => {
  try {
    const topEarners = await Tour.aggregate([
      {
        $unwind: '$startDates', //Dividing them to arrays
      },

      {
        $group: {
          _id: '$name', // We start grpg by "name"

          numStartDates: { $sum: 1 }, //Num of times that tour ran (number of start dates)

          totalRevenue: { $sum: '$price' }, // adds up price for every startDate

          avgRevenue: { $avg: '$price' },
        },
      },

      {
        $project: {
          _id: 0,
          name: '$_id',
          numStartDates: 1,
          totalRevenue: 1,
          avgRevenue: 1,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: topEarners.length,
      data: {
        topEarners,
      },
    });
    //
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
      error: err,
    });
  }
};

// Exercise: Revenue by Difficulty Level
// Problem Statement:
// The Natours company now wants to understand which difficulty level (“easy”, “medium”, “difficult”) brings in the most money overall.
// Each tour belongs to one difficulty level and has multiple startDates.
// For every startDate, the company earns the tour’s full price.

// Your task is to calculate, for each difficulty level, the following:
// Field	            Description
// difficulty	        The tour difficulty level
// numTours	          How many unique tours exist in that difficulty level
// numStartDates	    Total number of start dates (all tours combined)
// totalRevenue	      Total revenue from all tours of that difficulty level
// avgTourPrice	      Average price of tours in that difficulty level

// Hints:
// Use $unwind on startDates (each start date = one earning instance).
// Group by difficulty (_id: '$difficulty').
// You’ll need both $sum and $avg.
// $addToSet: '$name' can help count unique tours (since some tours have multiple start dates).
// Use $project to clean up output and rename _id → difficulty.

// 👉 Try endpoint:
// GET 127.0.0.1:3000/api/v1/tours/revenue-by-difficulty
exports.RevenueByDifficulty = async (req, res, next) => {
  try {
    const difficultyRevenue = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },

      {
        $group: {
          _id: '$difficulty',

          uniqueTours: { $addToSet: '$name' }, // unique tours in each difficulty

          numStartDates: { $sum: 1 }, // Total number of start dates (all tours combined)

          totalRevenue: { $sum: '$price' }, // By difficulty

          avgTourPrice: { $avg: '$price' }, // By difficulty

          tours: { $push: '$name' },
        },
      },

      {
        $project: {
          _id: 0,
          difficulty: '$_id',
          uniqueTours: 1,
          numTours: { $size: '$uniqueTours' }, // count unique tours
          numStartDates: 1, // We use 1 so we can see them
          totalRevenue: 1, // We use 1 so we can see them
          avgTourPrice: { $round: ['$avgTourPrice', 2] }, // ✅ rounds to 2 decimal places
          tours: 1, // We use 1 so we can see them
        },
      },

      {
        $sort: { totalRevenue: -1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: difficultyRevenue.length,
      data: {
        difficultyRevenue,
      },
    });
    //
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
      error: err,
    });
  }
};
