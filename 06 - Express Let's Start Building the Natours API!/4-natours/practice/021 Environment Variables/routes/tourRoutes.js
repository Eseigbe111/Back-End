const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// Param Route for Param MIDDLEWARE in tourController
router.param('id', tourController.CheckID);

// These have no IDs
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.CheckBody, tourController.createTour);

// These have IDs
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
