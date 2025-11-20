const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// Param Route for Param MIDDLEWARE in tourController
// router.param('id', tourController.CheckID);

//  A route for top-5-cheapw
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);



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
