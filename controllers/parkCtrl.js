var fs = require('fs');
var express = require('express');
var request = require('request');
var rp = require('request-promise-native');
require('dotenv').config();
const parkAPI = process.env.PARK_API;
var bearerToken = process.env.TWITTER_BEARER_TOKEN; //the bearer token obtained from the last script
let natParks = [];

// gets park codes from db and exports to array
module.exports.getParks = (req, res, next) => {
    const { Park } = req.app.get('models');
    Park.findAll()
    .then( (parkData) => {
      if (parkData[0]) {
        for(var i = 0; i < parkData.length; i++) {
        natParks.push(parkData[i])
      } 
    } else {
      extractParks(res,res,next)
    }
  })
  .then( () => {
    res.render('parks', { natParks })    
    })
    .catch( (err) => {
      next(err);
    }); 
};

// gets parks from NPS API
let extractParks = (req, res, next) => {
  request.get(`https://developer.nps.gov/api/v1/parks?api_key=${parkAPI}&limit=519`, (err, response, body) => {
    if (!err && response.statusCode == 200) {
        var parks = JSON.parse(body).data;
        // makes list of only the results that are National Parks
        var allParks = parks.filter((park) => {
          return park.designation==="National Park"
        })
        for(var i = 0; i < allParks.length; i++) {
          const { Park } = req.app.get('models');
          let savePark = {
            fullName: allParks[i].fullName,
            name: allParks[i].name,
            parkCode: allParks[i].parkCode,
            description: allParks[i].description,
            states: allParks[i].states,
            weatherInfo: allParks[i].weatherInfo,
            url: allParks[i].url
          }
          Park.create(savePark)
          .then( () => {
            res.json(savePark[i])
            // getParkCode(req, res, next)
            console.log("hi")
          })
          .catch( (err) => {
            next(err);
          }); 
        }
    }
  })
}



// gets one park from API
module.exports.getSinglePark = (req, res, next) => {
  request.get(`https://developer.nps.gov/api/v1/parks?parkCode=${req.params.parkCode}&fields=operatingHours,images&api_key=${parkAPI}`, (err, response, body) => {
  if (!err && response.statusCode == 200) {
        var park = JSON.parse(body).data[0];
        var hours = JSON.parse(body).data[0].operatingHours[0];
        var images = JSON.parse(body).data[0].images[0];
        res.render('park-details', {park, hours, images});
    }
  })
}

module.exports.tweets =(req,res, next) => {
  var url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
  var bearerToken = process.env.TWITTER_BEARER_TOKEN; //the bearer token obtained from the last script
  
  request({ url: url,
      method:'GET',
      qs:{"screen_name":"stadolf"},
      json:true,
      headers: {
          "Authorization": "Bearer " + bearerToken
      }
  
  }, function(err, resp, body) {
  
      // console.dir(body);
  
  })
  .then( () => {
    })
    .catch( (err) => {
      next(err);
    }); 
}
// adds park to FAVORITES table in db
module.exports.savePark = (req, res, next) => {
  console.log("Favorite saved called")
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