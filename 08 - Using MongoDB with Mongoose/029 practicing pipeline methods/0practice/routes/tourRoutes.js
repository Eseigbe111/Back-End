const express = require('express');
const practicingInTourController = require('../controllers/practicingInTourController');

const router = express.Router();

//  A route for top-5-cheap
router
  .route('/top-5-cheap')
  .get(
    practicingInTourController.aliasTopTours,
    practicingInTourController.getAllTours,
  );

//A route for getTourStats()
router.route('/tour-stats').get(practicingInTourController.getTourStats);

// A route for getTourStats1()
router.route('/tour-stats1').get(practicingInTourController.getTourStats1);

// A route for getTourStats2()
router.route('/tour-stats2').get(practicingInTourController.getTourStats2);

// A route for getMonthlyPlan()
router
  .route('/monthly-plan/:year')
  .get(practicingInTourController.getMonthlyPlan);

// A route for getMonthlyRevenue()
router
  .route('/monthly-revenue/:year')
  .get(practicingInTourController.getMonthlyRevenue);

// A route for getTopEarners()
router
  .route('/top-earning-tours')
  .get(practicingInTourController.getTopEarners);

// A route for getTopEarners()
router
  .route('/revenue-by-difficulty')
  .get(practicingInTourController.RevenueByDifficulty);

///////////
/////
// These have no IDs
router
  .route('/')
  .get(practicingInTourController.getAllTours)
  .post(practicingInTourController.createTour);

// These have IDs
router
  .route('/:id')
  .get(practicingInTourController.getTour)
  .patch(practicingInTourController.updateTour)
  .delete(practicingInTourController.deleteTour);

module.exports = router;
