const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// THIS IS FOR THIS LECTURE
// CREATING A JWT:
// To use JWT, we install it by doing "npm install jsonwebtoken" and require it above
// A JWT token is created using jwt.sign(), which takes three parts:
const signToken = (id) => {
  return jwt.sign(
    //a) Payload: An object containing the data stored in the token—here, just the user’s ID
    { id },
    //b) Secret Key: A long, secure string stored in the environment variable JWT_SECRET. It should be at least 32 characters to ensure strong security.
    process.env.JWT_SECRET,
    //c) Options: Additional settings such as token expiration. The expiration time is stored in JWT_EXPIRES_IN (e.g., 90d), after which the token becomes
    // invalid for security reasons.
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
  // This token setup above helps securely authenticate users and automatically logs them out after a set period.
};
// Ends here

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

  // Signing up USers
  const token = signToken(newUser._id);

  //Sending a response of 201 for created
  res.status(201).json({
    status: 'success',
    token,
    data: {
      newUser,
    },
  });
});

// THIS IS FOR THIS LECTURE
// LOGGING IN USERS
exports.login = catchAsync(async (req, res, next) => {
  //1) Read input: Extract email and password from req.body.
  const { email, password } = req.body;
  // console.log(email, password);

  //2) Validate input: If either email or password is missing, return a 400 Bad Request error.
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  //3) Find user by email: This retrieves the user and their password (hidden by default in the model).
  const user = await User.findOne({ email }).select('+password');

  //4) Check if user exists and password is correct: Uses a method like ".correctPassword()" with bcrypt to compare the entered password with
  // the hashed password in the database.
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or passord', 401)); // 401 means unauthorized
  }

  //5) If everything is ok, send token to client
  const token = signToken(user._id);

  //
  res.status(200).json({
    status: 'success',
    token,
  });
});
// Ends here
