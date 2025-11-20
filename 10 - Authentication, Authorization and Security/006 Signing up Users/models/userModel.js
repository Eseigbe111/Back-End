const mongoose = require('mongoose');
//importing the validator
const validator = require('validator');
// Importing the bcrypt
const bcrypt = require('bcryptjs');

////////
// Creatting the Schema
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

    // Validationg the password: We can try this in Postman by changing the passwordConfirm
    validate: {
      // This is specifying a new callback() that will be called each time a new doc is created
      // we can't use the arrow fc bcos we need to use the "this" keyword
      validator: function (el) {
        // remember that from the validator fc, we return either true or false. And if we return false, then it
        // means that we're gonna get a validation error while if it is true, we get no error.

        // THIS return only works only on SAVE!!!.
        return el === this.password; // So this will return true else and error for false
      },

      message: 'Passwords are not the same', // When error occurs
    },
  },
});

//Encrypting password: We test this in postman by creatig a new user and we then check from the response what the password looks like
userSchema.pre('save', async function (next) {
  // a) Checking if no modified password
  if (!this.isModified('password')) return next(); // "this" refers to the curr doc i.e the curr user.

  // b) Encrypting the password
  this.password = await bcrypt.hash(this.password, 12); // We always need to specify 2nd parameter which is the cost parameter. we used "12".

  //c) Deleting the passwordConfirm
  // Finally, we want to delete the passwordConfirm, bcos at this pt in time, we only have the real password hashed
  this.passwordConfirm = undefined; // This is how u delete a field so that it will not be persisted in the database.
});

/// Creating the Model
const User = mongoose.model('User', userSchema);

module.exports = User;

// And the above is our simple user schema that will allow us to get started with creating users in the next video
