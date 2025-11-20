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

  console.log(user); // U'll see on terminal in vsc that we have the password back

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

// THIS IS FOR THIS LECTURE : A Middleware that protects our Routes
// So far in out authenticatn implementation, we have logger users in with a correct password. So basically we completed the first step of
// the authenticatn workflow where a JSON web token is created and sent back to the client if the user provides a correct email and password.
// So next up we will actually implement protected Routes. So basically using the created JSON web token in order to give logged in users
// access to protected routes. And this is the 2nd step of authenticatn. And so let'snow go ahead and implement this fclty.

// So let's that we wanted to protect the getAllTours route. So basically only allowing logged in users to get access to a list of all our
// tours. And what that means is that b4 running the getAllTours() handler, we will need to have sm check in place in order to verify if the
// user is actually logged in or not. And so the best way of doing that asu already know at this pt probably, is to use a middleware fc. So
// in this video, in order to protect routes, we're gonna create a middleware fc which is gonna run b4 each of these handlers i.e getAllTours(),
// createTour() etc. And this middleware will then either return an error if the user is not authenticated i.e is not logged in, or it will call
// the next() middleware which is in this case the getAllTours() handler. And that then effectively protects this route getAllTours() from
// unauthorized access. So let's go ahead to create the middleware fc and call it b4 getAllTours() to illustrate what i just said.
exports.protect = catchAsync(async (req, res, next) => {
  // So in this middleware we will:
  //1) Get the token and check if it's there i.e if it exists
  // A common practice is to send a token using an http header with the request. So let's take a look at how we can set headers in Postman to
  // send then along with the request and then also how we can get access to these headers in Express. Son now let's go over to app.js, and log
  // this "console.log(req.headers);" under "2nd middleware fc". After this, we go to Postman => Get All Tours => Headers "KEY=> test-header   VALUE=>jonas",
  // then we send.
  // Then we can take a look at our log on vsc. And so indeed we get an object with all of the headers that are part of the request. So what we
  // are interested in is the header we set ourselves, i.e 'test-header': 'jonas' inour request. Now to send a JSON web token as aheader, there's
  // actually A standard for doing that which is to always use " A header called Authorizatn" i.e KEY and the VALUE should always start with
  // "Bearer token", bcos we bear or poccess this token and then the value of the token.
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);

  // Checking if the token exists i.e a token is provided
  if (!token) {
    // We want to return from fc and give an error
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }
  //2) Verificatn of token

  //3) Check if user still exists

  //4) Check if user changed password after the token was issued

  // If all the above checks go well, only then can call the next() which then grants access to the user to the getAllTours() in our case
  next();
});
