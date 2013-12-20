var app = app || {};
//Contact

app.ContactView = Backbone.View.extend({
	tagName: 'li',

	className: 'contact-row',

	template: _.template($('#contact-template').html()),

	events: {
		'click .contact-row': 'compose'
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

var ComposeView = Backbone.View.extend({
	el: '#recordModal',

	events: {
		'click #send-message-btn': 'sendMessage'
	},

	sendMessage: function() {
		var mobile_number = $('#mobile-number-txtBx').val();
		var text = $('#message-txtBx').val();
		console.log(mobile_number);
		console.log(text);
		$('#compose-form').trigger('submit');
		var message = new app.Message({mobile_number: mobile_number, text: text});
		message.save({success: function() {
			$('#recordModal').foundation('reveal', 'close');
			console.log('returns success');
		}, error: function() {

		}});

	}
});

app.ComposeView = new ComposeView;