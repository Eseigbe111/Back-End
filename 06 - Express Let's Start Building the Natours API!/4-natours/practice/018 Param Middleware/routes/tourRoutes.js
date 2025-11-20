const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// THIS SIS FOR THIS LECTURE
// Param Route for Param MIDDLEWARE in tourController
router.param('id', tourController.CheckID);
// Ends here
////

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
