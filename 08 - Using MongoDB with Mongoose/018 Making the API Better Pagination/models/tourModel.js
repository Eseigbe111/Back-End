//Importing mongoose
const mongoose = require('mongoose');

// creating a very small schema for our tours:
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    required: [true, 'A tour must have a name'], // Passing an error string we want to be displayed whe we are missing this field
    unique: true, // This means we can't have two tour docs with the same name
    trim: true, // This only works for string, which removes all the whitespaces in the beginnig and in the end of the string
  },

  duration: {
    type: Number,
    required: [true, 'Atour mush have a duration'],
  },

  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },

  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },

  // I did not give the ratingsAverage and ratingsQuantity the required ppt bcos it is not the user who cretes these tours who will
  // actually specify these values. These will later be calculated from the reviews
  ratingsAverage: {
    type: Number,
    default: 4.5, // So here if we create a new tour doc using this schema and not specifying the rating, it will then automatically
    // be set to 4.5.
  },

  ratingsQuantity: {
    type: Number,
    default: 0, // At the beginning there won't be any rating when the tour is new
  },

  price: {
    type: Number,
    required: [true, 'A tour must have a price'], // Passing an error string we want to be displayed whe we are missing this field
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
    default: Date.now(), // This will give us a timestamp in millisecs. In mongo,
    // this is converted to the real date so that it wil more sense
    select: false, // Making the createdAt not to be seen by the user.
  },

  startDate: [Date], //Also an array of dates a tour starts. Mongo does not automatically
  // convert this.
});

// After the above, The way we can try this out, is to go to our dev-data/data/tours-simple.json and copy one of the objects and paste it in our
// Postman app, to create a new POST request, we will remove the id,bcos mongo creates it on its own

const Tour = mongoose.model('Tour', tourSchema); // This is a conventn in programming to always use Uppercases for model names and variables.
// I used a capital "Tour" also so we know we are dealing with a model.

//exporting Tour so it can be used in the tourController where we want to create, query, delete and update tours.
module.exports = Tour;
