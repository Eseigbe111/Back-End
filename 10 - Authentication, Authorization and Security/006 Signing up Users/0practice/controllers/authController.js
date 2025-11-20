const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

// Handling the signup()
exports.signup = catchAsync(async (req, res, next) => {
  // Creating name, email,password and passwordConfirm onthe  req.body
  const { name, email, password, passwordConfirm } = req.body;

  // creating a new user
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  // THIS IS FOR THIS LECTURE: Watch how Jonas tested this
  // Signing up USers
  // Creating a JWT: To use JWT, we installit by doing "npm install jsonwebtoken" and require it above
  // A JWT token is created using jwt.sign(), which takes three parts:
  const token = jwt.sign(
    //a) Payload: An object containing the data stored in the token—here, just the user’s ID
    { id: newUser._id },
    //b) Secret Key: A long, secure string stored in the environment variable JWT_SECRET. It should be at least 32 characters to ensure strong security.
    process.env.JWT_SECRET,
    //c) Options: Additional settings such as token expiration. The expiration time is stored in JWT_EXPIRES_IN (e.g., 90d), after which the token becomes
    // invalid for security reasons.
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
  // This token setup above helps securely authenticate users and automatically logs them out after a set period.

  //Sending a response of 201 for created
  res.status(201).json({
    status: 'success',
    token,
    // Ends here
    data: {
      newUser,
    },
  });
});
