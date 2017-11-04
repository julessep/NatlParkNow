var fs = require('fs');
var express = require('express');
var request = require('request');
var rp = require('request-promise-native');
require('dotenv').config();
const parkAPI = process.env.PARK_API;
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
      res.render('parks', {natParks})
    })
    .catch( (err) => {
      next(err);
    }); 
};

// let parkPromise = []; //defining empty array to later push all of the park data to
// module.exports.displayParks = (req, res, next) => {
//   for(var i = 0; i < parkCode.length; i++) {
//     // using the request-promise-native module to make calls to API
//     var nps = {
//       uri: `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode[i]}&api_key=MddxhGWotXba0C7BL1TsFLoWSolAf7pHiSbZ92E8`,
//       json: true
//     };
//     parkPromise.push(
//       new Promise( (resolve, reject) => {
//       rp.get(nps)
//         .then( (parks) => {
//           // console.log("park data loop", parks)//geting data object about each park logging as own array
//           resolve("parks", parks) //has error that resolve is not defined 
//         })
//         .catch( (err) => {
//           reject(err)
//         })
//       })
//     )
//   } 
//   console.log([parkPromise]) //logs as an array of 'Promise { <pending> }' for each park object 
// }
// Promise.all([parkPromise])
// .then(parks => {
//   return(parks)
//   console.log("parks", parks) //this doesn't run at all
// }).catch( (err) => {
//   console.log(err)
// })

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
            getParkCode(req, res, next)
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
