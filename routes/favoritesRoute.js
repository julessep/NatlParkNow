'use strict';

const { Router } = require('express');
const router = Router();

const {
  getFavorites,
  addFavorite
} = require('../controllers/favoriteCtrl.js');

router.get('/favorites', isLoggedIn, getFavorites );
// router.get('/favorites/:parkCode', getSingleFavorite);
// router.post('/favorites/:parkCode', addFavorite);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
}
