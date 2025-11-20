const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

//THIS IS FOR THIS LECTURE
router.post('/signup', authController.signup);
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
