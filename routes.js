var db = require('./models/index.js');
var uu = require('underscore');

function indexfn(req, res) {

	var bill = db.Bill({cost: 53});
	bill.save();
	db.Bill.find(function(err, bill) {
		console.log(bill);
	});
	var loggedIn = true;
	if(loggedIn) {
		res.render('login', {});
	}
	else {
		res.render('index', {});
	}
	
};


function messagefn(req, res) {

};

function contactfn(req, res) {

};

function billfn(req, res) {

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
	'/contact': contactfn,
	'/bill': billfn,
});

module.exports = ROUTES;