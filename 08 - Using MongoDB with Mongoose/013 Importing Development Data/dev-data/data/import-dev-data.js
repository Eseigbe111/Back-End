/// THIS IS FOR THIS LECTURE

// we want to read the file from the file sys. locally
const fs = require('fs');

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// We also need to access the "tourModel" bcos we need tourSchema to know fields needed.
const Tour = require('./../../models/tourModel');

/////
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

//READING THE FILE locally so we can send to the cloud.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);
//IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // This exits the process after it performs it operation.
  // This process.exit() is actually an aggressive way of stopping the application but in this case
  // it's no problem bcos it's really just a very small script and not a reall application
};

// DELETING THE DATA ALEADY IN THE DATABASE OR IN THE COLLECTION
const deleteData = async () => {
  try {
    // When working with mongoose we can also delete all using "deleteMany()" without any argument
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // This exits the process after it performs it operation.
  // This process.exit() is actually an aggressive way of stopping the application but in this case
  // it's no problem bcos it's really just a very small script and not a reall application
};

// Now we could go ahead to simply export or import the fc and make it work, but i want to make this
// a little bit more fun. So let's now learn a tiny little bit about interacting with the command line.
//And so i amactually gonna go ahead an d run this file without calling any of these fcs. But instead
// i'm gonna log to the console "process.argv" as seen:
//console.log(process.argv); // This gives an array of running  this "node dev-data/data/import-dev-data.js"
// The first arg being where the "node" command is located which is equivalent to "node", and the 2nd
// which is the path to the file is actually "dev-data/data/import-dev-data.js"

// So let's do this and add an optn like this "node dev-data/data/import-dev-data.js --import".We will
// get a 3rd arg called "--import", which means we can no basically go ahead and use this data i.e "--import"
// to write avery simple command line application basically, which will import the data when we specify
// this optn "--import" and will delete the data when we specify the delete option. So let's do that:
if (process.argv[2] === '--import') {
  // It's an array with 3 ppts hence we use 2 for the part where the "--import"
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

//  So the above should actually give us the result we are looking for
// We run these on the terminal "node dev-data/data/import-dev-data.js --import" and
// "node dev-data/data/import-dev-data.js --delete" . we will run the "--delete" b4
// the "--import"

// To see if the above took effect, we can go to the Postman and try to get all tours.
// We will see that the data is cleared from our tours.
