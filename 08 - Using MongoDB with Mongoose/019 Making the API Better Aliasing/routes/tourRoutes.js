const express = require('express'); // Importing the express module here

//Importing the tourController
const tourController = require('./../controllers/tourController');
const router = express.Router();

///////
/// Using the checkID imported
// router.param('id', tourController.checkID);

/////
/// THIS IS FOR THIS LECTURE
// Creating a route that will handle 5 cheapest tours.
//How are we gonna implement this fclty? Well in essence, what we want is to actually still get all tours. But
// b4 we can call this route handler, we basically want to prefill sm of the fields in the query string just as
// we have in the string in the Postman which will be usd to write the logic "127.0.0.1:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price"
// i.e these fields "limit=5&sort=-ratingsAverage,price"(we can add others but we are working on just this). And
// so the soln is gonna be to run a middleware, b4 we actually run the "getAllTours" handler in this new route.
// And so the middleware optn is then gonna manipulate the query object that's coming in.
// So let's add this part "tourController.aliasTopTours", where is the middleware
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
// The reason for this middleware "aliasTopTours" is that we want to alter the response coming b4 it is called by
// "getAllTours"

//Ends here

router
  .route('/') // this is the same as '/api/v1/tours' bcos of the app.use('/api/v1/tours', tourRouter); MIDDLEWARE
  .get(tourController.getAllTours)
  .post(tourController.createTour); // This is how u chain multiple MIDDLWARE Fc

router
  .route('/:id') // this is the same as '/api/v1/tours/:id' bcos of the app.use('/api/v1/tours', tourRouter); MIDDLEWARE
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
