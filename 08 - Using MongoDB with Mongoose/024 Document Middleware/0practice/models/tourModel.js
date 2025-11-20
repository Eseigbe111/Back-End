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
    },

    // THIS IS FOR THIS LECTURE
    slug: String,
    // Ends here

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
    },

    ratingsAverage: {
      type: Number,
      default: 4.5, // So when nothing is inputted, we use 4.5 as default
    },

    ratingsQuantity: {
      type: Number,
      default: 0, // At the beginning there won't be any rating when the tour is new
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    priceDiscount: Number,

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
  },
  // The below code is needed for any virtual ppt to work
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual Properties in Mongoose:
// Virtual properties -- (also called virtuals) are fields defined in a Mongoose schema that are not stored in the database.
// Instead, they are computed dynamically from existing data whenever a document is read or converted to JSON or a plain object.
// They help: Save storage space, Avoid redundancy, Compute values on the fly that can be derived from other fields.
// How to Define a Virtual Property -- Virtual properties are defined on the schema, not in the database.
tourSchema.virtual('durationWeeks').get(function () {
  // 'durationWeeks' is the name of the virtual property
  return this.duration / 7; //this refers to the current document
  //converting the tour duration from days to weeks
});

// THIS IS FOR THIS LECTURE: MONGOOSE MIDDLEWARE
// In Mongoose (a popular MongoDB ODM for Node.js), middleware are functions that run before or after certain Mongoose operations —
// like saving a document, running a query, or aggregating data. There are 4 main types of middleware in Mongoose:
// 1) Document middleware (doc), 2) Query middleware (query) 3) Aggregate middleware (aggregate) 4) Model middleware (model).

// DOC MIDDLEWARE: These are middlewares that act directly on individual documents — i.e., instances of a Mongoose model. They run before
// or after document-level operations like: save(), create(). They do NOT run for query methods like: .insertMany(), .findByIdAndUpdate()
// .updateOne(), .updateMany(). We have two types of DOC MIDDLEWARES which are pre('save') and post('save'). And we call both on the schema.

// 1) pre('save') middleware runs before the document is saved and gets access to the next()
// 2) post('save') middleware runs after the document has been saved. This has access to the next(), and also to the doc that was was just
// saved to the database

//1) PRE('SAVE') :Has access to only next(). To test this we need to create a new Tour in postman
tourSchema.pre('save', function (next) {
  console.log(this); // Unsaved document (in memory) and so we will not see anything
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

//
//2) POST('SAVE'): Has access to the currecnt doc saved and next()
tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});

// Ends here

// This line compiles the schema into a model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
