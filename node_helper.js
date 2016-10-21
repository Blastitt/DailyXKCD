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
			var comic;
			var rndcomic;
			var rndUrl;
			var body;
			var d = new Date();
			var n = d.getDay(); 
			
			request(comicJsonUri, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					//console.log(body);
					if ( this.n == 1 || this.n == 3 || this.n == 5 ) {
							self.sendSocketNotification("COMIC", JSON.parse(body));
					} else {
						this.comic = JSON.parse(body); 
						this.rndcomic = Math.floor((Math.random() * this.comic.num) + 1); 
						this.rndUrl = "http://xkcd.com/" + this.rndcomic + "/info.0.json";
						request(this.rndUrl, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								//console.log(body);
								self.sendSocketNotification("COMIC", JSON.parse(body));
							}
						});
					}
				}
			});



			
		}
		
	},
});
