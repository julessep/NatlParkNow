var fs = require('fs');
var express = require('express');
var request = require('request');
var rp = require('request-promise-native');
require('dotenv').config();
const parkAPI = process.env.PARK_API;
var bearerToken = process.env.TWITTER_BEARER_TOKEN; //the bearer token obtained from the last script
let natParks = []; // array for storing park objects

// gets information of all parks
module.exports.getParks = (req, res, next) => {
    const { Park } = req.app.get('models');
    Park.findAll()
    .then( (parkData) => {
      if (parkData[0]) { //checks if there's any information in Park table
        for(var i = 0; i < parkData.length; i++) {
          natParks.push(parkData[i])// adds all park info to array
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

// gets parks from NPS API for initial storing to the database
let extractParks = (req, res, next) => {
  request.get(`https://developer.nps.gov/api/v1/parks?api_key=${parkAPI}&limit=519`, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      var parks = JSON.parse(body).data;
      // makes list of only the results that are National Parks
      var allParks = parks.filter((park) => {
        return park.designation==="National Park"
      })
      for(var i = 0; i < allParks.length; i++) { //loops over each park oject for inserting into Park table
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
          module.exports.getParks(req, res, next)
        })
        .catch( (err) => {
          next(err);
        }); 
      }
    }
  })
}

module.exports.getSinglePark = (req, res, next) => {
  const { Park } = req.app.get('models');
  let currentPark = req.params.parkCode;
  Park.findAll({
    where: { parkCode: currentPark }
  })
  .then(singlePark => {
    let park = singlePark[0];
    res.render('park-details', { park });
  })
  .catch(err => {
    next(err);
  });
};

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