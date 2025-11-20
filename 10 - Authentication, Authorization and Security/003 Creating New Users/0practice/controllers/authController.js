// THIS IS FOR THIS PART

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

  //Sending a response of 201 for created
  res.status(201).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});

// Ends here
