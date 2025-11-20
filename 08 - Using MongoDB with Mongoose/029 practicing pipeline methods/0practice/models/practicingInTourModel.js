// Importing mongoose
const mongoose = require('mongoose');
const slugify = require('slugify');

// So Mongoose is all about models, and a model is like a blueprint that we use to create docs
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //The 2nd parameter is an error message if a name is not entered
      unique: true, // means names should be the same
      trim: true,

      // VALIDATORS: Validators are rules that run before a document is saved (or updated if you enable runValidators).
      // BUILT-IN VALIDATORS
      // maxlength
      maxlength: [
        40,
        'A tour name must have less or equal than 40 characters ',
      ],

      // minlength
      minlength: [
        10,
        'A tour name must have more or equal than 10 characters ',
      ],
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

      // BUILT-IN VALIDATORS: enum
      enum: {
        values: ['easy', 'medium', 'difficulty'], //Passing an array of the values that are allowed
        message: 'Difficulty is either: easy, medium, difficult', // This is the error message we want when none of the above is inputted
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5, // So when nothing is inputted, we use 4.5 as default

      // BUILT-IN VALIDATORS
      min: [1, 'Rating must be above 1.0'], // ✅ min validator
      max: [5, 'Rating must be below 5.0'], // ✅ max validator
    },

    ratingsQuantity: {
      type: Number,
      default: 0, // At the beginning there won't be any rating when the tour is new
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    priceDiscount: {
      type: Number,

      // CUSTOM VALIDATOR: THese are fcs we write ourselves.
      // This only works for ".save()" and ".create()"
      validate: {
        validator: function (val) {
          // This validator below ensures that priceDiscount is < price
          return val < this.price;
        },
        // This is the error message:
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },

    summary: {
      type: String,
      trim: true, // This only works for string, which removes all the whitespaces in the beginnig and in the end of the string
      required: [true, 'A tour must have a description'],
    },

    summFirstword: String,

    secretTour: {
      type: Boolean,
      default: false,
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

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    // To make virtual ppts that are defined in the schema have effect, we need the below
    //  THis is when the data is outputed as JSON
    toJSON: { virtuals: true },
    // The below is when the data is outputed as an object
    toObject: { virtuals: true },
  },
);

// VIRTUAL PPTS:
// Which are also known as virtuals. These are basically fields that we can define on our schema
// but that will not be persisted.So they will not be saved into the database in order to save us sm space.

// To test this we just "Get All Tours" in Postman. But durationweeks will not be seen in our MongoDB Atlas
tourSchema.virtual('durationweeks').get(function () {
  //"this" is th curr doc
  return this.duration / 7; // duration is in days.
});

// DOC MIDDLEWARE: They run before
// or after document-level operations like: save(), create(). They do NOT run for query methods like: .insertMany(),
// .findByIdAndUpdate() etc.

// Test this using POST http://127.0.0.1:3000/api/v1/tours

// EXERCISE 1 — Auto-generate slug on save (Document Middleware)
// Goal: Ensure every tour automatically gets a slug whenever it's created or saved.
//1) pre('save')
tourSchema.pre('save', function (next) {
  console.log(this); // Unsaved document (in memory) and so we will not see anything

  this.slug = slugify(this.name, { lower: true });
  // console.log('Slug created:', this.slug);

  if (this.summary) {
    this.summFirstword = this.summary.split(' ')[0]; // Taking the firstword of summary
    // console.log(this.summFirstword);
  }
  next();
});

//2) post('save')
tourSchema.post('save', function (doc, next) {
  console.log(doc); //doc is the saved doc
  next();
});

//////////////

// B) QUERY MIDDLEWARE
// Query middleware runs before or after query methods like .find(), .findOne(), .findById(), .updateOne(), etc.
// We also have the pre, and post

// EXERCISE 2 — Hide Secret Tours From Queries (Query Middleware)
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(doc.length);
  next();
});

//✅ EXERCISE 3 — Log Query Time (Query Middleware)
// Task:
// Measure how long each query takes to run.
tourSchema.pre(/^find/, function (next) {
  this.start = Date.now(); // When query started
  next();
});

//Accesssing the time here
tourSchema.post(/^find/, function (doc, next) {
  console.log(`This query took ${Date.now() - this.start}ms`); // When query ends
  next();
});

// ✅ EXERCISE 4 — Avoid Showing Deleted Tours (Query Middleware)
// Simulate soft delete:
tourSchema.pre(/^find/, function () {
  this.find({ isDeleted: { $ne: true } });
});

// ✅ EXERCISE 5 — Remove Secret Tours From Aggregation (Aggregate Middleware)
// Task:
// When running .aggregate(), automatically add a $match stage at the beginning to remove secret tours.
// Test this by doing GET /api/v1/tours/tour-stats or running any aggregate() fc i created in tourController
tourSchema.pre('aggregate', function (next) {
  console.log(this.pipeline());
  // Adding a $match that removes secretTour b4 any other aggregate process
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

/////////
// This line compiles the schema into a model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
