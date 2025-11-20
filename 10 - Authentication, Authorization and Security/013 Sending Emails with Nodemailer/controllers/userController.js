const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

//// Fc for Handling getAllUsers
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

//// Fc for Handling createAllUsers
exports.createAllUsers = (req, res) => {
  // 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
//// Fc for Handling getUser
exports.getUser = (req, res) => {
  // 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
//// Fc for Handling updateUser
exports.updateUser = (req, res) => {
  // 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
//// Fc for Handling deleteUser
exports.deleteUser = (req, res) => {
  // 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
