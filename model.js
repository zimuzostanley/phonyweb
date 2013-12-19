var mongoose = require('mongoose');

if (process.env.MONGOHQ_URL) {
	console.log(process.env.MONGOHQ_URL);
	mongoose.connect(process.env.MONGOHQ_URL);
}
else {
	mongoose.connect('mongodb://localhost/phonyweb');
}

var userSchema = mongoose.Schema({
	facebook_id: String,
	google_id: String,
	username: String,
	email: String
});

exports.User = mongoose.model('User', userSchema);

exports.db = mongoose.connection;
var contactSchema = mongoose.Schema({
	first_name: String,
	last_name: String,
	owner_email: String,
	mobile_number: String
});

exports.Contact = mongoose.model('Contact', contactSchema);

var messageSchema = mongoose.Schema({
	response_id: String,
	sender_email: String,
	receiver_mobile_number: String,
	text: String,
	sent: Date,
	received: Date
});

exports.Message = mongoose.model('Message', messageSchema);

var billSchema = mongoose.Schema({
	cost: Number,
	text: String,
	owner_email: String,
	recipient_first_name: String,
	recipient_last_name: String,
	recipient_mobile_number: String,
	created: Date,
});

exports.Bill = mongoose.model('Bill', billSchema);


