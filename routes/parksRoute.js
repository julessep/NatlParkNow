'use strict';

const { Router } = require('express');
const router = Router();

const {
  getParks,
  getSinglePark
} = require('../controllers/parkCtrl.js');

router.get('/parks', getParks);
router.get('/parks/:parkCode', getSinglePark);

module.exports = router;
