/// THIS IS FOR THIS LECTURE

const mongoose = require('mongoose');
const validator = require('validator');

// After requiring the mongose, all we have to to is to create a schema and a model out of if, just like we did with the tours we're
// gonna do wit here now with the users.

// Creatting the user Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },

  // So the email will be used for the user to login and we will not create a username ppt here. So in sm applications, u will see a
  // username being used, but in this case, we wanna keep it simple here and simply identify users by email.
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true, // This is basically bcos this email is the unique identifier of each user.
    lowercase: true, // This just transforms the email to lower case
    // Creating our own custom validator using the validator we required above which we installed thru npm
    validate: [validator.isEmail, 'Please provide a valid email'], // This checks if the email is valid
  },

  // We want users to be able to upload a photo and this is usually optional in most web application
  photo: String,

  // Many apps have all these crazy rules like at least one number and one character and one symbol, but
  // we're not gonna implement any of that here, bcos it has actually been found that that's not really
  // effective. And the more secured passwords are the longer ones and not the ones that have crazy symbols etc
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },

  // This part actually is for when u are creaing a new acc, and is just to make sure that ur passwords are
  // consistent and you really know it
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a password'],
  },
});

/// Creating the Model
const User = mongoose.model('User', userSchema);

module.exports = User;

// And the above is our simple user schema that will allow us to get started with creating users in the next video

// Ends here
