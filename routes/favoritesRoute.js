'use strict';

const { Router } = require('express');
const router = Router();

const {
  getFavorites
} = require('../controllers/favoriteCtrl.js');

router.get('/favorites', isLoggedIn, getFavorites); 

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
}
