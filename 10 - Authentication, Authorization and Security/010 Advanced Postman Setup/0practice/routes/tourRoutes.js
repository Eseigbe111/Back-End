const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

// Param Route for Param MIDDLEWARE in tourController
// router.param('id', tourController.CheckID);

//  A route for aliasTopTours() handler
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// A route for getTourStats() handler
router.route('/tour-stats').get(tourController.getTourStats);

// A route for getMonthlyPlan()
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// These have no IDs
router
  .route('/')
  // Allowing only logged in users to get access to all the tours
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

// These have IDs
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
