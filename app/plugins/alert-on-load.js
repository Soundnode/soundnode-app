module.exports = function(app) {
	app.events.on('app:initialized', function() {
		console.log('App loaded.');
	});
};