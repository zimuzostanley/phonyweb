var app = app || {};

app.ContactList = Backbone.Collection.extend({
	url: 'http://localhost:8000/quickquiz/question',

	model: app.Contact,
	
});


app.MessageList = Backbone.Collection.extend({
	url: 'http://localhost:8000/quickquiz/group/',

	model: app.Message,
});

app.BillList = Backbone.Collection.extend({
	url: 'http://localhost:8000/quickquiz/group/',

	model: app.Bill,
});
