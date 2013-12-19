var app = app || {};
//Contact

app.ContactView = Backbone.View.extend({
	tagName: 'li',

	className: 'contact-row',

	template: _.template($('#contact-template').html()),

	events: {
		'click .contact-row': compose
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	compose: function() {
		alert('To compose');
	}

});

app.ContactsView = Backbone.View.extend({
	el: '#ul-wrapper',

	initialize: function() {
		
		this.listenTo(app.Questions, 'all', this.render);
		this.listenTo(app.Questions, 'add', this.addOne);
	},

	render: function() {
		return this;
	},

	addOne: function(contact) {
		var view  = new app.ContactView({model: contact});
		this.$el.append(view.render().el);
	},

	empty: function() {
		this.$el.empty();
	}
	
});