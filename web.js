var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var phonyWebDb = require('./models/index.js');
var conf = require('./config.js');
var MongoStore = require('connect-mongo')(express);
var everyauth = require('everyauth');
var util = require('util');
var ROUTES = require('./routes');

everyauth.debug = true;

everyauth.everymodule.findUserById(function(userId, callback) {
	phonyweb.Contact.findById(userId, function(err, contact) {
		callback(null, user);
	});
});

// var findOrCreateFBUser = function(session, accessToken, accessTokExtra, fbUserMetadata) {
// 	var promise = this.Promise();
// 	phonyweb.Contact.findOne({facebook_id: fbUserMetadata.id})
// }

everyauth.google
  	.appId(conf.google.clientId)
  	.appSecret(conf.google.clientSecret)
  	.scope('https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds/')
  	.findOrCreateUser( function (sess, accessToken, extra, googleUser) {
    	googleUser.refreshToken = extra.refresh_token;
    	googleUser.expiresIn = extra.expires_in;
    	console.log(util.inspect(googleUser));
    	//return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
  	})
  	.redirectPath('/');

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
	.findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
		//find or create user logic here
		console.log(util.inspect(fbUserMetadata));
	})
	.redirectPath('/');

var app = express();

app.configure('development', function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	//app.use(express.logger());
	app.use(express.favicon());
	app.use(express.cookieParser('My mothers maiden name'));
	app.use(express.session({
		store: new MongoStore({
			url: process.env.MONGOHQ_URL || 'mongodb://localhost/phonyweb'
		}),
		secret: 'My mothers maiden name'
	}));
	app.use(everyauth.middleware());
	app.use(app.router);
	app.use(express.favicon(path.join(__dirname, 'public/img/favicon.jpg')));
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

});

app.configure('production', function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	//app.use(express.logger());
	app.use(express.favicon());
	
	app.use(express.cookieParser('My mothers maiden name'));
	app.use(express.session({
		store: new MongoStore({
			url: process.env.MONGOHQ_URL
		}),
		secret: 'My mothers maiden name'
	}));
	app.use(everyauth.middleware());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.favicon(path.join(__dirname, 'public/img/favicon.jpg')));
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

});


// everyauth.everymodule.findUserById( function(userId, callback) {
// 	phonyWebDb.Contact.findById(userId, function(err, user) {
// 		console.log(user);
// 	});
// });

for(var ii in ROUTES) {
    app.all(ROUTES[ii].path, ROUTES[ii].fn);
}

phonyWebDb.db.on('error', console.error.bind(console, 'connection error:'));
phonyWebDb.db.once('open', initialize);

function initialize() {
	
	http.createServer(app).listen(app.get('port'), function() {
		console.log('Express server listening on port ' + app.get('port'));
	});
}


