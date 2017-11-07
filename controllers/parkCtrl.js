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
      // console.log(data)
      let park = data;
      parkDetails.push(park)
      // console.log("Access park details", parkDetails[0].Park.fullName);
      //  console.log("twitter handle", parkDetails[0].screenName) //logs twitter handle
      res.render('park-details', { park })
      getTweets(parkDetails)
      // console.log(photoUrl)
    })
    .catch(err => {
      next(err);
    });
};


let getTweets = (req, res, next) => {
  // console.log(req)
  let photo;
  console.log("run getTweets");
  // console.log("Access park details", parkDetails[0].Park.fullName);
  //  console.log("twitter handle", parkDetails[0].screenName);
  // console.log("PARK DETAILS", parkDetails)
  let screen_name = parkDetails[0].screenName; //
  console.log("SCREEN NAME", screen_name)
  // var url = `https://api.twitter.com/1.1/search/tweets.json?q=%40${screen_name}&count=25`;
  let url = `https://api.twitter.com/1.1/search/tweets.json?q=${screen_name}%2Bfrom%3A${screen_name}&count=1&include_entities=1`;

  var tweetsInfo = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise',
      "Authorization": "Bearer " + bearerToken
    },
    json: true
  };
  rp(tweetsInfo)
  .then(function (tweets) {
      console.log("???????????", tweets.statuses);
  })
  .catch(function (err) {
    console.log(err)
  })
}
  // var url = `https://api.twitter.com/1.1/search/tweets.json?q=${screen_name}%2Bfrom%3A${screen_name}&count=1&include_entities=1`//gets all the tweets back from the twitter handle with the screen name and posted by the screen name
  // var url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${screen_name}`;//gets tweets that reference the screen name eg fabios trip to the park
  // var url = (encodeURI(uri));
  // console.log(url)
  
//   var bearerToken = process.env.TWITTER_BEARER_TOKEN; //the bearer token obtained from the last script
//   request({ 
//     url: url,
//     method:'GET',
//     // qs:{"filter:media"},
//     json:true,
//     headers: {
//         "Authorization": "Bearer " + bearerToken
//     }
//   }, function(err, resp, body) {

//       // console.log(body.statuses[0].entities.media[0].media_url_https);
//       photo = body.statuses[0].entities.media[0].media_url_https;
//     })
//     // next(photo)
//   .then( () => {
//     next(photo)
//   //   // res.render('parks', { natParks }) 
//   //   // res.render('park-details', { park });
//   //   console.log("TWEETS", tweetinfo)
//   //   // module.exports.getSinglePark(req, res, next)
//     })
//     .catch( (err) => {
//       next(err);
//     }); 
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