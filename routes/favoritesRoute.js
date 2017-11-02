'use strict';

const { Router } = require('express');
const router = Router();

const {
  getFavorites,
  addFavorite
} = require('../controllers/favoriteCtrl.js');

// router.get('/favorites/:parkCode', addFavorite);
// router.get('/favorites/:parkCode', getSingleFavorite);
router.post('/favorites/:parkCode', addFavorite);

module.exports = router;

