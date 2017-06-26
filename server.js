var express = require('express');
var router = express.Router();

var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8080;
var path = require('path');
var pg = require('pg');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var session = require('express-session');
var connectionString = "postgres://lzffldlqkadbir:3c1cc00bb2b3b7bce086033be0a66167c9bb87c835ef455e3b60ae38cdcd27f0@ec2-23-21-220-167.compute-1.amazonaws.com:5432/dbuuirtv8ccpbj";

var DB = require('./db.js');

var client = new pg.Client(connectionString);
client.connect();

//Routes
/* need to set up login and register files first
var login = require('.routes/login');
var register = require('.routes/registe');

app.use('/login', login);
app.use('/register', register);
*/
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
	 // Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*')
	 // // Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	 // Request headers you wish to allow ,
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-AllowHeaders');
	 // Pass to next layer of middleware
	next();
});

passport.use(new GoogleStrategy({
    'clientID' : '193412241831-kr4f03mftc0206mb8bie8p59bm4764rc.apps.googleusercontent.com',
        'clientSecret' : 'IK6IEHkBZ6T4WNyGo0ZlsHnf',
        'callbackURL' : 'https://nwen304groupseven.herokuapp.com/auth/google/callback'
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      console.log("Access Token: " + accessToken); 
      return done(null, profile);
    });
  }
));

/* Passport JS Routes */
router.get('/auth/google',
  passport.authenticate('google', { scope: 
  	[ 'https://www.googleapis.com/auth/plus.login' ] }
));
 
router.get('/auth/google/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/',
        failureRedirect: '/'
}));



// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// routes ======================================================================
require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(port, function () {
 console.log('Example app listening on port 8080!');
});

module.exports = router;

//make routes directory

//variables of relative links
//eg. var login = require('./routes/login')

//app.use('/login'. login)

//in each .js file (e.g login.js), need to put var router = express.Router();
