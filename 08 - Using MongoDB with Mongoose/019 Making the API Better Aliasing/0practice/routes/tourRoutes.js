const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// Param Route for Param MIDDLEWARE in tourController
// router.param('id', tourController.CheckID);

// THIS IS FOR THIS LECTURE:
// MAKING API BETTER ALIASING: A route for top-5-cheapw
// Aliasing means creating a shortcut or predefined route for a common query — so users (or you) don’t have to manually
// type long query strings every time. OR creating special or shortcut routes that make your API easier to navigate and use.

// Here we will be creating a route for the "/top-5-cheap" tours
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// Ends here

// These have no IDs
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

// These have IDs
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
