//envmt=> environment
//envmtl=> environmental
/// Importing the app
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// Evironment variable
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

///// THIS IS FOR THIS LECTURE:
//1) We will create a new variable, which will be a new doc created out of the tour model that
// we created in the last lecture.
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});
// So The above is a new doc we created aout of a tour model, fc constructors, and so as i said b4, this is kinda of using javascript fc constructors,
// or javascript classes if u're using ES6 basically to create new objects out of a class. That's exactly what we did above.

//2) Saving the tours collectn to the database.The save returns a promise that we can consume. we will use the then(), but in the future we will change
// it to async await. The resolved value that the "save()" returns is the final doc as it sis in the database.
testTour
  .save()
  .then((doc) => {
    console.log(doc); // From our terminal here, we can see the tour created with a unique identifier.
  })
  //catching the error that might occur while saving the doc to the database
  .catch((err) => {
    console.log('ERROR 💥:', err);
  });
////Going to check our MongoDB compass online, we can see the added tour. So we just made our epress application really interact wih a MongoDB database for
// the very first time, and that's actually really amazing. So this means that right now, we are able to create doc from our code.

// U would realize that each time we save a new tour would want to be created but bcos we set a unique ppt for our name as seen above from " unique: true,",
// this will result into an error.
// Also if we do not have the rating and the price in our testTour i.e we only have "name: 'The Forest Hiker',", this will lead to a "validationError",
// saying 'A tour must have a price', which is exactly the message that we specified in the fields that are marked required.

//To see the new Doc created, we click on the refresh btn by the up-right hand side on the MongoDB compass online

//////////////
// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
