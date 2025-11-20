// const util = require('util'); //OR
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

// Handling the signup()
exports.signup = catchAsync(async (req, res, next) => {
  // Creating name, email,password and passwordConfirm onthe  req.body

  const { name, email, password, passwordConfirm /* role */ } = req.body;

  // creating a new user
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,

    /* role, */
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

///////////////
// MIDDLEWARE THAT PROTECTS ROUTES: Watch how jonas did and tested this part if confused
// After implementing login and generating a JWT for users with the correct email and password, the next step in authentication
// is protecting routes.This ensures that only logged-in users (those who have a valid JWT) can access certain endpoints.
// To do this, we create a middleware function called protect that runs before the route handler (e.g., getAllTours). This
// middleware verifies whether the incoming request contains a valid JSON Web Token.
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  //1) Checking if req.headers.authorization exists and if it starts with
  if (
    // I changed this "req.headers.authorization?.startsWith('Bearer')" bsck to the below bcos it stopped giving
    // color to await or return
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //2) Extracts the token
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);
  // 3) If no token exists → deny access: It immediately throws a 401 error
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }

  // 4) Token verification: Validate the token using jwt.verify.
  // Use jwt.verify() to check if the token is valid, not expired, and not tampered with.
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // promisify() is used so we can await the verification.
  console.log(decoded);

  // 5) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  // 6) Check if the user changed their password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401),
    );
  }
  // 7) Grant Access To Protect Route
  req.user = currentUser;
  // 8) If all checks pass → allow access: Calls next() and the actual route handler runs (e.g., getAllTours).
  next();
});

// THIS IS FOR THIS LECTURE
// AUTHORIZATION USER ROLES AND PERMISSIONS: We deleted all the users bcos we want to create users based on roles
// The below is a wrapper fc. The goal of this fc is to allow only users with specific roles to delete tours
exports.restrictTo = (...roles) => {
  // This takes an array of all the roles

  //THis is the middleware
  return (req, res, next) => {
    //roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};
// Ends here
