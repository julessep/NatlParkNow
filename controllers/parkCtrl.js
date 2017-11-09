var fs = require('fs');
var express = require('express');
var request = require('request');
var rp = require('request-promise') 
require('dotenv').config();
const parkAPI = process.env.PARK_API; //NPS API key
var bearerToken = process.env.TWITTER_BEARER_TOKEN; //the bearer token obtained from the last script
let natParks = [];
let parkState = {};

// gets information of all parks
module.exports.getParks = (req, res, next) => {
  const { Park } = req.app.get('models');
  Park.findAll({
    raw:true,
    order: ['states']
  })
  .then( (parkData) => {
    let sortedParks = {
      'AK': { state:"Alaska", parks: []},
      'AR': { state:"Arkansas", parks: []},
      'AZ': { state:"Arizona", parks: []},
      'CA': { state:"California", parks: []},
      'CO': { state:"Colorado", parks: []},
      'FL': { state:"Florida", parks: []},
      'HI': { state:"Hawaii", parks: []},
      'ID': { state:"Idaho", parks: []},
      'KY': { state:"Kentucky", parks: []},
      'ME': { state:"Maine", parks: []},
      'MI': { state:"Michigan", parks: []},
      'MN': { state:"Minnesota", parks: []},
      'MT': { state:"Montana", parks: []},
      'NC': { state:"North Carolina", parks: []},
      'ND': { state:"North Dakota", parks: []},
      'NM': { state:"New Maexico", parks: []},
      'NV': { state:"Nevada", parks: []},
      'OH': { state:"Ohio", parks: []},
      'OR': { state:"Oregon", parks: []},
      'SC': { state:"South Carolina", parks: []},
      'SD': { state:"South Dakota", parks: []},
      'TX': { state:"Texas", parks: []},
      'UT': { state:"Utah", parks: []},
      'VA': { state:"Virginia", parks: []},
      'VI': { state:"Virgin Islands", parks: []},
      'WA': { state:"Washington", parks: []},
      'WY': { state:"Wyoming", parks: []}
    };

    parkData.forEach( (park) => {
    // console.log("PARKS?", sortedParks[park.states.split(',')[0]])
    
      sortedParks[park.states.split(',')[0]].parks.push(park);

    });
    // console.log("SORTED PARKS", sortedParks)
    // return sortedParks;
    res.render('parks', { sortedParks }) 
    })
  .catch( (err) => {
    next(err);
  }); 
};

let park;
// gets park details for a single park
module.exports.getSinglePark = (req, res, next) => {
    const { Park, Handle } = req.app.get('models');
    let currentPark = req.params.id;
    Handle.findOne({where: {parkId: currentPark}, include: {model: Park}}) 
    .then( (data) => {
      park = data; //gets Park and Handle data from database
      let parkCode = park;
      console.log("PARK", park.parkCode)
      getTweets(park) 
      .then( (mediaUrlArr) => {
        const {dataValues:Park} = park;
        data = park.dataValues.Park;
        res.render('park-details', { data , mediaUrlArr})
      })
    })
    .catch(err => {
      next(err);
    });
};

// gets tweets from the Twitter API
let getTweets = (req, res, next) => {
  let mediaUrlArr = [];
  let screen_name = park.screenName;
  var url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${screen_name}&count=200&include_entities=true&tweet_mode=extended`; //gets latest 200 tweets from users timeline
  var tweetsInfo = { 
    uri: url,
    headers: {  //set header as per requiered by OAuth for twitter
      'User-Agent': 'Request-Promise',
      "Authorization": "Bearer " + bearerToken
    },
    json: true
  };
  return rp(tweetsInfo) //using request-promise module
  .then(function (body) { // -----> body[].entities.media[].media_url_https
    let timelineData = body;
    timelineData.forEach(function(tweet){ //iterate over tweets to get the url for each photo 
      let entitiesObj = tweet.entities
        if(typeof(entitiesObj.media) !== 'undefined'){ //if entities has a property of media, add it to an array
          let mediaArray = entitiesObj.media;
            mediaArray.forEach(function(url){
              let mediaUrl = url.media_url_https;
              mediaUrlArr.push(mediaUrl); 
            })
        } else {
          // console.log("no media property")
        }
    })
    return mediaUrlArr
  })
  .catch(function (err) {
    console.log(err)
  })
}

let getParkAPI = (req, res, next, parkCode) => {
  // let parkCode = req.params.parkCode;
  console.log("params", parkCode)
  request.get(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${parkAPI}`, (err, response, body) => {
  if (!err && response.statusCode == 200) {
        var park = JSON.parse(body).data;
        res.render('park-details', {park});
        console.log("park obj", park)
     }
   })
 }

// adds park to favorites table in db
module.exports.savePark = (req, res, next) => {
  let currentPark = req.params.id;
  let parkName = req.params.fullName;
  let user = req.session.passport.user.id;
  console.log("USER", user)
  const { Favorite } = req.app.get('models');
  let saveFavorite = {
    userId: req.session.passport.user.id,
    name: parkName,
    parkId: currentPark
  }
  Favorite.create(saveFavorite)
  .then( () => {
    module.exports.getParks(req, res, next)
  })
  .catch( (err) => {
    next(err);
  }); 
}