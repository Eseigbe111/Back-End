// Impoting the built-in crypto package i.e no need to install anything
const crypto = require('crypto');

//Importing util which can be used for promisifying with thiis mthd promisify()
// const util = require('util'); //OR
const { promisify } = require('util');
// Importing JWT
const jwt = require('jsonwebtoken');

//Importing our userModel
const User = require('./../models/userModel');

//Importing the catchAsync() for handling errors: NOW we use the catchAsnc() to avoid trycatch block
const catchAsync = require('./../utils/catchAsync');

//Importing AppError
const AppError = require('./../utils/appError');

//Importing sendEmail
const sendEmail = require('./../utils/email');

//  Fc that creates a token
const signToken = (id) => {
  return jwt.sign(
    //1) The 1st thing is the payload: which is an object for all the data that we are going to store inside of the token, and
    // in this case, we really want the ID of the user, so nothing crazy, not alot of data
    { id },

    //smo=> someone
    //2) The secretOrPrivateKey : which is basically a string for our "secret"(which is just a placeholder).
    // 'secret',
    process.env.JWT_SECRET,

    //3) The next thing to do is to pass in sm Options: The optns i will pass is to specify when the JWT should expire.
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
};

// REfactoring response code for loging in user
const createSendToken = (user, statusCode, res) => {
  // To use JWT, we import it also on the top of our file:
  const token = signToken(user._id);

  //Sending the response
  res.status(statusCode).json({
    status: 'success',
    token, //sending the token to the client
    data: {
      user,
    },
  });
};

// Exporting our very 1st controller
exports.signup = catchAsync(async (req, res, next) => {
  // This just follows almost the same way we create a new doc based on a model just as we did our tour
  // const newUser = await User.create(req.body); // This will return a promise so we need to await it

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    //For testing actually
    // passwordChangedAt: req.body.passwordChangedAt,
    // role: req.body.role, // TEMPORARY for tutorial testing
    //End here
  });

  //Creating the JWT and sending the response by using the Refactored code
  createSendToken(newUser, 201, res);
});

//fclty=>functionality
//fcnl=> functional
//
exports.login = catchAsync(async (req, res, next) => {
  //1) The 1st thing we do is to actually read the email and the password from the body.
  const { email, password } = req.body;
  //2) CHECKS WE NEED TO DO
  //a) Check if email and password are inputted in their spaces.
  if (!email || !password) {
    // Sending error to the client when no inputted email or password
    return next(new AppError('Please provide email and password!', 400)); // 400 is for bad request
  }

  //b) Check if the user exists && password is correct
  //i)Getting the email and password
  // We did not use findById(), but findOne() bcos this time we're not selecting a user based on ID, but instead by email
  const user = await User.findOne({ email }).select('+password'); // This adds th password back so we can use it for comparism
  // since we hid the password, and we need it for the check here, we need to particular select it, hence the select()

  // console.log(user); // U'll see on terminal in vsc that we have the password back

  //ii) Checking if the user exists && password is correct
  // Now we want to use these two variables to figure out if the user exists and the password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or passord', 401)); // 401 means unauthorized
  }

  //c) If everything is ok, send token to client
  //Creating the JWT and sending the response by using the Refactored code
  createSendToken(user, 200, res);
});

//  A Middleware that protects our Routes
exports.protect = catchAsync(async (req, res, next) => {
  // So in this middleware we will:
  //1) Get the token and check if it's there i.e if it exists
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);

  // Checking if the token exists i.e a token is provided
  if (!token) {
    // We want to return from fc and give an error
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }

  //2) Verificatn of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // Promisify makes it return a promise, so it can work
  // asynchronously. So the we can await it
  console.log(decoded); // This is what is logged { id: '6899120f29080e170800c6ad', iat: 1754923792, exp: 1762699792 }

  //After this we go to the "errorController.js" to handle error that can be caused by manipulating the token. The fc of this error can only be
  // tested in prodn.

  //3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    // the below means return from this middleware and call the next() one with the error in it
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  //4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401),
    );
  }

  // GRANT ACCES TO PROTECTED ROUTE
  req.user = currentUser;
  // If all the above checks go well, only then can call the next() which then grants access to the user to the getAllTours() in our case
  next();
});

// In this video, we will be going to implement authorizatn.
exports.restrictTo = (...roles) => {
  // "...roles" will contain all the roles we want to pass which is an array

  /// This below is then the middleware fc
  return (req, res, next) => {
    //roles ['admin', 'lead-guide']
    //When do we give a user access to a certain guide? Well, basically, when its user role is inside of this array ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      // req.user is gotten from the above code   req.user = currentUser;
      return next(
        new AppError('You donot have permission to perform this action', 403), // 403 means forbidden
      );
    }

    next(); // This middleware is the route handler i.e tourController.deleteTour in our case
  };
};

// Password Reset Fclty
// Forget password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on posted email
  // we are uing this again bcos we are not using the iD bcos we dont know the users ID. And also the user doesn't know his own iD
  const user = await User.findOne({
    email: req.body.email,
  });

  // Verifying if user exists
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404)); // 404 is not found
  }

  //2)Generate the random reset token:
  const resetToken = user.createPasswordResetToken();

  // This is saving the doc
  await user.save({
    validateBeforeSave: false, // This will then deactivate all the validators that we specified in our schema
    // Without this "validateBeforeSave: false," and error will occur
  });

  //3) Send it to the user's email
  //Getting the reset URL
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`; // We will test this by using smth like this PATCH {{URL}}api/v1/users/resetPassword/433555
  // Now we are hard coding the the above which is not good and we will fix it later

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  // We used this trycatch block in case we get an error from Sendgrid itself. And if this happens we want to reset
  // the "token" i.e "PasswordResetToken" and the expires ppt i.e "passwordResetExpires"
  try {
    await sendEmail({
      email: user.email, // OR req.body.email
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    // Reseting these ppts
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({
      validateBeforeSave: false,
    }); // We do this to save it

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500,
    );
  }

  // After the above code, we can then try it in POstman. Watch the video to see how jonas did it
});

// Reset password
// And let's now finally create the last part of the Password Reset Fclty, where we actually set the new password for the user.
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on the token
  //a) Encrpting the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  // We are using this "req.params" bcos in our resetPassword route, we are taking a token as a param as seen router.patch('/resetPassword/:token', authController.resetPassword);

  //b) Getting the user now
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // "passwordResetToken: hashedToken" queries the user i.e finds the user with that token while "passwordResetExpires:{$gt: Date.now()}" checks if the password as expired

  //2) If token has not expired, and there is a user, set the new password
  //a) Checking if no user
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  //b) Setting the new password for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  // c) Deleting the passwordResetToken and passwordResetExpires
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  //d) Saving the doc
  // In this case, we don't need to turn off the validators, bcos indeed we want to validate e.g we want the validator to confirmif the password is equal to passwordConfirm
  await user.save();

  //3) Update the changedPasswordAt ppt for the current user
  //This part will be done in the userModel

  //4) Log the user in i.e send the JWT to the client
  //Creating the JWT and sending the response by using the Refactored code
  createSendToken(user, 200, res);

  /// To test this also, watch the video how jonas tested it
});

// Updating the Current User Password i.e Already logged in User
// So, over the last few videos, we allowed a user to reset his password, and then create a new one, but now we also want to allow a logged-in user to
// simply udate his password without having to forget it, and so without that whole reset process. So let's build that now.
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get user from collection
  // So remember that the update password is only for authenticated logged in users, and so we will already have the current user on our request object.
  // And this is coming from the protect middleware. And we also exclusively ask for the password bcos it is not defined in the output i.e by using "select()"
  const user = await User.findById(req.user.id).select('+password');

  //2) Check if the POSTed  current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    //We return an error if the password is not correct
    return next(new AppError('Your current password is wrong.', 401)); //401 is unauthorized
  }

  //3) If password is correct, then update the password
  // Now if password is correct, we update it
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // We do not turn off the validatn, bcos we want it to happen

  //4) Log user in i.e send the JWT back to the user now logged in with the new password that was just updatedd.
  //Creating the JWT and sending the response by using the Refactored code
  createSendToken(user, 200, res);

  //After this code we go to the "userRouter" to create the route for this

  // To test this also watch the video how jonas tested it
});
