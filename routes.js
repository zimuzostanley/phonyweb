var db = require('./model.js');
var uu = require('underscore');

function indexfn(req, res) {

	// var bill = db.Bill({cost: 53});
	// bill.save();
	// db.Bill.find(function(err, bill) {
	// 	console.log(bill);
	// });
	console.log('User indexfn');
	console.log(req.user);
	if(req.loggedIn) {
		console.log(req.session.auth.fb.accessToken);
		res.render('index', {});
	}
	else {
		res.render('login', {});
	}
	
};


function messagefn(req, res) {

	if (req.route.method == 'get') {
		//console.log(req.param('email'));
		var email = req.param('email');
		var mobile_number = req.param('mobile_number');


		if (email) {
			db.Message.find({sender_email: req.user.email}, 'text', function(err, message) {
				res.send(message);
			});
		}
		else if (mobile_number) {
			db.Message.find({receiver_mobile_number: mobile_number}, 'text', function(err, message) {
				res.send(message);
			});
		}
		else {
			res.send({status: 'error'});
		}
	}

	else if (req.route.method == 'post') {
		var mobile_number = req.param('mobile_number');
		var response_id = req.param('response_id');
		var text = req.param('text');

		if (mobile_number && response_id) {
			//create a message using the current time and save in 'sent'
			var message = new db.Message({response_id: response_id, sender_email: req.user.email, receiver_mobile_number: mobile_number, text: text, sent: new Date()})
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
		db.Contact.find({owner_email: req.user.email}, function(err, contact) {
			res.send(contact);
		});
	}

	else if (req.route.method == 'post') {
		var first_name = req.param('first_name');
		var last_name = req.param('last_name');
		var mobile_number = req.param('mobile_number');

		if (first_name && last_name && mobile_number) {
			var contact = new db.Contact({first_name: first_name, last_name: last_name, mobile_number: mobile_number, owner_email: req.user.email });
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
			db.Contact.update({mobile_number: mobile_number, owner_email: req.user.email}, {first_name: first_name, last_name: last_name}, function(err, contact) {
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

		db.Contact.remove({mobile_number: mobile_number}, function(err, contact) {
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
	'/bill': billfn,
});

module.exports = ROUTES;