//Importing mongoose
const mongoose = require('mongoose');

// creating a very small schema for our tours:
const tourSchema = new mongoose.Schema({
  // name: String,
  // rating: Number,
  // price: Number,
  /// The above is the smplest way of describing our data, but we can take it to a whole new level by using an object of optns :
  name: {
    type: String,
    // required: true,
    required: [true, 'A tour must have a name'], // Passing an error string we want to be displayed whe we are missing this field
    unique: true, // This means we can't have two tour docs with the same name
  },

  rating: {
    type: Number,
    default: 4.5, // So here if we create a new tour doc using this schema and not specifying the rating, it will then automatically
    // be set to 4.5.
  },

  price: {
    type: Number,
    required: [true, 'A tour must have a price'], // Passing an error string we want to be displayed whe we are missing this field
  },
});

// So the above is our very basic schema, let's now go ahead and actually create a model out of it.
const Tour = mongoose.model('Tour', tourSchema); // This is a conventn in programming to always use Uppercases for model names and variables.
// I used a capital "Tour" also so we know we are dealing with a model.

//exporting Tour so it can be used in the tourController where we want to create, query, delete and update tours.
module.exports = Tour;
