var fs = require('fs');
var express = require('express');
var request = require('request');
require('dotenv').config();
const parkAPI = process.env.PARK_API;
let natParks;
let parkCode = [];

module.exports.getParks = (req, res, next) => {
    const { Park } = req.app.get('models');
    Park.findAll()
    .then( (parkData) => {
      // console.log(parkData)
      if (parkData[0]) {
        for(var i = 0; i < parkData.length; i++) {
        parkCode.push(parkData[i].parkCode) //get parkCode to then be used by API
        } 
      } else {
        extractParks(res,res,next)
      }
      console.log(parkCode)
    })
    .catch( (err) => {
      next(err);
    }); 
};


// let getParkInfo = (req, res, next) => {
//   const { Park } = req.app.get('models');
//   Park.findAll()
//   .then( (parkData) => {
//     for(var i = 0; i < parkData.length; i++) {
//       parkCode = (parkData[i].parkCode) //get parkCode to then be used by API
//       return parkCode
//       }
//     })
//   }
    
// module.exports.getParks = (req, res, next) => {
  // console.log(parkCode[0])
  // request.get(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&fields=operatingHours,images&api_key=${parkAPI}`, (err, response, body) => {
  //   if (!err && response.statusCode == 200) {
  //         var natlPark = JSON.parse(body).data[0];

  //         res.render('parks', {natlPark});
  //     }
  
  //   })
// }
  
  

    // if(parkData[0]){
    //   request.get(`https://developer.nps.gov/api/v1/parks?parkCode=${req.params.parkCode}&fields=operatingHours,images&api_key=${parkAPI}`, (err, response, body) => {
    //     if (!err && response.statusCode == 200) {
    //       var natParks = JSON.parse(body).data;
    //       // makes list of only the results that are National Parks
    //           natParks = parks.filter((park) => {
    //             return park.designation==="National Park"
    //           })
    //           return natParks
    //           res.render('parks', {natParks});
    //       }
    //     })
      
    // }
  // })
// }

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
            parkCode: allParks[i].parkCode,
            fullName: allParks[i].fullName
          }
          Park.create(savePark)
          .then( () => {
            module.exports.getParks(req, res, next)
          })
          .catch( (err) => {
            next(err);
          }); 
        }
        // console.log(allParks[0].fullName)
        // console.log(allParks[0].parkCode)
        
        // res.render('parks', {natParks});
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
