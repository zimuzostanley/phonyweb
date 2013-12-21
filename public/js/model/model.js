var app = app || {};

app.Contact = Backbone.Model.extend({
	urlRoot: '/contact',
});


app.Inbox = Backbone.Model.extend({
	url: '/message',

});

app.Outbox = Backbone.Model.extend({
	url: '/message',

});

app.Bill = Backbone.Model.extend({
	url: '/bill',

});

app.MessageDetail = Backbone.Model.extend({
	url: '/detail',
});
