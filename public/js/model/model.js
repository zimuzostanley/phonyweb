var app = app || {};

app.Contact = Backbone.Model.extend({
	url: '/contact',
});


app.Message = Backbone.Model.extend({
	url: '/message',

});

app.Bill = Backbone.Model.extend({
	url: '/bill',

});
