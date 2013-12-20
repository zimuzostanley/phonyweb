var app = app || {};

app.ContactList = Backbone.Collection.extend({
	url: '/contact',


	model: app.Contact,
	
});


app.MessageList = Backbone.Collection.extend({
	url: '/message',

	model: app.Message,
});

app.BillList = Backbone.Collection.extend({
	url: '/bill',

	model: app.Bill,
});
