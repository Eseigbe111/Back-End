const express = require('express');
// Importing the userController
const userController = require('./../controllers/userController');
// Importing authController
const authController = require('../controllers/authController');

const router = express.Router();

// Creating a route for "/signup"
router.post('/signup', authController.signup); // To test this, we go to postman and send this POST "127.0.0.1:3000/api/v1/users/signup" and also set the body=> raw=> JSON

// Creating a route for "/login"
router.post('/login', authController.login); // This is only valid for post() bcos we want to send in the login credentials in the body

// Creating a route for forgot password
router.post('/forgotPassword', authController.forgotPassword); // This will receive only the email address

// Creating a route for reseting password
router.patch('/resetPassword/:token', authController.resetPassword); // This will receive the token as well as the new password

// Route for updating the user password without forgetting it
// We are using patch bcos we are manipulating the user data and not creating form the scratch
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);
// we used the "authController.protect" bcos this route is for already logged in users

// UPdating current user datai.e already logged in user
router.patch('/updateMe', authController.protect, userController.updateMe);
// we used the "authController.protect" bcos this route is for already logged in users

/// THIS IS FOR THIS LECTURE: Deleting the Current User
router.delete('/deleteMe', authController.protect, userController.deleteMe);
// we used the "authController.protect" bcos this route is for already logged in users

//Ends here

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
