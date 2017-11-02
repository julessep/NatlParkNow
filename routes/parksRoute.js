'use strict';

const { Router } = require('express');
const router = Router();

const {
  getParks,
  getSinglePark,
  savePark
} = require('../controllers/parkCtrl.js');

router.get('/parks', getParks);
router.get('/parks/:parkCode', getSinglePark);
router.post('/parks/:parkCode', savePark);

module.exports = router;
