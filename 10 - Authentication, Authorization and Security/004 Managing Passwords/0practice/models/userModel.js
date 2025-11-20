const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Creating the user schema
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
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
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
    // THIS IS FOR THIS LECTURE
    // MANAGING PASSWORDS
    // VALIDATING THE PASSWORD: A custom validator checks whether passwordConfirm matches password.
    // This validation only works when a document is saved (like with User.create() or user.save()), not with methods like findOneAndUpdate().
    // That’s why, when updating a password later, you must use .save() to trigger this check.
    validate: {
      validator: function (el) {
        // el (short for element) represents the current value of the field being validated — in this case, the value of passwordConfirm.
        return el === this.password; //This will return true or false
      },
      //THis is if this.password is not the same with el i.e passwordConfirm
      message: 'Passwords are not the same',
    },
  },
});
// U can test this using 127.0.0.1:3000/api/v1/users/signup by creating a new user
// ENCRYPTING THE PASSWORD: To do this we use bycrypt which we install by doing "npm i bcryptjs"
// Why use pre-save middleware: Encryption should happen in the model, not the controller, because it concerns the data itself.
// The pre('save') middleware runs between receiving the data and saving it to MongoDB — the perfect time to modify (hash) the password.
userSchema.pre('save', async function (next) {
  //a) Checking if password was modified: Skip hashing if the password hasn’t changed (e.g., when updating only email).
  if (!this.isModified('password')) return next();

  //b) Encrypting the password: Use bcryptjs to salt and hash the password with a cost factor of 12 for strong security.
  this.password = await bcrypt.hash(this.password, 12);

  //c) Delete passwordConfirm so it’s not saved in the database — it’s only used for validation.
  this.passwordConfirm = undefined;

  next();
});
// NB:Every time a new user is created or a password is changed, the password is automatically hashed and secured, while passwordConfirm is discarded.
// Ends here

const User = mongoose.model('User', userSchema);

module.exports = User;
