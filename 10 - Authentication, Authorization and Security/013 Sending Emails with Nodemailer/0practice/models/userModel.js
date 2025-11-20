const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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

  // It stores the date/time when the user last changed their password.
  passwordChangedAt: Date,
  // Old users in the database won’t have it until a password change happens.

  passwordResetToken: String,

  passwordResetExpires: Date,
});

///////////////

// ENCRYPTING THE PASSWORD: To do this we use bycrypt which we install by doing "npm i bcryptjs"
// Why use pre-save middleware: Encryption should happen in the model, not the controller, because it concerns the data itself.
// The pre('save') middleware runs between receiving the data and saving it to MongoDB — the perfect time to modify (hash) the password.
// U can test this using 127.0.0.1:3000/api/v1/users/signup by creating a new user
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

//////////////////

// CORRECTPASSWORD() Instance Method: This checks if password from database matches the one entered on screen
// The correctPassword() function is an instance method added to the userSchema. Instance methods are functions available on all documents of a collection.
userSchema.methods.correctPassword = async function (
  canditatePassword,
  userPassword,
  // Because the password field is hidden (select: false), this method receives the stored password as a parameter instead of using this.password.
) {
  // Uses bcrypt.compare() to check if the entered password matches the hashed one.
  return await bcrypt.compare(canditatePassword, userPassword);
  // Returns true if the passwords match, otherwise false.
};

//////////////
// CHANGEDPASSWORDAFTER() Instance Mthd: This prevents users from using old tokens after they change their password.
// If the password was changed, the user must log in again to get a new, valid token.
// changedPasswordAfter() This method checks whether a user changed their password after the JWT token was issued.
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // 1)checking If passwordChangedAt exists
  if (this.passwordChangedAt) {
    // 2) Convert passwordChangedAt to a timestamp in seconds
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10, // we specify the base by usig 10
    );
    // 3)Compare it to the token’s timestamp (JWTTimestamp).
    // If passwordChangedAt > JWTTimestamp, return true → password was changed after token → token becomes invalid.
    return JWTTimestamp < changedTimestamp;
  }
  // If passwordChangedAt does not exist: User never changed password → return false.
  return false;
};

//////
// CREATEPASSWORDRESETTOKEN() instance mthd for Password Reset Token
// Not as strong as a password hash—just enough for a one-time token.
userSchema.methods.createPasswordResetToken = function () {
  //1) Generate Token:
  const resetToken = crypto.randomBytes(32).toString('hex');

  //2) Encrypt & Store Token in DB in passwordResetToken
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log(resetToken, this.passwordResetToken);

  //3) passwordResetExpires is set to 10 minutes from wen generated after which it expires.
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // 4) Return Token: The plain token (resetToken) is sent to the user via email.
  // The encrypted version is saved in the database for later verification.
  return resetToken;
};

////////////////
const User = mongoose.model('User', userSchema);

module.exports = User;
