//envmt=> environment
//envmtl=> environmental
/// Importing the app
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// This is for this lecture: Evironment variable
dotenv.config({ path: './config.env' });

// Connecting Mongoose: Inside the ".connect()", we will pass in our string for connectn and our password as seen below:
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
); // This is adding the real password to the string

//Connecting our Mongoose to our MongoDB
// A) When using MongDB Atlas
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

// THIS IS FOR THIS LECTURE:
// So Mongoose is all about models, and a model is like a blueprint that we use to create docs. So it's a bit like classes
// in javascript, which we also kind of use as blueprints in order to create objects out of them. So again, we create a model
// in Mongoose in order to create docs using it and also to query, update and delete these docs. So basically, to perform each
// of the CRUD operation, i.e create, read, update, and delete, we need a Mongoose model, and in order to create a model, we
// actually need a schema. So we actually create models out of Mongoose schema just like we learned in the lat video, and we
// use the schema to describe data, to set default values, to validate the data, and all kinds of stuff like that. Just as u
// will see now, bcos now we will start creating a very small schema for our tours:
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

////
// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
