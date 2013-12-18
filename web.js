var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var phonyWebDb = require('./models/index.js');
var conf = require('./config.js');
var MongoStore = require('connect-mongo')(express);
var everyauth = require('everyauth');

everyauth.google
  	.appId(conf.google.clientId)
  	.appSecret(conf.google.clientSecret)
  	.scope('https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds/')
  	.findOrCreateUser( function (sess, accessToken, extra, googleUser) {
    	googleUser.refreshToken = extra.refresh_token;
    	googleUser.expiresIn = extra.expires_in;
    	console.log(googleUser);
    	//return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
  	})
  	.redirectPath('/twitter_login');

 everyauth.facebook
	.appId(conf.fb.appId)
	.appSecret(conf.fb.appSecret)
	.handleAuthCallbackError( function(req, res) {
		// If a user denies your app, Facebook will redirect the user to
    // /auth/facebook/callback?error_reason=user_denied&error=access_denied&error_description=The+user+denied+your+request.
    // This configurable route handler defines how you want to respond to
    // that.
    // If you do not configure this, everyauth renders a default fallback
    // view notifying the user that their authentication failed and why.
	console.log('auth failed');
	})
	.findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadat) {
		//find or create user logic here
	})
	.redirectPath('/twitter_login');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger());
app.use(express.cookieParser('My mothers maiden name'));
app.use(express.session({
	store: new MongoStore({
		url: 'mongodb://localhost/phonyweb'
	}),
	secret: 'My mothers maiden name'
}));
app.use(everyauth.middleware());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.errorHandler());

// everyauth.everymodule.findUserById( function(userId, callback) {
// 	phonyWebDb.Contact.findById(userId, function(err, user) {
// 		console.log(user);
// 	});
// });


app.get('/twitter_login', function(req, res) {
	res.render('index', {});
});

app.get('/', function(req, res) {
	// var bill = phonyWebDb.Bill({cost: 32});
	// bill.save();
	//console.log(bill);
	console.log(req.session)
	res.render('login', {});
});


http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});