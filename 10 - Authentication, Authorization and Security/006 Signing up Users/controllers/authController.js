// Importing JWT
const jwt = require('jsonwebtoken');

//Importing our userModel
const User = require('../models/userModel');

//Importing the catchAsync() for handling errors
const catchAsync = require('../utils/catchAsync');

// THIS IS FOR THIS SECTION
// So previously, we already implemented a simple signup fclty, but in this lecture, we will actually also log the user in making it
// a more real signup process. So starting from this lecture, we will really start to implement our authentication, and so this is where
// it gets really serious. And so b4 we start, i want to give u a warning here, so authentication is very hard to get right and many
// tutorials out there that u're gonna find when u search for authentication with like Nodejs and Express, many of these make many serious
// mistakes and over simplify things that should not be simplified. This is not to sat that all tutorials out there are bad, or that
// they useless or smth, but i really spent weeks researching all the best practices and refining and improving my code, to make this
// authentication section that we are gonna start implementing now ae good as possible, for beginner like u, and that is bcos we need
// to be really really and extra careful when writing this part of the application, bcos remember, our user's data is at stake here,
// and the trust in the company who runs the applicatn, is at stake as well, and so implementing authentication is a real responsibility
// where u should not make any mistakes at all.

// Now there are sm libraries out there that can help us implement authenticatn and authorizatn and the most well known one ia called
// "Passport", but even a library like that doesn't take all the work and all the responsibility away from you.
// Now in our case, we are actually gonna implement the whole login protecting and authorization logic all by ourselves, except of
// course for the "Json Web Token"(JWT) implementation that we talked about in the last video itself. so all the signing and verificatn
// will be left to JWT library but then the rest,we're gonna implement ourseleves for the next couple of lectures.

// Exporting our very 1st controller
exports.signup = catchAsync(async (req, res, next) => {
  // This just follows almost the same way we create a new doc based on a model just as we did our tour
  // const newUser = await User.create(req.body); // This will return a promise so we need to await it

  // THIS IS FOR THIS SECTION: To test this token we use a real email this time and also create a newUser in POstman
  // So previously, we already implemented a simple signup fclty, but in this lecture, we will actually also log the user in making it
  // a more real signup process. So starting from this lecture, we will really start to implement our authentication, and so this is where
  // it gets really serious. And so b4 we start, i want to give u a warning here, so authentication is very hard to get right and many
  // tutorials out there that u're gonna find when u search for authentication with like Nodejs and Express, many of these make many serious
  // mistakes and over simplify things that should not be simplified. This is not to sat that all tutorials out there are bad, or that
  // they useless or smth, but i really spent weeks researching all the best practices and refining and improving my code, to make this
  // authentication section that we are gonna start implementing now ae good as possible, for beginner like u, and that is bcos we need
  // to be really really and extra careful when writing this part of the application, bcos remember, our user's data is at stake here,
  // and the trust in the company who runs the applicatn, is at stake as well, and so implementing authentication is a real responsibility
  // where u should not make any mistakes at all.

  // Now there are sm libraries out there that can help us implement authenticatn and authorizatn and the most well known one is called
  // "Passport", but even a library like that doesn't take all the work and all the responsibility away from you.
  // Now in our case, we are actually gonna implement the whole login protecting and authorization logic all by ourselves, except of
  // course for the "Json Web Token"(JWT) implementation that we talked about in the last video itself. so all the signing and verificatn
  // will be left to JWT library but then the rest,we're gonna implement ourseleves for the next couple of lectures.

  // Now as i mentioned earlier, we already have our signup() fc in the "authController.js", but all it does now is o simply create a new user
  // and then send it back to the client.Now shortly after recording this course, i actually noticed that there is a very serious securtiy flaw
  // in this way of signing up users. The prob is that right now, we create a new user using all the data that is coming in with the body
  // and so the prob here is that like this "await User.create(req.body);", anyone can specify the role as an admin. So basically, everyone
  // can now simply register as an admin into our application and that, of course is not what we need. And ths leads to a serious security
  // flaw and we'll of course need to fix that. So to fix it is to replace it with the below:
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // The diff btw this above nd the initial "await User.create(req.body);" is that we only allow the data that we actually need to be put into
  // the new user so just a name, the e-mail and then the passwords. And so now, even if a user tries to manually input a role, we will not store
  // that into the new user, and the same for other stuff like for e.g, a photo. So this is the quick fix for that problem. Now what tis will do
  // is that we can actually no longer resgister as an admin, and so if we need to add a new administrator to our sys, we  can then very simply
  // just create a new user normally and then go into MongoDB Compass, and basically edit that role in there. So edit it from user to admin manually.
  // Of course we can define a specaill route for just creating admins, but that will be a bit too much.

  // Usually when we sign up for any web applicatn, then u also get automatically logged in and so let's quickly implement that here. And remember
  // from the prev lecture, how that works. Well all we really need to do, is to sign a "JWT"(Json Web Token), and then send it back to the user.
  // B4 ding that let's now 1st install the npm package that we're gonna use for everything related to JWT by doing: "npm i jsonwebtoken". B4 we
  // actually use it, let's take a look at it it Github just to see the documentation.

  // Now from the documentation, the 1st mthd we will use with the JWT is the "sign()" so in order to bsically create a new token, and for that of
  // course we need the "payload", secretOrPrivateKey, [options, callback]. we also have a ton of fcs also like the "verify()", which we will use
  // when logging in.

  //Creating the JWT
  // To use JWT, we import it also on the top of our file:
  const token = jwt.sign(
    //1) The 1st thing is the payload: which is an object for all the data that we are going to store inside of the token, and
    // in this case, we really want the ID of the user, so nothing crazy, not alot of data
    { id: newUser._id },

    //smo=> someone
    //2) The secretOrPrivateKey : which is basically a string for our "secret"(which is just a placeholder).
    // 'secret',
    process.env.JWT_SECRET,
    // The config.env file is actually a perfect place to store the "secret data" just like our "DATABASE_PASSWORD". So let's add this "JWT_SECRET="
    // to our config file.
    // NB: Now using the standard "hsa256" encryptn for the signature, the "secret" should at least be 32 chars long, but the longer the better actually
    // and this us where many tutorials out there fail, sm of them put a very short string in "JWT_SECRET=", but it's not ideal. So for the best encryptn
    // of the signature, u should atleast use 32 chars. So i'm gonna create my "secret" like this "" but pls don't use the same one as i am doing bcos
    // that could bcom a security issue for ur applicatn. Always use a unique "secret" for ur applicatns and never the same, and especially not the one
    // from smo else, so definitely not the one that i'm typing now.

    //3) The next thing to do is to pass in sm Options: The optns i will pass is to specify when the JWT should expire. This means after the time it's
    //gonna pass in here "process.env.JWT_SECRET", the JWT is no longer gonna be valid, even if it otherwise would be correctly verified. So this is
    // basically for logging out the user after a certain period of time simply as a security measure. So let's actually define that expiratn time also
    // in as a config variable like this "JWT_EXPIRES_IN=90d",and the signing algorithm will then automatically figure out that this means 90days. U
    // could also use 10hrs, 5min oor 3secs etc.
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  // we use 201 for created
  res.status(201).json({
    status: 'success',
    token, //sending the token to the client
    data: {
      user: newUser,
    },

    // Finally, what i want to show u the is the JWT debugger, that i showed u as a screenshot earlier in the last
    // video. So let's go a head and copy our token in the response and go to "jwt.io".In there as we scroll down,
    // we will see the debugger. So we will paste our token there.
    //Delete anything u see in this space "Enter a secret to verify the JWT signature.", so to avoid saying invalid token.
    // Then u can paste ur token there

    // Ends here
  });
});

// So remember this is an async fc and we need to handle the error. So we need to wrap this fc in our catchAsync()
// that we created in the last section. We then need to implement the Route so that the 'signup()' handler can then
// get called. To do this let's go to our "userRoute.js"
