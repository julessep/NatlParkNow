'use strict';

const { Router } = require('express');
const router = Router();

const {
  getParks
} = require('../controllers/parkCtrl.js');

router.get('/parks', getParks);

module.exports = router;
