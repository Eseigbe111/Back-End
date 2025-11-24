// Importing mongoose
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// So Mongoose is all about models, and a model is like a blueprint that we use to create docs
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //The 2nd parameter is an error message if a name is not entered
      unique: true, // means names should be the same
      trim: true,

      // In Mongoose, maxlength and minlength are string validators used to limit the number of characters in a field.
      //  maxlength sets the maximum allowed length for a string.
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],

      // minlength sets the minimum required length.
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      // If the input violates these limits, Mongoose throws a validation error with the provided message.
      // These validators also work during updates only if runValidators: true is set in the update method.
    },

    slug: String,

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],

      // Here i want to limit or restrict the difficulty to just 3, Difficult, Medium and Easy.
      // The validator for that is "enum".
      enum: {
        values: ['easy', 'medium', 'difficult'], //Passing an array of the values that are allowed
        message: 'Difficulty is either: easy, medium, difficult', // This is the error message we want when none of the above is inputted
      },
      //We also test this with the "Create New Tour" and experiment around it
    },

    ratingsAverage: {
      type: Number,
      default: 4.5, // So when nothing is inputted, we use 4.5 as default

      // VALIDATORS FOR NUMBERS: Test this using the "Create New Tour" and vary the ratingsAvarage
      //a)min
      min: [1, 'Rating must be above 1.0'], // 1st is rating, 2nd is the  error message

      //b)max: This ma will also work for dates
      max: [5, 'Rating must be below 5.0'],
    },

    ratingsQuantity: {
      type: Number,
      default: 0, // At the beginning there won't be any rating when the tour is new
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    // CUSTOM VALIDATORS
    // When Mongoose’s built-in validators aren’t enough, we can create custom validators using the validate property.
    // A validator is simply a function that returns true if the value is valid or false if it isn’t.
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price; // So if priceDiscount =100 and price =200. There will be no error. But if it is the other way
          // round, i.e false, it will trigger a VALIDATN error
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
        // The error message we want to display and can also have access to the val in "VALUE" ppt
      },
    },

    summary: {
      type: String,
      trim: true, // This only works for string, which removes all the whitespaces in the beginnig and in the end of the string
      required: [true, 'A tour must have a description'],
    },

    description: {
      type: String,
      trim: true,
    },

    //Image cover is the image u see on the overview page
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },

    // we want the images to be an array of strings so we can do [String]
    images: [String], // So here it is a string and also an array

    // This a time added automatically as a user creates a tour
    createdAt: {
      type: Date,
      default: Date.now, // This will give us a timestamp in millisecs. In mongo,
      // this is converted to the real date so that it wil more sense
    },

    startDates: [Date], // These are the days in which a tour starts

    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  // The below code is needed for any virtual ppt to work
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual Properties in Mongoose:
tourSchema.virtual('durationWeeks').get(function () {
  // 'durationWeeks' is the name of the virtual property
  return this.duration / 7; //this refers to the current document
  //converting the tour duration from days to weeks
});

// 1) pre('save') middleware runs before the document is saved and gets access to the next()
// Has access to only next(). To test this we need to create a new Tour in postman
// Test this using POST http://127.0.0.1:3000/api/v1/tours
tourSchema.pre('save', function (next) {
  // console.log(this); // Unsaved document (in memory) and so we will not see anything
  this.slug = slugify(this.name, { lower: true });
  /* 
  Add this above to the tourModel
  slug: String,
  */
  console.log('Trying to save document....');
  next();
});

tourSchema.pre('save', function (next) {
  console.log('Will save document....');
  next();
});

// 2) post('save') middleware runs after the document has been saved. This has access to the next(), and also
// to the doc that was was just saved to the database and Has access to the currecnt doc saved and next()
tourSchema.post('save', function (doc, next) {
  // console.log(doc);
  next();
});

// B) QUERY MIDDLEWARE
// Query middleware runs before or after query methods like .find(), .findOne(), .findById(), .updateOne(), etc.
//1) PRE
// In pre middleware, this refers to the query object (not the document). They are Used to filter, modify, or
// restrict queries automatically (e.g., hiding secret data).
tourSchema.pre(/^find/, function (next) {
  // /^find/ regex makes it run for all “find-like” methods (find, findOne, findById, etc.). And so it is
  // not a good parctice to do pre('findOne'), pre('findById') and so on ....
  this.find({ secretTour: { $ne: true } }); // excludes secret tours

  // Setting a clock to see how long it takes to execute the current query
  this.start = Date.now();
  next();
});

// 2) POST
// Post middleware runs after the query executes and gives access to the result documents:
tourSchema.post(/^find/, function (doc, next) {
  // To get the time this query took tobe executed, we subtract the start time current time i.e "this.start
  console.log(`Query took ${Date.now() - this.start} milliseconds`); // This will be seen on the vsc terminal
  // console.log(doc.length);
  // console.log(doc); //gives final docs excluding the secret tour
  next();
});

//C) AGGREGATION MIDDLEWARE:
tourSchema.pre('aggregate', function (next) {
  // "this" here refers to the current aggregation object
  // console.log(this); // Logs the aggregation pipeline array before execution
  console.log(this.pipeline()); //THis gives us the aggregation pipeline whichis simply the array that we passed into the
  // aggregate fc b4 i.e the one in our GetTourStats() inour tourController.

  // Add a new $match stage at the beginning of the pipeline
  // This filters out all documents where secretTour is true
  this.pipeline().unshift({
    // unshift() adds the match stage b4 any other stage inthe pipeline()
    $match: { secretTour: { $ne: true } }, // $ne means "not equal"
  });

  // So now, all aggregation queries will automatically exclude secret tours
  next(); // Move to the next middleware or execute the aggregation
});

// This line compiles the schema into a model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
