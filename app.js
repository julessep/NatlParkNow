'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const passport = require('passport')
var session = require('express-session');
let bodyParser = require('body-parser');
const flash = require('express-flash');
var request = require('request');
const {extractParks} = require('./populate-parks');

const port = process.env.PORT || 4000;
const parkAPI = process.env.PARK_API;
var key = process.env.TWITTER_CONSUMER_KEY;
var secret = process.env.TWITTER_CONSUMER_SECRET;
var theBearerToken = process.env.TWITTER_BEARER_TOKEN;

app.set('models', require('./models')); 

app.set('view engine', 'pug');

let routes = require('./routes/');
app.use(express.static(__dirname + '/public'));
// Begin middleware stack
// Inject session persistence into middleware stack
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
})); // session secret

//execute passport strategies file
require('./config/passport-strat.js');
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
// This custom middleware adds the logged-in user's info to the locals variable,
// so we can access it in the Pug templates

app.use( (req, res, next) => {
  res.locals.session = req.session;
  // console.log('res.locals.session', res.locals.session);
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

app.use(routes);

// Add a 404 error handler
// Add error handler to pipe all server errors to from the routing middleware

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
