const express = require('express'); // Importing the express module here

//Importing the tourController
const tourController = require('./../controllers/tourController');
const router = express.Router();

///This is for this lecture
// In this video, let's create a special type of MIDDLEWARE called "param MIDDLEWARE".
// So param MIDDLEWARE is a MIDDLEWARE that only runs for certain parameters, so basically when we have a certain parameter in our URL.
// Now in our e.g, the only parameter that we might have in our route URL is the "id". Ans o we can now write a MIDDLEWARE that runs only
// when this "id" is present in the URL. And so let me show u how to do it.

//The 1st parameter i that we want to search for i.e parameter for which this MIDDLEWARE is going to run for.And 2ndly our actual MIDDLEWARE fc.
//Now in a param fc, we uasually get access to a 4th argument called the "value of the parameter in qtn"(in our case the value is the "id" in qtn)
// router.param('id', (req, res, next, val) => {
//   console.log(`Tour id is:${val}`);
//   next(); // calling the nect() bcos it is a MIDDLEWARE fc
// });
// Now this MIDDLEWARE fc is not going to run for any of the users routes: Watch the Video so this illustration will be clear. So let's say
// we specified an id for the user in our POstman app and sen the request i.e "127.0.0.1:3000/api/v1/users/3", we get our standard response
// on the Postman app, but will we see in our vsc terminal that there is no log. This is bcos the MIDDLEWARE fc is only specified in our tour
// router, in this kind of local mini application.

// To see a real use case of the param MIDDLEWARE we can go into the "tourController.js" since we have "ids" there to test and see how it works.=> over to the file

////////////
/// Using the checkID imported
router.param('id', tourController.checkID);

/////
router
  .route('/') // this is the same as '/api/v1/tours' bcos of the app.use('/api/v1/tours', tourRouter); MIDDLEWARE
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id') // this is the same as '/api/v1/tours/:id' bcos of the app.use('/api/v1/tours', tourRouter); MIDDLEWARE
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
