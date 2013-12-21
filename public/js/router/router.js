var PhonyWebRouter = Backbone.Router.extend({
	routes: {
		"": "messagesInbox",
		"inbox": "messagesInbox",
		"sent": "messagesSent",
		"contacts": "contacts",
		"billing": "billing",
		"*other": "error",
	},

	messagesInbox: function() {
		$('#contact-header').css('display', 'none');
		$('#contact-wrapper').css('display', 'none');
		$('#message-header').css('display', 'block');
		$('#message-wrapper').css('display', 'block');
		$('#bill-header').css('display', 'none');
		$('#bill-wrapper').css('display', 'none');
		$('#header-wrapper').html('Inbox');
		app.messagesInView.empty();
		app.Inboxes.fetch({data: {type: 'inbox'}});

	},

	messagesSent: function() {
		$('#contact-header').css('display', 'none');
		$('#contact-wrapper').css('display', 'none');
		$('#message-header').css('display', 'block');
		$('#message-wrapper').css('display', 'block');
		$('#bill-header').css('display', 'none');
		$('#bill-wrapper').css('display', 'none');
		$('#header-wrapper').html('Sent Items');
		app.messagesOutView.empty();
		app.Outboxes.fetch({data: {type: 'outbox'}});
	},

	contacts: function() {
		$('#message-header').css('display', 'none');
		$('#message-wrapper').css('display', 'none');
		$('#contact-header').css('display', 'block');
		$('#contact-wrapper').css('display', 'block');
		$('#bill-header').css('display', 'none');
		$('#bill-wrapper').css('display', 'none');
		$('#header-wrapper').html('Contact List');
		app.contactsView.empty();
		app.Contacts.fetch();
		
	},

	billing: function() {
		$('#message-header').css('display', 'none');
		$('#message-wrapper').css('display', 'none');
		$('#contact-header').css('display', 'none');
		$('#contact-wrapper').css('display', 'none');
		$('#bill-header').css('display', 'block');
		$('#bill-wrapper').css('display', 'block');
		$('#header-wrapper').html('Billing');
	},

	// quiz_available: function() {
	// 	$('#questions-wrapper').css('display', 'none');
	// 	$('#groups-wrapper').css('display', 'none');
	// 	$('#quizes-wrapper').css('display', 'block');
		

	// 	app.AllGroups.fetch();
	// 	app.Quizes.fetch();
	// 	$('.available-quiz-nav').addClass('active');
	// 	$('.current-quiz-nav').removeClass('active');
	// 	console.log('quiz-availble');
	// },

	// quiz_current: function() {
	// 	$('#quizes-wrapper').css('display', 'none');
	// 	$('#questions-wrapper').css('display', 'block');
	// 	$('#groups-wrapper').css('display', 'block');
	// 	$('.current-quiz-nav').removeClass('hide');

	// 	app.Groups.fetch({data: {quiz_id: localStorage.getItem('quiz_id')}});
	// 	if (localStorage.getItem('is_list') === 'true') {
	// 		app.QuestionNumbersView.empty();
	// 		app.Questions.reset();
	// 		app.Questions.fetch({data: {quiz_id: localStorage.getItem('quiz_id')}});		
	// 	}

	// 	$('.available-quiz-nav').removeClass('active');
	// 	$('.current-quiz-nav').addClass('active');
	// 	console.log('quiz-current');
	// 	// else if (localStorage.getItem('is_list') == 'false') {
	// 	// 	var question = new app.Question({id: localStorage.getItem('question_id'), index: localStorage.getItem('question_index')});
	// 	// 	question.fetch({data: {quiz_id: localStorage.get('quiz_id')}});
	// 	// 	//app.Questions.fetch({data: {quiz_id: 1}});
	// 	// 	var App2 = new app.QuestionView({model: question});
	// 	// }
	// 	// else {
	// 	// 	console.log('neither list nor detail set');
	// 	// }
	// },
	
	error: function() {
		alert('check yaself');
	}
});

app.PhonyWebRouter = new PhonyWebRouter;

Backbone.history.start();