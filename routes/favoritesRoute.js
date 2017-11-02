'use strict';

const { Router } = require('express');
const router = Router();

const {
  getFavorites,
  addFavorite
} = require('../controllers/favoriteCtrl.js');

router.get('/favorites', getFavorites);
// router.get('/favorites/:parkCode', getSingleFavorite);
// router.post('/favorites/:parkCode', addFavorite);

module.exports = router;

