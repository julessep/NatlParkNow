'use strict';

const { Router } = require('express');
const router = Router();

const {
  getParks,
  getSinglePark,
  savePark
} = require('../controllers/parkCtrl.js');

router.get('/parks', getParks); // gets list of all park names
router.get('/parks/:id', getSinglePark); // details of a single park
router.post('/parks/:id/:fullName', isLoggedIn, savePark, getSinglePark); // adds park to favorites table

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
}
