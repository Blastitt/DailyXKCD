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

			var d = new Date();
			var n = d.getDay();
			
			request(comicJsonUri, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					if (n == 1 || n == 3 || n == 5) {
						self.sendSocketNotification("COMIC", JSON.parse(body));
					} else {
						var comic = JSON.parse(body);
						var randomUrl = "http://xkcd.com/" + Math.floor((Math.random() * comic.num) + 1) + "/info.0.json";
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
