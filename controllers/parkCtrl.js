var express = require('express');
var request = require('request');
require('dotenv').config();
const parkAPI = process.env.PARK_API;

// gets parks from NPS API
module.exports.getParks = (req, res, next) => {
  request.get(`https://developer.nps.gov/api/v1/parks?api_key=${parkAPI}&limit=519`, (err, response, body) => {
  if (!err && response.statusCode == 200) {
        var parks = JSON.parse(body).data;
        // makes list of only the results that are National Parks
        let natParks = parks.filter((park) => {
          return park.designation==="National Park"
        })
        res.render('parks', {natParks});
    }
  })
}

// gets one park from API
module.exports.getSinglePark = (req, res, next) => {
  // console.log("params", req.params.parkCode)
  request.get(`https://developer.nps.gov/api/v1/parks?parkCode=${req.params.parkCode}&fields=operatingHours,images&api_key=${parkAPI}`, (err, response, body) => {
  if (!err && response.statusCode == 200) {
        var park = JSON.parse(body).data[0];
        var hours = JSON.parse(body).data[0].operatingHours[0];
        var images = JSON.parse(body).data[0].images[0];
        res.render('park-details', {park, hours, images});
        console.log("park obj", images.url)
    }
  })
}
