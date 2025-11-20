const express = require('express');
// Importing the userController
const userController = require('./../controllers/userController');
// Importing authController
const authController = require('../controllers/authController');

const router = express.Router();

// Creating a route for "/signup"
router.post('/signup', authController.signup); // To test this, we go to postman and send this POST "127.0.0.1:3000/api/v1/users/signup" and also set the body=> raw=> JSON

//THIS IS FOR THIS LECTURE: Creating a route for "/login"
router.post('/login', authController.login); // This is only valid for post() bcos we want to send in the login credentials in the body
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
