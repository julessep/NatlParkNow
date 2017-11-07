var fs = require('fs');
var express = require('express');
var request = require('request');
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
  })
  .catch( (err) => {
    next(err);
  }); 
};

let onePark =[]
module.exports.getSinglePark = (req, res, next) => {
  // return new Promise ( (resolve, reject) => {
    const { Park } = req.app.get('models');
    let currentPark = req.params.id;
    Park.findAll({
      where: { id: currentPark }
    })
    .then(singlePark => {
      let park = singlePark[0];
      onePark.push(park)
      // res.render('park-details', { park });
      // getTweets(req,res, next)
      twitterQ(onePark)
    })
    // .then( park => {
    //   console.log("PARKKKKKK", park)
    // })
    .catch(err => {
      next(err);
    });
// })
};
// encode string 
// let twitterQ = (onePark) => {
//   let parkFullName = onePark[0].fullName; //
//   codeURL = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + parkFullName;
//   console.log(codeURL)
//   return codeURL
// }
let getTweets = (req, res, next) => {
  // console.log(onePark[0])
  let parkFullName = onePark[0].fullName; //
  var url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${parkFullName}`;
  var bearerToken = process.env.TWITTER_BEARER_TOKEN; //the bearer token obtained from the last script
  request({ 
    url: url,
    method:'GET',
    // qs:{"screen_name":"BryceCanyonNPS"},
    json:true,
    headers: {
        "Authorization": "Bearer " + bearerToken
    }
  }, function(err, resp, body) {
  
      console.dir(body);
  
  })
  // .then( () => {
  //   // res.render('parks', { natParks }) 
  //   // res.render('park-details', { park });
  //   console.log(tweetinfo)
  //   // module.exports.getSinglePark(req, res, next)

  //   })
  //   .catch( (err) => {
  //     next(err);
  //   }); 
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