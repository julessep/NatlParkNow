'use strict';

const { Router } = require('express');
const router = Router();

// const {
//   getParks
// } = require('../controllers/parkCtrl.js');

router.get('/', (req, res, next) => {
  res.render('index'); 
});

router.use(require('./authRoute'));
router.use(require('./parksRoute'));
router.use(require('./favoritesRoute'));

module.exports = router;
