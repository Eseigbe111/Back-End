const express = require('express');
// Importing the userController
const userController = require('./../controllers/userController');
// Importing authController
const authController = require('../controllers/authController');

const router = express.Router();

// THIS IS FOR THIS LECTURE
// Now i am gonna create a new route here. And as i mentioned right in the beginning of this video that the user resource is a bit dift
// from all the other resources bcos it has to do with all things authentication. And so we have a difft controller for that, so the authController,
// the fc names also have sm dift name, and so we will actually also have a special route.
// Creating a routes for "/signup"
router.post('/signup', authController.signup); // To test this, we go to postman and send this POST "127.0.0.1:3000/api/v1/users/signup" and also set the body=> raw=> JSON
// So as u see the signup is really kind of a special endpoint. It doesn't fit the REST architecture that we talked about b4 bcos in this
//case it doesn't make much sense. And so remember how we said that in sm special cases we of course can create other endpoints that do not
// 100% fit that REST philosophy that is basically implemented in the below routers i.e:
// router.route('/').get(userController.getAllUsers).post(userController.createAllUsers); or router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);.
// So these follows the REST philosophy, where the name of the URL has nothing to do with the action that is actually performed. While in "router.post('/signup', authController.signup);",
// of course, it has to. So the name of the route is "signup" bcos we are signing up users. And also, we have implemented dift HTTP in the below
// routes but in "router.post('/signup', authController.signup);", we only really need "POST()". So we can not really get data from signup, or
// we cannot PATCH() a singup i.e not update it. It doesn't really make sense, and so in this case all we want to do is to have a route for signup,
// where we can only POST() data, bcos again it only makes sense to send data to this route so that a new user can be created. And we will
// have dift route similar to this one like for login, or for reset password, and all kinds of stuff like that.

// Now we will also keep these routes below(the ones in a more REST format) bcos there is also the possibility of a sys. "Administrator" updating or
// deleting or getting all the users based on their ID. But we will take care of that later, for now we just want to implement all the fcs that
// are about authentication i.e fcs that are basically only relevant for the user itself. So it is not an Admin(Administrator) that wil sign up
// a user, or it's not an admin that's gonna login a user, but instead, it's the own user that's gonna sign up himself, or log in himself.

/// Ends here

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createAllUsers);

router
  .route('/:id') // This means we wan to get just one user
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
