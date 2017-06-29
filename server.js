//var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;
var connectionPool = require('./config/database');
/*Start https---------------------
Testing out https - sourced mostly from link below
https://stackoverflow.com/questions/5998694/how-to-create-an-https-server-in-node-js
Need to generate privatekey.pem and certificate.pem using the following commands:
openssl genrsa -out privatekey.pem 1024
openssl req -new -key privatekey.pem -out certrequest.csr
password for above = httpstestpassword
openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
*/
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
var fs = require('fs');
var http = require('http'); //Test, if works then remove this line
var https = require('https');

var privateKey = fs.readFileSync('privatekey.pem').toString();
var certificate = fs.readFileSync('certficate.pem').toString(); //Oops spelt certficate wrong when creating key.

var credentials = {
  key: privateKey,
  cert: certificate
};

//Moved from top of file, down to here
var express = require('express');
var app = express();


/*End https ------------------------*/

//Setup PostgreSQL db
//NOTE: pg wasdeleted
//var client = new pg.Client(connectionString);
//client.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

//routes for webpages using EJS
app.get('/', function (req, res){
	res.render('index');
});

app.get('/loginpage', function (req, res){
	res.render('login');
});

app.get('/checkoutpage', function (req, res){
	res.render('checkout');
});

app.get('/productpage', function (req, res){
	res.render('product-overview');
});

app.get('/shoppingcartpage', function (req, res){
	res.render('shoppingcart');
});

//Routes
// need to set up login and register files first
var login = require('./routes/login');
var register = require('./routes/register');
//var search = require('.routes/search');

//app.use('/search', search)
app.use('/login', login);
app.use('/register', register);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Change below to https.createServer(options, app).listen(.....

app.listen(port, function () {
 //https.createServer(credentials, app).listen(port, function () {
 console.log('Example app listening on port 8080!');
});


passport.use(new FacebookStrategy({
    clientID: "468550980177208",
    clientSecret: "3cb380748f6d639cd28e8238648fa224",
    callbackURL: "https://nwen304groupseven.herokuapp.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

//Https Change
//module.exports = app;
module.exports = https;
