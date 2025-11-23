const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
// THIS IS FOR THIS LECTURE
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

//Ends

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

// THIS IS FOR THIS LECTURE : UPdating current user data i.e already logged in user
// In this lecture, we will allow the currently logged in user to manipulate his user data. And now by implementing user updates we are leaving the domain of
// authentication and are moving more to real user related stuff. And so instead of using the authenticatn controller i.e "authController", let's implement this
// updating fclty right in the "userController".
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
  // Now we could try to do it with user.save() as we usually do i.e getting the user, thenupdating the ppts, and then saving the doc. But the prob with
  // that is that there are sm fields that are required which we're not updating and then bcos of that we will get sm error. And so just to quickly demon-
  // strate it to u let's see the below code:

  // const user = await User.findById(req.user.id);
  // user.name = 'Jonas';
  // await user.save();

  // So let's  test the above code to see the error. Now we got an error saying pls confirm ur password bcos password is one of the required field. This is
  // the reason i said we can not use the mthd as we used initially. But what we can do is to use "findByIdAndUpdate()". We could not use this mthd  bcos of
  // all the reasons i explained b4. But now we are not dealing with password, but only with this non-sensitive data like name or email, we can now use the
  // "findByIdAndUpdate()"

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

// Ends here

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
