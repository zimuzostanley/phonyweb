var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var phonyWebDb = require('./model.js');
var conf = require('./config.js');
var MongoStore = require('connect-mongo')(express);
var everyauth = require('everyauth');
var util = require('util');
var ROUTES = require('./routes');

everyauth.debug = true;

everyauth.everymodule.findUserById(function(userId, callback) {
	phonyWebDb.User.findById(userId, function(err, user) {
		if (err) {
			return callback(err);
		}
		callback(null, user);
	});
});

// var findOrCreateFBUser = function(session, accessToken, accessTokExtra, fbUserMetadata) {
// 	
// }

everyauth.google
  	.appId(conf.google.clientId)
  	.appSecret(conf.google.clientSecret)
  	.scope('https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds/')
  	.findOrCreateUser( function (sess, accessToken, extra, googleUser) {
    	googleUser.refreshToken = extra.refresh_token;
    	googleUser.expiresIn = extra.expires_in;
    	console.log(util.inspect(googleUser));
    	var promise = this.Promise();
		console.log("in google");
		console.log(accessToken);
 		phonyWebDb.User.findOne({google_id: googleUser.id}, function(err, user) {
 			if (!user) {
 				console.log('new user');
 				var usergoogle = new phonyWebDb.User({google_id: googleUser.id});
 				usergoogle.save(function(err, ok) {
 					console.log('In insert fb user');
 					if(err) {
 						console.log("in db Error");
 						promise.fail('db error');
 					}
 					else {
 						promise.fulfill(usergoogle);
 						console.log('in first fulfill user');
 					}
 				});
 			}
 			else if (user) {
 				console.log('old user');
 				if (user.blacklisted == true) {
 					return promise.fail('denied');
 				}
 				console.log('In second fulfill user');
 				promise.fulfill(user);
 				
 			}
 		});
		return promise;
  	})
  	.redirectPath('/');

 everyauth.facebook
	.appId(conf.fb.appId)
	.appSecret(conf.fb.appSecret)
	.scope('email')
	.findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
		//find or create user logic here
		var promise = this.Promise();
		console.log("in facebook");
		console.log(accessToken);
		console.log(util.inspect(fbUserMetadata));
 		phonyWebDb.User.findOne({facebook_id: fbUserMetadata.id}, function(err, user) {
 			if (!user) {
 				console.log('new user');
 				var userfb = new phonyWebDb.User({facebook_id: fbUserMetadata.id});
 				userfb.save(function(err, ok) {
 					console.log('In insert fb user');
 					if(err) {
 						console.log("in db Error");
 						promise.fail('db error');
 					}
 					else {
 						promise.fulfill(userfb);
 						console.log('in first fulfill user');
 					}
 				});
 			}
 			else if (user) {
 				console.log('old user');
 				if (user.blacklisted == true) {
 					return promise.fail('denied');
 				}
 				console.log('In second fulfill user');
 				promise.fulfill(user);
 				
 			}
 		});
		return promise;
		
	})
	.handleAuthCallbackError( function (req, res) {
        res.send('AuthCallback error occurred');
    })
	.redirectPath('/');

var app = express();

app.configure('development', function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	//app.use(express.logger());
	app.use(express.favicon());
	app.use(express.bodyParser());
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
	app.use(express.bodyParser());
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


