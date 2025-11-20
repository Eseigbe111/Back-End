// Built-in modules
const fs = require('fs');

// Third-Party
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Config
dotenv.config({ path: './config.env' });

// Local modules
const Tour = require('../../models/tourModel');

// Database connection
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // I added this line bcos it always times out b4 it performs the operation of
    //  deleteData() or importData()
    serverSelectionTimeoutMS: 50000, // ⏱️ timeout after 30s
  })
  .then(() => console.log('✅ DB connection successful!'))
  .catch((err) => console.error('❌ Connection error:', err));

///READING THE FILE locally so we can send to the cloud.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

//IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    // I used this while sending it to the database bcos of the error, after whichi
    // disabled it back
    // await Tour.create(tours, { validateBeforeSave: false });
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // This exits the eperatn whether successful or not
  // This process.exit() is actually an aggressive way of stopping the application but in this case
  // it's no problem bcos it's really just a very small script and not a reall application
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

console.log(process.argv); // To see this do "node dev-data/data/import-dev-data.js --import". From here, we
// will see that "--import" is always at argv[2]. So with that we can easily do the below

// Calling the above importData() and deleteData()
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// To run this if statement, we will do "node dev-data/data/import-dev-data.js --delete" and then
// "node dev-data/data/import-dev-data.js --import" on the terminal
