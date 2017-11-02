var request = require("request");

require('dotenv').config();
var key = process.env.TWITTER_CONSUMER_KEY;
console.log("key", key)
var secret = process.env.TWITTER_CONSUMER_SECRET;
var cat = key +":"+secret;
var credentials = new Buffer(cat).toString('base64');
var url = 'https://api.twitter.com/oauth2/token';

module.exports.bearerToken = (req, res, next) => {
  console.log("bearerTOken")
  request({ url: url,
    method:'POST',
      headers: {
          "Authorization": "Basic " + credentials,
          "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: "grant_type=client_credentials"

  }, function(err, resp, body) {
      console.dir(body); //bearer token
    })
};

module.exports.bearerToken()