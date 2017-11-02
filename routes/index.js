'use strict';

const { Router } = require('express');
const router = Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.use(require('./authRoute'));
router.use(require('./parksRoute'));
router.use(require('./favoritesRoute'));

module.exports = router;