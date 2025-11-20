//Importing our userModel
const User = require('../models/userModel');

//Importing the catchAsync() for handling errors
const catchAsync = require('../utils/catchAsync');

// Exporting our very 1st controller
// U can see that i am not calling it create user as we had in out tour controller, but really i'm calling it signup bcos
// that's the name that has a bit more meaning in the contect of authenticatn
exports.signup = catchAsync(async (req, res, next) => {
  // This just follows almost the same way we create a new doc based on a model just as we did our tour
  const newUser = await User.create(req.body); // This will return a promise so we need to await it

  // we use 201 for created
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

// So remember this is an async fc and we need to handle the error. So we need to wrap this fc in our catchAsync()
// that we created in the last section. We then need to implement the Route so that the 'signup()' handler can then
// get called. To do this let's go to our "userRoute.js"
