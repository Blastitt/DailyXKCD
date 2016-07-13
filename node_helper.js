var request = require('request');
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	
	start: function() {
		console.log("Starting node helper: " + this.name);
		
	},
	
	socketNotificationReceived: function(notification, payload) {
		var self = this;
		console.log("Notification: " + notification + " Payload: " + payload);
		
		if(notification === "GET_COMIC"){
			
			var comicJsonUri = payload.config.dailyJsonUrl;
			
			request(comicJsonUri, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(body);
					self.sendSocketNotification("COMIC", JSON.parse(body));
					console.log(JSON.parse(body).img);
					
				}
			});
			
		}
		
	},
});
