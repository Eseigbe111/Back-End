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
  // IMPLEMENTING AUTHORIZATION USEER ROLES AND PERMISSIONS
  .delete(
    // To delete a tour, we only want Admins and lead guides to be a ble to perform that i.e 'lead-guide', 'admin' as they are in our userModel
    authController.protect,
    // To delete a tour, either of the former must be logged in, and also deleting can only be performed be done by 'lead-guide', 'admin'.
    // Hence will be restrictd to only both
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
