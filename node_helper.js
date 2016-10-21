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
      var comicDays = [ 1,3,5 ];
			var today = new Date();
			var dayNum = new Date().getDay(); 
			
			request(comicJsonUri, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					if ( comicDays.indexOf(dayNum) ) {
                            console.log("New Comic");
							self.sendSocketNotification("COMIC", JSON.parse(body));
					} else {
                        console.log("Random Comic");
                        var comic = JSON.parse(body); 
                        var rndcomic = Math.floor((Math.random() * this.comic.num) + 1); 
                        var rndUrl = "http://xkcd.com/" + this.rndcomic + "/info.0.json";
                        request(this.rndUrl, function (error, response, body) {
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
