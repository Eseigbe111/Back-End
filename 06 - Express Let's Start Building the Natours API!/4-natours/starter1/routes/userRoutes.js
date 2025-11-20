const express = require('express');
// Importing the userController
const userController = require('./../controllers/userController');

const router = express.Router();

//I was the one that did not use the '.' notation i.e doing "userController.getAllUsers, userController.createAllUsers" etc
// bcos i wanted to see how object destructuring will work
const {
  getAllUsers,
  createAllUsers,
  getUser,
  updateUser,
  deleteUser
} = userController;

router
  .route('/')
  .get(getAllUsers)
  .post(createAllUsers);

router
  .route('/:id') // This means we wan to get just one user
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
