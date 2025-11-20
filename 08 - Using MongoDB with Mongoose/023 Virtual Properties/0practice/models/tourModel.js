// Importing mongoose
const mongoose = require('mongoose');

// So Mongoose is all about models, and a model is like a blueprint that we use to create docs
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //The 2nd parameter is an error message if a name is not entered
      unique: true, // means names should be the same
      trim: true,
    },

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
  // THIS IS FOR THIS LECTURE
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  // Ends here
);

// THIS IS FOR THIS LECTURE
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

// To make Virtual ppts appear in JSON or Object outputs, we must define the below in our schema above
/* 
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
*/

// Ends here

// This line compiles the schema into a model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
