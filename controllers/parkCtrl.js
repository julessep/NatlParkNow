var fs = require('fs');
var express = require('express');
var request = require('request');
var rp = require('request-promise')
require('dotenv').config();
const parkAPI = process.env.PARK_API;
var bearerToken = process.env.TWITTER_BEARER_TOKEN; //the bearer token obtained from the last script
let natParks = [];

// gets information of all parks
module.exports.getParks = (req, res, next) => {
  const { Park } = req.app.get('models');
  Park.findAll({
    order: ['states']
  })
  .then( (parkData) => {
      for(var i = 0; i < parkData.length; i++) {
        natParks.push(parkData[i])// adds all park info to array
      } 
    })
    .then( () => {
      res.render('parks', { natParks }) 
      return natParks;
  })
  .catch( (err) => {
    next(err);
  }); 
};

let park;
module.exports.getSinglePark = (req, res, next) => {
    const { Park, Handle } = req.app.get('models');
    let currentPark = req.params.id;
    Handle.findOne({where: {parkId: currentPark}, include: {model: Park}})
    .then( (data) => {
      park = data;
      getTweets(park)
      // getParkHashtag(park)
      .then( (mediaUrlArr) => {
        const {dataValues:Park} = park;
        data = park.dataValues.Park;
        // res.render('park-details', { data , mediaUrl})
        // res.json(mediaUrlArr)
      })
    })
    .catch(err => {
      next(err);
    });
};

let getTweets = (req, res, next) => {
  let mediaUrlArr = [];
  let screen_name = park.screenName;
  var url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${screen_name}&count=100&include_entities=true&tweet_mode=extended`;

  var tweetsInfo = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise',
      "Authorization": "Bearer " + bearerToken
    },
    json: true
  };
  return rp(tweetsInfo)
  .then(function (body) { // -----> body[].entities.media[].media_url_https
    let twitterData = body;
    twitterData.forEach(function(statuses){
      let entitiesObj = statuses.entities
        if(typeof(entitiesObj.media) !== 'undefined'){
          let filteredMedia = entitiesObj.media;
            filteredMedia.forEach(function(data){
              let mediaUrl = data.media_url_https;
              mediaUrlArr.push(mediaUrl);
            })
        } else {
          console.log("no media property")
        }
    })
    console.log("mediaUrlArr", mediaUrlArr)
    return mediaUrlArr
  })
  .catch(function (err) {
    console.log(err)
  })
}

// adds park to favorites table in db
module.exports.savePark = (req, res, next) => {
  let currentPark = req.params.parkCode;
  let parkName = req.params.fullName;
  const { Favorite } = req.app.get('models');
  let saveFavorite = {
    userId: req.session.passport.user.id,
    parkCode: currentPark,
    name: parkName
  }
  Favorite.create(saveFavorite)
  .then( () => {
    module.exports.getParks(req, res, next)
  })
  .catch( (err) => {
    next(err);
  }); 
}