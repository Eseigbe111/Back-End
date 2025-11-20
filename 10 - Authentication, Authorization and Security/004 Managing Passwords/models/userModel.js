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

    /// THIS IS FOR THIS LECTURE:
    // 1) Validating the password: We can try this in Postman by changing the passwordConfirm
    validate: {
      // This is specifying a new callback() that will be called each time a new doc is created
      // we can't use the arrow fc bcos we need to use the "this" keyword
      validator: function (el) {
        // remember that from the validator fc, we return either true or false. And if we return false, then it
        // means that we're gonna get a validation error while if it is true, we get no error.

        // THIS return only works only on SAVE!!!.
        return el === this.password; // So this will return true else and error for false
        //  So whenever we want to update a user, we will always have to use "SAVE" as well
        // and not for e.g findOneAndUpdate() like we did with our tours. So lets keep this in mind when we write the rest
        // of the code thru out the rest of the section, and especially for updating. Bcos let's say that we updated the user's
        // password simply with a regular update. Then in that case, this "passwordConfirm" validation would no longer work.
        // And of course that cannot happen.
      },

      message: 'Passwords are not the same', // When error occurs
    },
    // Now the next step is to encrypt this plain password that we have in the database now. So as i mentioned in the last video,
    // when we are working with authentication, one of the most fundamental principles is to never ever store plain passwords in
    // a database. So that is smth that's absolutely not acceptable. So we should really always encrypt user's passwords bcos
    // imagine that for sm reason, a hacker gets access to the database and the passwords are stored in plain text in there, then
    // he can simply login as any user and so whatever he really wants and cause a lot of damage in sm cases. And so we even need
    // to absolutely prevent that
  },
});

//2) Encrypting password: we test this in postman by creatig a new user and we then check from the response what the password looks like
// Now the model is the best place to do this, bcos it really has to do with the data itself and so it should be  on the model
// and not in the controller.
// So how are we gonna now implement this encryption? well this is another perfect use case for using Mongoose middleware. And
// the one that we're gonna use is a pre-save doc middleware.
// Remember we will define that on the schema and using a pre-hook i.e pre-middleware on save.
//Now the reason we are doing it like this is that the middleware fc that we're gonna specify here,so the encryptn, is then gonna
// happen btw the moment that we receive that data and the moment where it's actually persisted to the database. so that's where the
// pre-save() middleware runs. And that's the perfect time to manipulate the data.
userSchema.pre('save', async function (next) {
  // Now we only want to encrypt the password if the password field has actually been updated. so basically only when really the
  // password is changed or also when it's created new. Bcos imagine the user is only updating the email, then in that case, of
  // course, we do not want to encrpty the password again. And so we can do that with Mongoose as seen below:
  // a) Checking if no modified password
  if (!this.isModified('password')) return next(); // "this" refers to the curr doc i.e the curr user.
  // so this checks if the password is not modified and quickly exits the if block and then moves to the next() middleware if it
  // is not modified otherwise it will run the below code:

  // b) Encrypting the password
  // We are gonna do this encrypting using a well known hashing algorithm called bcrypt. So this algorithm will 1st salt then
  // hash out password in order to make it really strong to protect it against bruteforce attacks. This why passwords have to be
  // strong encrypted bcos bruteforce attacks could try to guess a certain password if it's not strongly encrypted.
  // Salting our password means it is just gonna add a random string to the password so that two eaqual passwords do not generate
  // the same hash.
  // Now i am not gonna go into all the cryptographic details on how this really works behind th scenes and why we need such a
  // complex sys. But of course u can read all u want about "bcrypt" online. There is really a ton of interesting stuff to discover
  // there.
  // So we install the bcrypt package by doing "npm i bcryptjs". After that we import it at the to of this file.
  // This hash() is the asynchronous version and this returns a promise which we need to await
  this.password = await bcrypt.hash(this.password, 12); // We always need to specify 2nd parameter which is the cost parameter. we used "12".
  // And we could actually do this in two ways. 1st: to manually generate the salt, so the random string that is gonna be added to our
  // password and then use that salt here in this hash fc. 2nd: But instead, we can make it a bit easier, we can also simply pass a
  // cost parameter into the fc as we did above. So that is basically a measure of how CPU intensive this operation will be. And the
  // default value of the cost parameter i believe is 10, but right now it's a bit better to actually use 12 bcos computers have bcom
  // more and more powerful. The higher the cost the more CPU intensive the the process will be and the better the password will be
  // encryppted. And we could go higher than 12 but the process will take too long

  //c) Deleting the passwordConfirm
  // Finally, we want to delete the passwordConfirm, bcos at this pt in time, we only have the real password hashed
  this.passwordConfirm = undefined; // This is how u delete a field so that it will not be persisted in the database.
  // So we only needed "passwordConfirm" just for the initial validatn just to be sure that the user actually inputted
  // two equal passwords so that he does not make any mistaked with his password

  next();
});

// Ends here

/// Creating the Model
const User = mongoose.model('User', userSchema);

module.exports = User;

// And the above is our simple user schema that will allow us to get started with creating users in the next video
