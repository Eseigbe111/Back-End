const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Creating a route for "/signup"
router.post('/signup', authController.signup);

// Creating a route for "/login"
router.post('/login', authController.login);

// Creating a route for forgot password
router.post('/forgotPassword', authController.forgotPassword); // This will receive only the email address

// Creating a route for reset Password using the token
router.patch('/resetPassword/:token', authController.resetPassword); // This will receive only the email address

// Route for Updating the user password without forgetting it
// We are using patch bcos we are manipulating the user data and not creating form the scratch
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

// Route for updating current user data i.e already logged in user
router.patch('/updateMe', authController.protect, userController.updateMe);

// Route for Deleting current User "/deleteMe"
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// WERE ARE IMPLEMNTING USER ROUTES:
// These have no IDs
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createAllUsers);

// These have IDs
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
