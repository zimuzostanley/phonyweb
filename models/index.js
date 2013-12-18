var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/phonyweb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', initialize);


function initialize() {
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
}

