var request = require('request');
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	
	start: function() {
		console.log("Starting node helper: " + this.name);
		
	},
	
	socketNotificationReceived: function(notification, payload) {
		var self = this;
		console.log("Notification: " + notification + " Payload: " + payload);
		
		if(notification === "GET_COMIC") {
			
			var comicJsonUri = payload.config.dailyJsonUrl;

			var date = new Date();
			var dayOfWeek = date.getDay();
			
			request(comicJsonUri, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					if (!payload.config.randomComic) {
						// if we are not replacing "old" comics with random ones
						self.sendSocketNotification("COMIC", JSON.parse(body));
						return;
					}

					// otherwise select a random comic based on day of week
					if (dayOfWeek == 1 || dayOfWeek == 3 || dayOfWeek == 5) {
						self.sendSocketNotification("COMIC", JSON.parse(body));
					} else {
						var comic = JSON.parse(body);
						var randomNumber = Math.floor((Math.random() * comic.num) + 1);
						// use "randomNumber = 1732;" to test with long comic
						var randomUrl = "http://xkcd.com/" + randomNumber + "/info.0.json";
						request(randomUrl, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								self.sendSocketNotification("COMIC", JSON.parse(body));
							}
						});
					}
				}
			});
		}
	},
});
