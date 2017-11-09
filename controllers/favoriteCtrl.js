var express = require('express');
var request = require('request');
require('dotenv').config();
const parkAPI = process.env.PARK_API;

module.exports.getFavorites = (req, res, next) => {
  const { Favorite } = req.app.get('models');
  Favorite.findAll()
  .then( (favorites) => {
    res.render('favorites', {favorites});
    console.log(favorites)
  })
  .catch( (err) => {
    next(err); 
  });
};

