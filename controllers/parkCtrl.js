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

let parkDetails = []
module.exports.getSinglePark = (req, res, next) => {
    const { Park, Handle } = req.app.get('models');
    let currentPark = req.params.id;
    Handle.findOne({where: {parkId: currentPark}, include: {model: Park}})
    .then( (data) => {
      let park = data;
      parkDetails.push(park)
      console.log(parkDetails)
      getTweets(parkDetails)
      .then( (data) => {

        console.log("tweet array data", data)
        // res.render('park-details', { park })
      })
    })
    // .then( (tweetMedia) =>{
    //     console.log("TWEET MEDIA FROM getTWEETS", tweetMedia)
    // })
    .catch(err => {
      next(err);
    });
};

let getTweets = (req, res, next) => {
  let tweetMedia = []
  console.log("run getTweets");
  // tweetMedia.push(parkDetails);
  // console.log("PARK DETAILS FROM GET PARKS", parkDetails[0].Park)
  // console.log("TPARK PARK ARRAY", tweetMedia)
  
  let screen_name = parkDetails[0].screenName;
  console.log("SCREEN NAME", screen_name)
  // var url = `https://api.twitter.com/1.1/search/tweets.json?q=%40${screen_name}%2Bfilter%3Aimages&count=25&include_entities=true&tweet_mode=extended`;
  let url = `https://api.twitter.com/1.1/search/tweets.json?q=${screen_name}%2Bfrom%3A${screen_name}%2Bfilter%3Aimages&count=7&include_entities=true&tweet_mode=extended`;

  var tweetsInfo = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise',
      "Authorization": "Bearer " + bearerToken
    },
    json: true
  };
  console.log(tweetsInfo)
  return rp(tweetsInfo)
  .then(function (body) {
      // console.log("TWEET DATA", body.statuses[1].entities.media[0].media_url_https);
      media = body.statuses[1].entities.media[0].media_url_https;
      tweetMedia.push(media)
      console.log("TWEED MEDIA ARRAY", tweetMedia)
      return tweetMedia;
      // res.render('parks', { natParks }) 
      
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