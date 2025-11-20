const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

// USERS HANDLERS
//// Fc for Handling getAllUsers
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // sending a response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

//// Fc for Handling createAllUsers
exports.createAllUsers = (req, res, next) => {
  // 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
//// Fc for Handling getUser
exports.getUser = (req, res, next) => {
  // 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
//// Fc for Handling updateUser
exports.updateUser = (req, res, next) => {
  // 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
//// Fc for Handling deleteUser
exports.deleteUser = (req, res, next) => {
  // 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
