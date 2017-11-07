require('dotenv').config();
var fs = require('fs');

var request = require('request');
var app = require('express');

const parkAPI = process.env.PARK_API;

module.exports.extractParks = (req, res, next) => {
  console.log(req)
  request.get(`https://developer.nps.gov/api/v1/parks?api_key=${parkAPI}&limit=519`, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      var parks = JSON.parse(body).data;
      // makes list of only the results that are National Parks
      var allParks = parks.filter((park) => {
        return park.designation==="National Park"
      })
      let obj = {}
      obj.allParks = allParks
      console.log(obj)
      let json = JSON.stringify(obj, null, 4) // makes it in readable json format 
      fs.writeFile('allParks.json', json, 'utf-8'); // saves national park data to json file
    }
  })
}
  