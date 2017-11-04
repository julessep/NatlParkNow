var request = require("request");
require('dotenv').config();
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

    console.dir(body);

});