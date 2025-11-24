const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

const AppError = require('./../utils/appError');

// filterObj() fc
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  //we loop thru all the fields that are in the obj and then for each field, we check if it's one of the allowed fields. And if it is, we then create a new
  // field in the newObj, with the same name, with the same value as it has in the original object
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

// UPdating current user datai.e alredy logged in user
exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user POSTs password data i.e tries to update the password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  //2) If not, update user doc
  //i) Filtering out unwanted names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // These are the only ppts we want to keep for now and exempt all the others ncos they are the two ppts we need to update users data for now

  //ii) Update user doc
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    //where "" is the data to be updated and not the body so that not very one can get acess to the req.body
    {
      new: true, //"new: true"(so it can return the new updated object)
      runValidators: true, //"runValidators:true" bcos we want the models to validate our doc e.g if we put in an invalid email address, that should be catched
      // by the Validator and return an error.
    },
  );

  ///
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });

  // We test this code by watching th e video of jonas
});
// smw=> somewhere
///  Deleting the Current User
// To implement this, we need to create a ppt called "active" in our "userSchema", which is in the "userModel"
exports.deleteMe = catchAsync(async (req, res, next) => {
  //1) This is for logged in users:  We change active to false
  await User.findByIdAndUpdate(req.user.id, { active: false });
  // The object contains the data we want to update which is active which we set to false

  //2) Making the user not visible when we get All users but still in the database.
  // This part will be done in our "userModel"

  //204 is for deleted
  res.status(204).json({
    status: 'success',
    data: null,
  });

  // After the above, we will need to create a route for this in "userRoute"

  // Also we will need to watch how jonas did it  from the video
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
//
//// Fc for Handling deleteUser
exports.deleteUser = (req, res) => {
  // 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
