var https = require('https');
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	
	start: function() {
		console.log("Starting node helper: " + this.name);
		
	},
	
	socketNotificationReceived: function(notification, payload) {
		var self = this;
		console.log("Notification: " + notification + " Payload: " + payload);
		
		if(notification === "GET_COMIC") {
			
			var comicHostname = payload.config.hostname;
			var comicDailyJsonUrlPath = payload.config.dailyJsonUrlPath;

			var date = new Date();
			var dayOfWeek = date.getDay();
			
			const httpsoptions = {
				  hostname: comicHostname,
				  port: 443,
				  path: comicDailyJsonUrlPath,
				  method: 'GET'
			}
			const req = https.request(httpsoptions, res => {
				if (res.statusCode == 200){
					res.on('data', body => {
						if (!payload.config.randomComic || dayOfWeek == 1 || dayOfWeek == 3 || dayOfWeek == 5) {
							
							self.sendSocketNotification("COMIC", JSON.parse(body));
							return;
							
						} else {
							var comic = JSON.parse(body);
							var randomNumber = Math.floor((Math.random() * comic.num) + 1);
							// use "randomNumber = 1732;" to test with long comic
							var randomUrlPath = "/" + randomNumber + "/info.0.json";
							const httpsoptions2 = {
								  hostname: comicHostname,
								  port: 443,
								  path: randomUrlPath,
								  method: 'GET'
							}
							const req2 = https.request(httpsoptions2, res2 => {
								if (res2.statusCode == 200) {
									res2.on('data', body2 => {
										self.sendSocketNotification("COMIC", JSON.parse(body2));
									});
								}
							});
							req2.end();
						}
					});
				}
			});
			
			req.end();
		}
	}
});
