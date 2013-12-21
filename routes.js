var http = require('http');
var querystring = require('querystring');
var db = require('./model.js');
var uu = require('underscore');
var async = require('async');

//im passing a reference to response so i can return responses to browser from here 
function fonenode(path, method, headers, data, request, response, callback) {
	var options = {
		hostname: 'api.fonenode.com',
		auth: '0cb8bbe4:DaOGCT1gFvd9dKIn',
		path: path,
		method: method,
		headers: headers
	};

	var req = http.request(options, function(res) {
		res.on('data', function(chunk) {
			console.log('BODY ' + chunk);
			error = JSON.parse(chunk).errors
			if (!error || error !== 0) {
				//console.log(error.length);
				callback(request, response, JSON.parse(chunk));
			}
		});
	});

	req.on('error', function(e) {
		console.log('Problem with request' + e.message);
		response.send({status: 'error'});
	});
	req.write(data);
	req.end();
}

function indexfn(req, res) {


	// if(req.loggedIn) {
	// 	res.render('template/index.html', {});
	// }
	// else {
	// 	res.render('template/login.html', {});
	// }
	res.sendfile('template/index.html', {});
};


function messagefn(req, res) {

	if (req.route.method == 'get') {
		
		var type = req.param('type');

		if (type == 'outbox') {
			db.Message.find({sender_id: 'req.user.id'}, function(err, message) {

				res.send(message);
			});
		}
		else if (type == 'inbox') {
			//db.Message.find({receiver_mobile_number: 'req.user.mobile_number'}, 'text', function(err, message) {
			db.Message.find({receiver_mobile_number: '08066595064'}, function(err, message) {
				if (err) console.log(err);
				console.log(message);
				console.log('message');
				res.send(message);
			});
		}
		else {
			res.send({status: 'error'});
		}
	}

	else if (req.route.method == 'post') {
		var mobile_number = req.param('mobile_number');
		var text = req.param('text');

		console.log(mobile_number);
		console.log(text);

		var data = querystring.stringify({
			'text': text,
			'to': mobile_number
		});

		var headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(data)
		};

		var callback = function(request, response, data) {
			if (request.param('mobile_number') && request.param('text')) {
				console.log('if works');
				var message = new db.Message({sender_id: 'request.user.id', receiver_mobile_number: request.param('mobile_number'), text: request.param('text'), sent: new Date()})
				message.save(function(err, message) {
					if (err) {
						res.send({status: 'error'});
					}
					else {
						res.send({status: 'ok'});
					}
				});
				
			}
			else {
				res.send({status: 'error'});
			}
		}

		fonenode('/v1/calls/quick', 'POST', headers, data, req, res, callback);		
	}

	else if (req.route.method == 'del') {
		var response_id = req.param('response_id');

		if (response_id) {
			db.Message.remove({response_id: response_id}, function(err, message) {
				if(err) {
					res.send({status: 'error'});
				}
				else {
					res.send({status: 'ok'});
				}
			});
		}
		else {
			res.send({status: 'error'});
		}
	}

	else {
		res.send({status: 'error'});
	}
};

function contactfn(req, res) {
	if (req.route.method == 'get') {
		db.Contact.find({owner_email: 'req.user.email'}, function(err, contact) {
			res.send(contact);
		});
	}

	else if (req.route.method == 'post') {
		var first_name = req.param('first_name');
		var last_name = req.param('last_name');
		var mobile_number = req.param('mobile_number');


		if (first_name && last_name && mobile_number) {
			var contact = new db.Contact({first_name: req.param('first_name'), last_name: req.param('last_name'), mobile_number: req.param('mobile_number'), owner_email: 'req.user.email' });
			contact.save(function(err, contact) {
				if (err) {
					res.send({status: 'error'});
				}
				else {
					res.send({status: 'ok'});
				}
			});
		}
		else {
			res.send({status: 'error'});
		}
	}

	else if (req.route.method == 'put') {
		var mobile_number = req.param('mobile_number');
		var first_name = req.param('first_name');
		var last_name = req.param('last_name');

		if (mobile_number) {
			db.Contact.update({mobile_number: mobile_number, id: 'req.user.id'}, {first_name: first_name, last_name: last_name}, function(err, contact) {
				if(err) {
					res.send({status: 'error'});
				}
				else {
					res.send({status: 'ok'});
				}
			});
		}
		else {
			res.send({status: 'error'});
		}
	}

	else if (req.route.method == 'del') {
		var mobile_number = req.param('mobile_number');

		db.Contact.remove({mobile_number: mobile_number, id: 'req.user.id'}, function(err, contact) {
			if(err) {
				res.send({status: 'error'});
			}
			else {
				res.send({status: 'ok'});
			}
		});
	}

	else {
		res.send({status: 'error'});
	}
};

function billfn(req, res) {
	if (req.route.method == 'get') {
		db.Bill.find({owner_email: req.user.email}, function(err, bill) {
			res.send(bill);
		});
	}

	else if (req.route.method == 'post') {
		var cost = req.param('cost');
		var recipient_mobile_number = req.param('recipient_mobile_number');
		var recipient_first_name = req.param('recipient_first_name');
		var recipient_last_name = req.param('recipient_last_name');
		var message_text = req.param('message_text');

		if (cost && recipient_last_name && recipient_first_name && recipient_mobile_number && message_text) {
			var bill = new db.Bill({owner_email: req.user.email, cost: cost, recipient_mobile_number: recipient_mobile_number, recipient_first_name: recipient_first_name, recipient_last_name: recipient_last_name, message_text: message_text, created: new Date() });
			contact.save(function(err, contact) {
				if (err) {
					res.send({status: 'error'});
				}
				else {
					res.send({status: 'ok'});
				}
			});
		}
		else {
			res.send({status: 'error'});
		}

	}

	else {
		res.send({status: 'error'});
	}
};

function detailfn(req, res) {
	if (req.route.method == 'get') {
		var callback = function(request, response, data) {
			response.send(data);
		};
		
		fonenode('/v1/calls/'+req.param('call_id'), 'GET', '', '', req, res, callback);		
	}
}



var define_route = function(dict) {
	var toroute = function(item) {
		return uu.object(uu.zip(['path', 'fn'], [item[0], item[1]]));
	}
	return uu.map(uu.pairs(dict), toroute);
};

var ROUTES = define_route({
	"/": indexfn,
	'/message': messagefn,
	'/message/:response_id': messagefn,
	'/contact': contactfn,
	'/contact/:mobile_number': contactfn,
	'/detail/:call_id': detailfn,
	'/bill': billfn,
});

module.exports = ROUTES;