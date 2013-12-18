var app = app || {};
//Contact

app.ContactView = Backbone.View.extend({
	el: 'li',

	template: _.template($('#contact-template').html()),

	events: {
		
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.render();
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

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

	addOne: function(question_number) {
		var view  = new app.QuestionNumberView({model: question_number});
		this.$el.append(view.render().el);
	},

	empty: function() {
		this.$el.empty();
	}
	
});