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
    // THIS IS FOR THIS LECTURE:For testing actually
    // passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role, // TEMPORARY for tutorial testing
    //End here
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

// THIS IS FOR THIS LECTURE : To test this watch the video at which he was testing it
// In this video, we will be going to implement authorizatn.
// So imagine the act of deleting a tour from our database. So not every user should be allowed to do that, even if the user is logged in.
// So we basically need to authorize only certain types of users to perform certain actions. And so that's exactly what authorizatn is. It's
// verifying if a ccertain user has the rights to interact with a certain resource, even if he is logged in. And this is a common scenario
// that should be implemented in each and every web applicatn basically.
// So we're gonna build another middleware fc, this time to restrict certain routes, for e.g deleting tours should be available to only certain
// user roles.

// Now let's delete the initial stuff in our database and create new ones like the below:
/* 
{
    "name": "jonas",
    "email": "hello@jonas.io",
    "password": "pass1234",
    "passwordConfirm": "pass1234"
}

and 

{
    "name": "admin",
    "email": "admin@jonas.io",
    "password": "pass1234",
    "passwordConfirm": "pass1234",
    "role": "admin"
}

*/
// Now, how do we actually implement this? bcos usually, we cannot pss arquments into a middleware fc, but in this case we really want to. We want to
// pass in the roles, to who are allowed to access the resource, in our case "admin" and "lead-guide". So we need a way of basically passing in arguments
// into the middleware fc in a way that usually does not work. So how are we going to do that? Well, in here, we will actually create like a wrapper fc,
// which will then return the middleware fc that we actually want to create.
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
