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
      .then( (mediaUrl) => {
        const {dataValues:Park} = park;
        data = park.dataValues.Park;
        // res.render('park-details', { data , mediaUrl})
        res.json(mediaUrl)
      })
    })
    .catch(err => {
      next(err);
    });
};

let getTweets = (req, res, next) => {
  let tweetMedia = [];
  let screen_name = park.screenName;
  console.log("SCREEN_NAME", screen_name)
  // let url = `https://api.twitter.com/1.1/search/tweets.json?q=${screen_name}%2Bfrom%3A${screen_name}%2Bfilter%3Aimages&count=50&include_entities=true&tweet_mode=extended`; //WORKING QUERY
  var url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${screen_name}&count=2&include_entities=true&tweet_mode=extended`;

  var tweetsInfo = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise',
      "Authorization": "Bearer " + bearerToken
    },
    json: true
  };
  return rp(tweetsInfo)
  .then(function (body) {
    // -----> structure: body[0].entities.media[0].media_url_https
    let twitterData = body;
    twitterData.forEach(function(statuses){
      let entitiesArr = statuses.entities
      console.log("ENTITIES ARRAY", entitiesArr)
      // newMedia.forEach(function(data){
      //   let mediaUrl = data.media_url_https;
      //   tweetMedia.push(mediaUrl);
      // })
    })
  //   console.log("TWEET MEDIA ARRAY", tweetMedia)
    // return tweetMedia
  })
  .catch(function (err) {
    console.log(err)
  })
}

// let getParkHashtag = (req, res, next) => {
//   let tweetMedia = [];
//   let screen_name = park.screenName;
//   console.log("PARK FULL NAME", park.Park.fullName)
//   // var url = `https://api.twitter.com/1.1/search/tweets.json?q=%40${screen_name}%2Bfilter%3Aimages&count=25&include_entities=true&tweet_mode=extended`;
//   let url = `https://api.twitter.com/1.1/search/tweets.json?q=${screen_name}%2Bfrom%3A${screen_name}%2Bfilter%3Aimages&count=50&include_entities=true&tweet_mode=extended`;

//   var tweetsInfo = {
//     uri: url,
//     headers: {
//       'User-Agent': 'Request-Promise',
//       "Authorization": "Bearer " + bearerToken
//     },
//     json: true
//   };
//   return rp(tweetsInfo)
//   .then(function (body) {
//       let status = body.statuses;
//       // console.log("STATUS". status)
//       // let entries;
//     status.forEach(function(statuses){
//       let newMedia = statuses.entities.media
//       // console.log("NEW MEDIA", newMedia)
//       newMedia.forEach(function(data){
//         let mediaUrl = data.media_url_https;
//         tweetMedia.push(mediaUrl);
//       })
//     })
//     return tweetMedia
//   })
//   .catch(function (err) {
//     console.log(err)
//   })
// }

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