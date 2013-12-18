var mongoose = require('mongoose');

if (process.env.MONGOHQ_URL) {
	console.log(process.env.MONGOHQ_URL);
	mongoose.connect('mongodb://heroku:8fe0e3b4ff8b4d35236a02ebf8348753@paulo.mongohq.com:10009/app20466087');
}
else {
	mongoose.connect('mongodb://local.host/phonyweb');
}

exports.db = mongoose.connection;
var contactSchema = mongoose.Schema({
	id: String,
	username: String,
	password: String,
	category: String,
	mobile_number: String
});

exports.Contact = mongoose.model('Contact', contactSchema);

var messageSchema = mongoose.Schema({
	response_id: String,
	sender_name: String,
	sender_mobile_number: String,
	created: Date,
	sent: Date,
	received: Date,
});

exports.Message = mongoose.model('Message', messageSchema);


var billSchema = mongoose.Schema({
	cost: Number,
	message_response_id: String,
	recipient_mobile_number: String,
	recipient_name: String,
	created: Date,
});

exports.Bill = mongoose.model('Bill', billSchema);


