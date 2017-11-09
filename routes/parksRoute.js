'use strict';

const { Router } = require('express');
const router = Router();

const {
  getParks,
  getSinglePark,
  // getSingleParkAPI,
  savePark
} = require('../controllers/parkCtrl.js');

router.get('/parks', getParks); // gets list of all park names
router.get('/parks/:id', getSinglePark); // details of a single park
router.post('/parks/:id/:parkCode', isLoggedIn, savePark); // adds park to favorites table

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
}
