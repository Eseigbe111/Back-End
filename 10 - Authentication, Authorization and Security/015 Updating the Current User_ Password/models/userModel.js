//Importing "crypto" built-in module
const crypto = require('crypto');

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

  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'], // These names are subject to the type of applicatn u are
    // creating. But in our case, it is what we listed above that make sense
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
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

  //
  // Date for which password was changed. This will only show if password is changed
  passwordChangedAt: Date,

  passwordResetToken: String,

  passwordResetExpires: Date,
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

// Update the changedPasswordAt ppt for the current user
userSchema.pre('save', function (next) {
  // When exactly do we want to change the changedPasswordAt ppt to right now? Well we only want it when we actually modified the password ppt
  if (!this.isModified('password') || this.isNew) return next(); // "this.isNew" means when a new doc is created
  // This above code simply says if we do not modify the ppt, let's not change the changedPasswordAt ppt

  // But when we create a new doc, then we did actually modify the password, and then we would set the changedPasswordAt ppt.
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/// Fc checks if the given password is the same as that stored in the doc in the database
userSchema.methods.correctPassword = async function (
  candidatePassword, //This is password being passed
  userPassword, // This is password in the doc in the database
) {
  // The goal of this fc is to return true or false
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if user changed password after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // We will pass the tmestamp of the token into this fc.
  // 'this' pts to the current doc.
  if (this.passwordChangedAt) {
    // We want to enter this loop when passwordChangedAt ppt is available else the user has never changed their password. And so it
    // will go out of this if block and return false.

    //Conversion of timestamps to secs
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    ); // we specify the base by usig 10

    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  //
  // Now by default, we will return false from this fc. Which means the user has not changed his password after the token was issued.
  return false;
};

// Creating an instant mthd for generating a random reset token
userSchema.methods.createPasswordResetToken = function () {
  //Generating the token
  const resetToken = crypto.randomBytes(32).toString('hex'); // 32 is number of chars
  //toString('hex') coverts it to an hexadecimal string

  // Encrypting the token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // we want it to expire in 10mins

  return resetToken; // This is what we are sending to the email which is unencrypted resetToken and then the one stored in the database is
  // the encrypted version.
};

/// Creating the Model
const User = mongoose.model('User', userSchema);

module.exports = User;
