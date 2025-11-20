// ENVIRONMENT VARIABLES: We install dotenv by doing "npm i dotenv"
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

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

  // START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// THIS IS FOR THIS LECTURE
// ERRORS OUTSIDE EXPRESS: UNHANDLED PROMISE REJECTN
// In this lecture, we will learn about Unhandled Promise Rejections in Node.js. Even though we already handle operational
// errors inside Express using our global error handling middleware, some errors happen outside Express, such as database
// connection failures. When a promise rejects and we do not handle it with .catch(), Node produces an unhandled promise
// rejection. This can happen, for example, when MongoDB fails to connect.

// To handle these cases globally, we use the process event listener:
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => process.exit(1));
});

// This ensures that any rejected promise we forgot to catch is still handled, logged, and the application is shut down
// gracefully. We first close the server to allow any pending requests to finish, and then exit the application. This acts
// as a safety net for errors that occur outside the Express app.

// Ends here
