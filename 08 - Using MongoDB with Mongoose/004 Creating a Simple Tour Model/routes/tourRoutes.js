const express = require('express'); // Importing the express module here

//Importing the tourController
const tourController = require('./../controllers/tourController');
const router = express.Router();

///////
/// Using the checkID imported
router.param('id', tourController.checkID);

/////

router
  .route('/') // this is the same as '/api/v1/tours' bcos of the app.use('/api/v1/tours', tourRouter); MIDDLEWARE
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour); // This is how u chain multiple MIDDLWARE Fc

router
  .route('/:id') // this is the same as '/api/v1/tours/:id' bcos of the app.use('/api/v1/tours', tourRouter); MIDDLEWARE
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
