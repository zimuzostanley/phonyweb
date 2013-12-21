var app = app || {};

app.ContactList = Backbone.Collection.extend({
	url: '/contact',

	model: app.Contact,
});

app.Contacts = new app.ContactList;


app.InboxList = Backbone.Collection.extend({
	url: '/message',

	model: app.Inbox,
});

app.Inboxes = new app.InboxList;

app.OutboxList = Backbone.Collection.extend({
	url: '/message',

	model: app.Outbox,
});

app.Outboxes = new app.OutboxList;

app.BillList = Backbone.Collection.extend({
	url: '/bill',

	model: app.Bill,
});

app.Bills = new app.BillList;
