/// B4 Starting this lecture, delete all tours that werecreated prior to this lecture that were for testing and examples.

//Importing mongoose
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// devprs=> developers

// creating a very small schema for our tours:
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
      required: [true, 'A tour must have a name'], // Passing an error string we want to be displayed whe we are missing this field
      unique: true, // This means we can't have two tour docs with the same name
      trim: true, // This only works for string, which removes all the whitespaces in the beginnig and in the end of the string

      //VALIDATORS FOR STRINGS
      // The "maxlength" and "minlength" validators are just for Strings.
      //a) maxlenght:As the name implies, we use this to specify the max length that a string can have. And if its longer than that, its going
      // to produce an error. As we did for the required field, we specifyin an array the "length" we want and then the "error message"
      maxlength: [
        40,
        'A tour name must have less or equal than 40 characters ',
      ],
      //b)minlength: we use this to specify the min length that a string can have.
      minlength: [
        10,
        'A tour name must have more or equal than 10 characters ',
      ],

      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },

    slug: String,

    duration: {
      type: Number,
      required: [true, 'A tour mush have a duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],

      //VALIDATORS FOR STRING
      enum: {
        values: ['easy', 'medium', 'difficult'], //Passing an array of the values that are allowed
        message: 'Difficulty is either: easy, medium, difficult', // This is the error message we want when none of the above is inputted
      },

      //We also test this with the "Create New Tour" and experiment around it
    },

    ratingsAverage: {
      type: Number,
      default: 4.5, // So here if we create a new tour doc using this schema and not specifying the rating, it will then automatically
      // be set to 4.5.

      //nos.= numbers
      // VALIDATORS FOR NOS.
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
      required: [true, 'A tour must have a price'], // Passing an error string we want to be displayed whe we are missing this field
    },

    //  DATA VALIDATN CUSTOM VALIDATORS
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // Remember we return true or false depending the conditn.
          // Now we want an error, when the priceDiscount is >= the price
          return val < this.price; // So if priceDiscount =100 and price =200. There will be no error. But if it is the other way
          // round, i.e false, it will trigger a VALIDATN error
        },
        message: 'Discount price ({VALUE}) should be below the regular price ',
        // The error message we want to display and can also have access to the val in "VALUE" ppt
      },
      // So we test this using the "Create New Tour" again. we will use all the possible case scenarios to create errors and
      // also do the one for the correct vals.
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
      default: Date.now(), // This will give us a timestamp in millisecs. In mongo,
      // this is converted to the real date so that it wil more sense
      select: false, // Making the createdAt not to be seen by the user.
    },

    startDates: [Date], //Also an array of dates a tour starts. Mongo does not automatically
    // convert this.

    secretTour: {
      type: Boolean,
      default: false, // We set this to false bcos we do not want it to show
    },
  },

  {
    // The below means each time the data is outputed as JSON, we want virtuals to be true i.e to be
    // part of the output
    toJSON: { virtuals: true },
    // The below is when the data is outputed as an object
    toObject: { virtuals: true },
  },
);

//1)Defining the virtual ppts on the tourSchema
//durationWeeks is the name of the virtual ppt
tourSchema.virtual('durationWeeks').get(function () {
  // this is how we calc the duratn in weeks
  return this.duration / 7; // The duratn is in days. 7 is bcos there are 7days in a week.
  //"this" is going to pt to the current doc
  ///
});
//NB One thing to keep in mind is that u cannot use this virtual ppt 'durationWeeks' in a query bcos they are technically not part of the
// database. So we cannot say, for e.g "Tour.find({'durationWeeks: 1})".

////
//1) DOC MIDDLEWARE:
//a) .pre : This middleware is what we call a "pre save hook". This has access to the next()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  // "this.name" is what we want to change while "{ lower: true }" is what we want to do.
  // Just like in Express, in Mongoose middleware, we also call the next() middleware.
  next(); // This calls the next middleware in the stack. If not called i.e the next(),
  // the fc will not be executed
});

tourSchema.pre('save', function (next) {
  console.log('Will save document....');
  next();
});

//b) .post :  This middleware is what we call a "post save hook"This has access to the next(), and also to
// the doc that was was just saved to the database.
// ".post" are executed after all the "pre" middleware fcs have completed
tourSchema.post('save', function (doc, next) {
  //Inside here wed do no longer have the "this" keyword but we basically have the finished doc in here i.e doc.

  // console.log(doc);
  next(); // In this case again we only have one post middleware and so we wouldn't really need next(), but
  // it's a best practice to simply always include it.
});

//curr=> current

//2) QUERY MIDDLEWARE:
//a) pre middleware for ".find()"
// The below is the right way
tourSchema.pre(/^find/, function (next) {
  // So "/^find/" means that the middleware should be executed for not only "find()", but for all the commands that
  // start with the name "find()". this "/^find/" actually means all the strings that starts with "find()"
  this.find({ secretTour: { $ne: true } }); // "ne=> not equal".

  // Setting a clock to see how long ittakes to execute the current query
  this.start = Date.now();

  next();
});
// After the above, when we send "Get Tour" this request with the id "Super Secret Tour", we will get no tour.
// which is now good

//b) post middleware for ".find()": Here we get access to all docs returned from a query. This middleware as we
// runs after the query has been executed
tourSchema.post(/^find/, function (docs, next) {
  // So "/^find/" means that the middleware should be executed for not only "find()", but for all the commands that
  // start with the name "find()". this "/^find/" actually means all the strings that starts with "find()"

  // To get the time this query took tobe executed, we subtract the start time current time i.e "this.start
  console.log(`Query took ${Date.now() - this.start} milliseconds`); // This will be seen on the vsc terminal
  // after the response is sent.
  // console.log(docs);
  next();
});

//3) AGGREGATN MIDDLEWARE

// So we want the below to happen b the aggregatn is done, so we use he aggregatn hook
tourSchema.pre('aggregate', function (next) {
  //In the aggregatn middleware, "this" is gonna pt to the current aggregatn object.

  //console.log(this.pipeline());

  // "unshift" is used to add an element at the beginning of an array in Javascript
  this.pipeline().unshift({
    //adding another stage i.e match
    $match: { secretTour: { $ne: true } },
    // we try it by sending the "Get Tour Stats". we see that the "DIFFICULTY" is now 5, which was 6 b4, So meaning the
    // "Super Secret Tour" has been exempted, and the total is now 12.
  });
  next();
});

// I am not going to talk about "MODEL MIDDLEWARE", which is the 4th,bcos it is not really important.

////////
const Tour = mongoose.model('Tour', tourSchema); // This is a conventn in programming to always use Uppercases for model names and variables.
// I used a capital "Tour" also so we know we are dealing with a model.

//exporting Tour so it can be used in the tourController where we want to create, query, delete and update tours.
module.exports = Tour;
