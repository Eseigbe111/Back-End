const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

// filterObj fc
const filterObj = (obj, ...allowedFields) => {
  //where obj is req.body and allowedFields is "name" and "email"
  // 1) And empty object to push the allowedFields to
  const newObj = {};
  // console.log(Object.keys(obj));

  // 2) Getting the keys of the allowedFields and pushing them to newObj
  Object.keys(obj).forEach((el) => {
    // 3) This checks if current field "el" is allowed. That is only when we can push it
    // to newObj
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

/////////

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

/////////////
// UPDATING CURRENT USER DATA i.e Already logged in user
// The goal of this fc is that: It allows a logged-in user to update ONLY: ✔ name and ✔ email
exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.body);
  // 1) If the user tries to update password fields here → block it
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  // 2) Filter the request body → allow only 'name' and 'email' to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update the user document using MongoDB's findByIdAndUpdate()
  // We cannot use user.save() because it requires all required fields.
  // So instead we use findByIdAndUpdate(), since we are NOT updating the password.
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id, // ID of the logged-in user
    filteredBody, // Only allowed fields
    {
      new: true, // Return the updated document
      runValidators: true, // Validate the update using Mongoose validators
    },
  );

  // 4) Send response containing the updated user data
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

////////////////
// THIS IS FOR THIS LECTURE
exports.deleteMe = catchAsync(async (req, res, next) => {
  // 1) Set the user's account to inactive instead of deleting it:
  // We do NOT remove the user from the database. Instead, we set a field "active": false for soft-delete.
  await User.findByIdAndUpdate(req.user.id, { active: false });
  // req.user.id comes from the protect middleware (meaning the user is logged in).

  //204 is for deleted
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
// Ends here
// ///////

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
