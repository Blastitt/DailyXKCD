Module.register("DailyXKCD",{
	
	// Default module config.
	defaults: {
		dailyJsonUrl : "http://xkcd.com/info.0.json",
		updateInterval : 10000 * 60 * 60, // 10 hours
		invertColors : false,
		titleFont : "bright large light",
		showAltText : false

	},
	
	start: function() {
		Log.info(this.config);
		Log.info("Starting module: " + this.name);
		
		this.dailyComic = "";
		this.dailyComicTitle = "";
		this.dailyComicAlt = "";
		
		this.getComic();
	},
	
	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},
	
	getComic: function() {
		Log.info("XKCD: Getting comic.");
		
		this.sendSocketNotification("GET_COMIC", {config: this.config});
	},
	
	socketNotificationReceived: function(notification, payload) {
		
		if(notification === "COMIC"){
				Log.info(payload.img);
				this.dailyComic = payload.img;
				this.dailyComicTitle = payload.safe_title;
				this.dailyComicAlt = payload.alt;
				this.scheduleUpdate();
		}
		
	},
	
	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		
		var title = document.createElement("div");
		title.className = this.config.titleFont;
		title.innerHTML = this.dailyComicTitle;
		
		var xkcd = document.createElement("img");
		xkcd.src = this.dailyComic;
		if(this.config.invertColors){
			xkcd.setAttribute("style", "-webkit-filter: invert(100%);")
		}

		wrapper.appendChild(title);
		wrapper.appendChild(xkcd);

		if (this.config.showAltText)
		{
			var alttext = document.createElement("div");
			alttext.className = "xsmall dimmed thin";
			alttext.innerHTML = this.dailyComicAlt;

			wrapper.appendChild(alttext);
		}

		return wrapper;
	},
	
	scheduleUpdate: function() {
		var self = this;
		
		self.updateDom(2000);
		
		setInterval(function() {
			self.getComic();
		}, this.config.updateInterval);
	}
	
});
