// THIS IS FOR THIS LECTURE
// Importing mongoose
const mongoose = require('mongoose');

// So Mongoose is all about models, and a model is like a blueprint that we use to create docs
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], //The 2nd parameter is an error message if a name is not entered
    unique: true, // means names should be the same
  },

  rating: {
    type: Number,
    default: 4.5, // So when nothing is inputted, we use 4.5 as default
  },

  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// This line compiles the schema into a model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// Ends here
