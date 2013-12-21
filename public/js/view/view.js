var app = app || {};
//Contact

app.ContactView = Backbone.View.extend({
	tagName: 'li',

	className: 'contact-row',

	initialize: function() {
		
	},

	template: _.template($('#contact-template').html()),

	events: {
		'click .send-message-row-btn': 'sendMessage',
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	sendMessage: function(data) {
		var that = this.model.toJSON();
		$(document).on('open', '[data-reveal]', {mobile_number: that.mobile_number, first_name: that.first_name, last_name: that.last_name}, function (event) {
			 $('#mobile-number-txtBx').val(event.data.mobile_number);
			 $('#first-name-txtBx').val(event.data.first_name);
			 $('#last-name-txtBx').val(event.data.last_name);
		});
		$('#recordModal').foundation('reveal', 'open');
	}

});

app.ContactsView = Backbone.View.extend({
	el: '#contact-wrapper',

	initialize: function() {
		
		this.listenTo(app.Contacts, 'all', this.render);
		this.listenTo(app.Contacts, 'add', this.addOne);
		console.log('in initialize contacts view');
		
	},

	render: function() {
		return this;
	},

	addOne: function(contact) {
		var view  = new app.ContactView({model: contact});
		//console.log(contact.toJSON());
		this.$el.append(view.render().el);
	},

	empty: function() {
		this.$el.empty();
	}
	
});
app.contactsView = new app.ContactsView;

app.MessageInView = Backbone.View.extend({
	tagName: 'li',

	className: 'message-row',

	template: _.template($('#message-template').html()),

	events: {
		'click .message-row': 'popup'
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	popup: function() {
		alert('To compose');
	}

});

app.MessagesInView = Backbone.View.extend({
	el: '#message-wrapper',

	initialize: function() {
		
		this.listenTo(app.Inboxes, 'all', this.render);
		this.listenTo(app.Inboxes, 'add', this.addOne);
		console.log('in initialize messages inbox view');
		
	},

	render: function() {
		return this;
	},

	addOne: function(message) {
		var view  = new app.MessageInView({model: message});
		console.log(message.toJSON());
		this.$el.append(view.render().el);
	},

	empty: function() {
		this.$el.empty();
	}
	
});

app.messagesInView = new app.MessagesInView;


app.MessageOutView = Backbone.View.extend({
	tagName: 'li',

	className: 'message-row',

	template: _.template($('#message-template').html()),

	events: {
		'click .message-row': 'compose'
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

app.MessagesOutView = Backbone.View.extend({
	el: '#message-wrapper',

	initialize: function() {
		
		this.listenTo(app.Outboxes, 'all', this.render);
		this.listenTo(app.Outboxes, 'add', this.addOne);
		console.log('in initialize message outbox view');
		
	},

	render: function() {
		return this;
	},

	addOne: function(message) {
		var view  = new app.MessagesOutView({model: message});
		this.$el.append(view.render().el);
	},

	empty: function() {
		this.$el.empty();
	}
	
});

app.messagesOutView = new app.MessagesOutView;

var ComposeView = Backbone.View.extend({
	el: '#recordModal',

	events: {
		'click #send-message-btn': 'sendMessage'
	},

	sendMessage: function() {
		var mobile_number = $('#mobile-number-txtBx').val();
		var text = $('#message-txtBx').val();
		var first_name = $('#first-name-txtBx').val();
		var last_name = $('#last-name-txtBx').val();


		console.log(mobile_number);
		console.log(text);
		console.log(first_name);
		console.log(last_name);
		$('#compose-form').trigger('submit');
		var outbox = new app.Outbox({mobile_number: mobile_number, text: text});
		outbox.save({success: function() {
				console.log('returns success message');
			}, error: function() {

		}});

		var contact = app.Contacts.findWhere({mobile_number: mobile_number});
		console.log("contac");
		console.log(contact);
		if (contact) {
			contact.set({mobile_number: mobile_number, first_name: first_name, last_name: last_name});
			console.log('Here');
		}
		else {
			contact = new app.Contact({mobile_number: mobile_number, first_name: first_name, last_name: last_name});
			contact.save({success: function() {
					$('#recordModal').foundation('reveal', 'close');
					console.log('returns success contact');
				}, error: function() {

			}});
		}
		
		
	}
});

app.ComposeView = new ComposeView;