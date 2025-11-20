const express = require('express'); // Importing the express module here
//Importing the tourController
const tourController = require('./../controllers/tourController');
//Importing the authController
const authController = require('./../controllers/authController');

const router = express.Router();

/////
// Creating a route that will handle 5 cheapest tours.
router
  .route('/top-5-cheap') // I was confused bcos of this "/top-5-cheap" : So this works
  // bcos of  require('./routes/tourRoutes') and app.use('/api/v1/tours', tourRouter)
  .get(tourController.aliasTopTours, tourController.getAllTours);
// The reason for this middleware "aliasTopTours" is that we want to alter the response coming b4 it is called by
// "getAllTours"

//
// Creating a route that will handle getTourStats
// I was confused bcos of this "/tour-stats" : So this works
// bcos of  require('./routes/tourRoutes') and app.use('/api/v1/tours', tourRouter)
router.route('/tour-stats').get(tourController.getTourStats);

///
// Creating a route that will handle getMonthlyPlan:
// Now here, we want to be able to pass a year in the URL, so let'sus a URL parammeterjust like
//  "/monthly-plan/:year"
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/') // this is the same as '/api/v1/tours' bcos of the app.use('/api/v1/tours', tourRouter); MIDDLEWARE
  //  Protecting the routes
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour); // This is how u chain multiple MIDDLWARE Fc

router
  .route('/:id') // this is the same as '/api/v1/tours/:id' bcos of the app.use('/api/v1/tours', tourRouter); MIDDLEWARE
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  // THIS IS FOR THIS LECTURE: IMplementing Authorization to certain routes
  // If an administrator is trying to delete a tour, we must check if the user is logged in. So the 1st middleware in the
  // delete route should always be the protect one. After which we have authController.restrictTo(), which is what we are
  // interested in this lecture. Into this authController.restrictTo() fc, we will then pass sm user roles, which will be
  // authorized to interact with this resource i.e deleting a tour.
  // Let's add "admin" in our "userModel.js" bcos we will be querying for that in the authController.restrictTo()

  .delete(
    authController.protect,
    // So we want the "admin" to be able to delete tours and also delete guide.
    authController.restrictTo('admin', 'lead-guide'), //So here the "admin" and "lead-guide" have accesss to delete tours and guides
    // and not the normal user.
    tourController.deleteTour,
  );
//Ends here

module.exports = router;
