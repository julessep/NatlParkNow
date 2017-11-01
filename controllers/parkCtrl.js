var express = require('express');
var request = require('request');
require('dotenv').config();
const parkAPI = process.env.PARK_API;

// gets parks from NPS API
module.exports.getParks = (req, res, next) => {
  request.get(`https://developer.nps.gov/api/v1/parks?api_key=${parkAPI}`, (err, response, body) => {
  if (!err && response.statusCode == 200) {
        var parks = JSON.parse(body).data;
        res.render('parks', {parks});
        console.log(parks)
    }
  })
}
