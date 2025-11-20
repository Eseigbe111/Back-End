// THIS IS FOR THIS LECTURE: MONGOOSE: We do "npm i mongoose"
// Mongoose is the most common and convenient way to connect Express (Node.js) to a MongoDB database.
// WHAT MONGOOSE DOES
// Mongoose is an Object Data Modeling (ODM) library for MongoDB.
// It acts as a bridge between your Express app and your MongoDB database by:
//1) Connecting your Node.js app to MongoDB
//2) Defining schemas (structure/shape of your data)
//3) Creating models to interact with collections
//4) Providing validation, hooks, and query helpers
// Without Mongoose, you could still connect using the native MongoDB driver, but Mongoose makes things much
// easier and more structured — especially for larger apps.

// Importing mongoose
const mongoose = require('mongoose');
// Ends here

////
dotenv.config({ path: './config.env' });

// ENVIRONMENT VARIABLES: We install dotenv by doing "npm i dotenv"
const dotenv = require('dotenv');

const app = require('./app');

// THIS IS FOR THIS LECTURE
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

//  Ends here

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// This 06-ABetterFileStruture.js is the server.js in subsequent lessons
