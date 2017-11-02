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
// adds park to favorites table in db
// module.exports.addFavorite = (req, res, next) => {
//   console.log(req.session.passport.user.id)
//   let currentPark = req.params.parkCode;
//   const { Favorite } = req.app.get('models');
//   let saveFavorite = {
//     userId: req.session.passport.user.id,
//     parkCode: currentPark
//   }
//   Favorite.create(saveFavorite)
//   .then( () => {
//     res.render('parks')
//   })
//   .catch( (err) => {
//     next(err);
//   }); 
// }