//NB // JONAS used " // query = query.sort('-createdAt');" for the sorting but it did not work for me when i needed it for //E) MAKING BETTER PAGINATN.
// So chatgpt helped me and said it was better to use  query = query.sort('_id'); rather than query = query.sort('-createdAt'); and it worked.

// THIS IS FOR THIS LECTURE:
// In this video and the next one, I want to introduce u to the MongoDb and the pipeline which is an extremely powerful and extremely useful MongoDb framework
// for data aggregation.
// And the idea is that we basically define a pipeline that all the docs from a certain collectn go thru where they are processed step by step in order to
// transform them into aggregated results. For e.g we can use the aggregation pipeline in order to calculate averages or calculating  max and min values, we
// can calculate distances even and we can really do all kinds of stuff. It's really amazing how powerful this aggregation pipeline is.

/////

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

// THIS IS FOR THIS LECTURE: AGRREGATION PIPELINE.
// Now if u ever need any thing u can easily come to the documentatn of the MongoDB to find dift mthds that u can use

// Now the idea is that we basically define a pipeline that all the docs from a certain collectn go thru where they are processed step by step in order to
// transform them into aggregated results. For e.g we can use the aggregation pipeline in order to calculate averages or calculating  max and min values, we
// can calculate distances even and we can really do all kinds of stuff. It's really amazing how powerful this aggregation pipeline is.
// I am going to create a fc here, that is going to calc sm statistics about our tours.
// The aggregatn pipeline is really a MongoDB feature. But mongoose of course gives us access to it, so that we can use it in the Mongoose driver.

// After creating the below fc, we will go to the tourRoute to create a route for this.
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
        // "$group" here is where all the magic happens as it allows us to group docs together basically using even calculating
        // an average. So if we have 5 tours and each of them have a rating, we can calc the average rating using "$group". And
        //let's do that here
        //   $group: {
        //     //1) the 1st thing to always specify is the "id" bcos this is where we are gonna specify what we want to group by.
        //     _id: null, // For now our "id" will be "null" bcos we want to have everything in one grp so that we can calc the
        //     // statistics for all of the tours together and not separate it by groups.Now we can grp by dift stuffs e.g name
        //     // or difficulty etc and then calc for e.g the average for the easy tour, the aveage for the medium tours, and the
        //     // average for the difficult tours. Again we can grp with one of our fields, but that field will be specified where
        //     // the id is now i.e the 1st ppt

        //     //2) Calcg the average
        //     //a)numIs actually the number of tours
        //     numTours: {
        //       $sum: 1, // we are adding 1 for each docs, thats how it works. So basically for each of the
        //       // doc that is gonna go thru the pipeline, 1 will be added to this numTours counter.
        //     },

        //     //b) numRatings:We the sum of the ratingsQuantity
        //     numRatings: { $sum: '$ratingsQuantity' },

        //     //c) avgRating
        //     avgRating: {
        //       //$avg this is a MongoDB operator
        //       $avg: '$ratingsAverage', // "ratingsAverage" is how we have it in our schema i.e tourModel
        //     },

        //     //d) avgPrice
        //     avgPrice: { $avg: '$price' },

        //     //e) minPrice
        //     minPrice: { $min: '$price' },

        //     //f) maxPrice
        //     maxPrice: { $max: '$price' },
        //   },
        // },

        //This is just like the above, I just want to grp it using "difficulty" and others as i said that we can grp with
        // any ppt. So i want to show u that it works actually, so i will comment the original and do the below:
        $group: {
          //1) grouping by difficulty
          // _id: '$difficulty',
          // _id: '$ratingsAverage',
          //We can try anything for e.g let's convert
          _id: { $toUpper: '$difficulty' },

          //2) Calcg the average
          //a)numTours Is actually the number of tours
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
        $match: { _id: { $ne: 'EASY' } }, //"ne":means not equall to easy. Like this, we will select docs that are not easy
      },
    ]); // Using "aggregate()" is just like doing a regular query. Th diff is that in aggregatns, we can manipulate
    // the data in a couple of dift steps. And so let's define these steps. And for that we will pass in an array of so-called stages. Inside the
    // array we will have a lot of stages. And again the docs then pass thru these stages one by one, step by step in the defined sequence as we
    // define it in the array. Each element in the array will be the stages. And there are a ton of difft stages that we can choose from, but i
    // will just show u the most common ones in this lecture and the next one.

    //2) SENDING THE STATS
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// After creating the above fc, we will go to the tourRoute to create a route for this.
// To test this, we will send this in our Postman app "127.0.0.1:3000/api/v1/tours/tour-stats"

//Ends here
