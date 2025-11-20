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

// Exporting our very 1st controller
exports.signup = catchAsync(async (req, res, next) => {
  // This just follows almost the same way we create a new doc based on a model just as we did our tour
  // const newUser = await User.create(req.body); // This will return a promise so we need to await it

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // THIS IS FOR THIS LECTURE: For testing actually
    passwordChangedAt: req.body.passwordChangedAt,
    // Ends here
  });

  //Creating the JWT
  // To use JWT, we import it also on the top of our file:
  const token = signToken(newUser._id);

  // we use 201 for created
  res.status(201).json({
    status: 'success',
    token, //sending the token to the client
    data: {
      user: newUser,
    },
  });
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
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
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

  // smo=> someone
  // THIS IS FOR THIS LECTURE: Let's continue where wwe stopped

  //2) Verificatn of token
  // In this step, we verify if smo manipulated the data or also if the token has already expired. So we already used from the jwt package
  // the "sign()", and now we're gonna use the verify() fc.
  // This requires the "secret"(i.e JWT_SECRET) which we saved in our config file. Also as a 3rd argument is a callback() that runs after
  // verificatn is complete and this is the fc "(token, process.env.JWT_SECRET)" we just called there

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // Promisify makes it return a promise, so it can work
  // asynchronously. So the we can await it
  console.log(decoded); // This is what is logged { id: '6899120f29080e170800c6ad', iat: 1754923792, exp: 1762699792 }

  //After this we go to the "errorController.js" to handle error that can be caused by manipulating the token. The fc of this error can only be
  // tested in prodn.

  //3) Check if user still exists
  // If the user has been deleted in the main time, the token will still exist, but if the user is no longer existent, well then we actually
  // don't want to log him on.
  // To test this create a new user and copy the token and then delete the user from the atlas database and then send response to get all users
  // to see how it handles the error
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
  // If the user have changed his password after the token has been issued, so the token that was issued b4 the password was changed should no
  // longer be valid. So it should not be accepted to access protected routes.

  // To implement this, we will need to create an instance mthd again which will be available to all the docs or instances of a model. And we do
  // this bcos it's quite a lot of code that we need for this verificatn. And so we will write this code in the user model and not in the "authController".
  // The instance mthd willbe called "changedPasswordAfter()". So we will call the mthd below after creatn in the userModel.js.
  // To test this we need to sign up a user having the "passwordChangedAt : to a date like 2025-08-10" ppt
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

//Ends here
