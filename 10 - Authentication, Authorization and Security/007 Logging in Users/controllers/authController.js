// Importing JWT
const jwt = require('jsonwebtoken');

//Importing our userModel
const User = require('./../models/userModel');

//Importing the catchAsync() for handling errors: NOW we use the catchAsnc() to avoid trycatch block
const catchAsync = require('./../utils/catchAsync');

//Importing AppError
const AppError = require('./../utils/appError');

//THIS IS FOR THIS LECTURE: Fc that creates a token
// We created this fc bcos we will use it in more than one places
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
//Ends here

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

// THIS IS FOR THIS LECTURE:
// So in this lecture, we're gonna implement the fclty of logging users in based on a given password and email address. And just
// like b4, the concept of logging a user in basically means ro sign a JSON web token and send it back to the client. But in this
//case we only issue the token in case the user actually exists, and the password is correct. SO let's start to implement that.

//
exports.login = catchAsync(async (req, res, next) => {
  //1) The 1st thing we do is to actually read the email and the password from the body.
  const { email, password } = req.body;
  //2) CHECKS WE NEED TO DO
  //a) Check if email and password are inputted in their spaces.
  if (!email || !password) {
    //We want to send an error message to the client. To do that we will need to use the tool that we implemented in the last section
    // i.e the AppError. So we will simply create a new error here and our global error handling middleware will then pick it and
    // send that error back to the client. So let's import AppError to use it and do the below the way we have been doing it:
    return next(new AppError('Please provide email and password!', 400)); // 400 is for bad request

    //During this part we we made our password to be hidden by addding "select: false"in ur userModel bcos even if the password is
    //encrypted, it should be hidden or not seen and bcos of this, we implemented or made fcnl the "getAllUsers Route" by creating the
    // "getAllUsers()" so that we will see if when getting all users the password shows.
    // After everything its working well and password is also hidden in the output.
  }

  //b) Check if the user exists && password is correct
  //i)Getting the email and password
  // We did not use findById(), but findOne() bcos this time we're not selecting a user based on ID, but instead by email
  // const user = User.findOne({email:email}); // OR
  const user = await User.findOne({ email }).select('+password'); // This adds th password back so we can use it for comparism
  // since we hid the password, and we need it for the check here, we need to particular select it, hence the select()

  console.log(user); // U'll see on terminal in vsc that we have the password back

  //ii) Comparing password:
  //Its time to compare the password the user enters with the one in the database.
  //Now how do we do that? seeing that the password we entered is "pass1234" and that in the database that we logged to the console s '$2b$12$47RYeF3T8Qhect2B8RvpWuNlbaSgeIJMo6CWISwKAvqd/fsWoM7NK'
  // So what we can do is again to use the "bcrypt" package to compare. So we used bycript to generate this hash password,
  // and we can also use the same package to basically compare an original password like this 'pass1234' with the hashed
  // password. Of course this password '$2b$12$47RYeF3T8Qhect2B8RvpWuNlbaSgeIJMo6CWISwKAvqd/fsWoM7NK', since its encrypted
  // there is no way of getting back the old i.e the original password fromthis string '$2b$12$47RYeF3T8Qhect2B8RvpWuNlbaSgeIJMo6CWISwKAvqd/fsWoM7NK',
  // which is the main purpose of encrypting a password.
  // And so the only way of doing it is for this package i.e bcrypt to encrypt this password "pass1234" as well, and then
  // compare it with the encrypted one. So let's implement a fc called "correctPassword" that will do that and we will do
  //  that in the "usermodel". We are doing this in the "userModel" bcos it is related to the data itself, and also we
  // already have that package in there, and so it's easier to simply do it there.

  // Now the fc "correctPassword" that we just defined in the schema  is an instance mthd, which means it is available on
  // all the user docs, jsut like the "user"
  // const correct = await user.correctPassword(password, user.password);
  // We commented out the bcos if the "user" does not exist then this line of code can not really run const correct = await user.correctPassword(password, user.password);
  // so we moved it below to the if else statement.

  //iii) Checking if the user exists && password is correct
  // Now we want to use these two variables to figure out if the user exists and the password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or passord', 401)); // 401 means unauthorized
  }
  // Now the above if statement, we could have checked if the user existed and check if the passsword is correct separately
  // also, but this will give a potential attacker informatn whether the email or passwod is incorrect. But with the above
  // way, its a bit more vague, so it will not be easily detected which is wrong.

  //c) If everything is ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
  // As we work on this part we also create the Route bcos we need a path for it to work.
  // To test this use POST 127.0.0.1:3000/api/v1/users/login and also create a simple body like
  // this {"email": "hello@jonas.io"} or { "password": "pass1234" } or {"email": "hello@jonas.io", "password": "pass1234"  }
  // to see the error it will give and also how it logs in when email and password are correct
});
//Ends here
