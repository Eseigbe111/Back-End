// ENVIRONMENT VARIABLES: We install dotenv by doing "npm i dotenv"
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Importing mongoose
const mongoose = require('mongoose');

const app = require('./app');

// Getting the password from the config.env file
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Connecting to Mongo Atlas
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ DB connection successful!'))
  .catch((err) => console.error('❌ Connection error:', err));

// Creating a Simple Model
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

// THIS IS FOR THIS LECTURE:
//  Creating Docs and Testing the Model
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

testTour
  .save() //Here we are telling Mongoose to Take this document and
  // actually store it in the MongoDB database, if not it will not be saved.
  .then((doc) => console.log(doc))
  .catch((err) => console.log('ERROR 💥:', err));
// Ends here

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
