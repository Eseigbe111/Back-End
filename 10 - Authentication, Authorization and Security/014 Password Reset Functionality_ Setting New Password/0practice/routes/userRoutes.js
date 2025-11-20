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

// THIS IS FOR THIS LECTURE
// Creating a route for reset Password using the token
router.patch('/resetPassword/:token', authController.resetPassword); // This will receive only the email address
// Ends here

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
