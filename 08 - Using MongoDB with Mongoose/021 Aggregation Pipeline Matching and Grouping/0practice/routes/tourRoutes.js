const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// Param Route for Param MIDDLEWARE in tourController
// router.param('id', tourController.CheckID);

//  A route for aliasTopTours() handler
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

//THIS IS FOR THIS LECTURE
// A route for getTourStats() handler
router.route('/tour-stats').get(tourController.getTourStats);
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
