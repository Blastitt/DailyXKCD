Module.register("DailyXKCD", {

    // Default module config.
    defaults: {
        dailyJsonUrl : "http://xkcd.com/info.0.json",
        updateInterval : 10000 * 60 * 60, // 10 hours
        grayScale : false,
        invertColors : false,
        titleFont : "bright large light",
        altTextFont : "xsmall dimmed",
        limitComicHeight : 450,
        scrollInterval : 8000, // 8 seconds,
        scrollRatio : 0.8, // scroll by 80% of visible height,
        randomComic : false,
        showAltText : false,
        showTitle : true
    },

    start: function() {
        Log.info(this.config);
        Log.info("Starting module: " + this.name);

        this.dailyComic = "";
        this.dailyComicTitle = "";
        this.dailyComicAlt = "";

        this.autoIntervals = [];

        this.getComic();
        
        self = this;
        
        setInterval(function() {
            self.getComic();
        }, self.config.updateInterval);

        if (this.config.scrollInterval < 3000) {
            // animation takes 3 seconds
            this.config.scrollInterval = 3000;
        }

        // value should be between 0.0 and 1.0 
        this.config.scrollRatio = Math.max(this.config.scrollRatio, 0.0);
        this.config.scrollRatio = Math.min(this.config.scrollRatio, 1.0);

        if (this.config.limitComicHeight > 0)
        {
            var self = this;
            // scroll comic up and down
            this.addAutoSuspendingInterval(function() {
                self.scrollComic();
            }, this.config.scrollInterval);
            this.scrollProgress = 0;
        }
    },

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    // Define required styles.
    getStyles: function() {
        return ["xkcd.css"];
    },

    getComic: function() {
        Log.info("XKCD: Getting comic.");

        this.sendSocketNotification("GET_COMIC", {
            config: this.config
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "COMIC") {
            Log.info(payload.img);
            this.dailyComic = payload.img;
            this.dailyComicTitle = payload.safe_title;
            this.dailyComicAlt = payload.alt;
            this.updateDom(1000);
        }
    },

    notificationReceived: function(notification, payload, sender) {
        this.checkUserPresence(notification, payload, sender);
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");

        var title = document.createElement("div");
        title.className = this.config.titleFont;
        title.innerHTML = this.dailyComicTitle;

        if (this.config.showTitle) {
            wrapper.appendChild(title);
        }

        var comicWrapper = document.createElement("div");
        comicWrapper.className = "xkcdcontainer";
        if (this.config.limitComicHeight > 0)
        {
            comicWrapper.style.maxHeight = this.config.limitComicHeight + "px";
        }

        var xkcd = document.createElement("img");
        xkcd.id = "xkcdcontent";
        xkcd.src = this.dailyComic;
        if(this.config.grayScale || this.config.invertColors){
            xkcd.setAttribute("style", "-webkit-filter: " +
                                (this.config.grayScale ? "grayscale(100%) " : "") +
                                (this.config.invertColors ? "invert(100%) " : "") +
                                ";")
        }
        comicWrapper.appendChild(xkcd);

        wrapper.appendChild(comicWrapper);

        if (this.config.showAltText) {
            var alt = document.createElement("div");
            alt.className = this.config.altTextFont;
            alt.innerHTML = this.dailyComicAlt;
            wrapper.appendChild(alt);
        }

        return wrapper;
    },

    /* suspend()
     * This method is called when a module is hidden.
     */
    suspend: function() {
        this.scrollProgress = 0;

        // reset to beginning if module is suspended, so we start at the top
        var scrollable = document.getElementById("xkcdcontent");
        scrollable.style.top = "0px";

        for (var i = 0; i < this.autoIntervals.length; i++)
        {
            var current = this.autoIntervals[i];

            if (current.interval)
            {
                clearInterval(current.interval);

                current.interval = null;
            }
        }
    },

    /* resume()
     * This method is called when a module is shown.
     */
    resume: function() {
        for (var i = 0; i < this.autoIntervals.length; i++)
        {
            var current = this.autoIntervals[i];

            if (!current.interval)
            {
                current.callback();

                current.interval = setInterval(current.callback, current.time);
            }
        }
    },

    /* scrollComic
     * Scrolls the comic down if needed
     */
    scrollComic: function() {
        var scrollable = document.getElementById("xkcdcontent");

        var height = scrollable.naturalHeight;

        var top = 0;
        if (this.config.limitComicHeight > 0 && height > this.config.limitComicHeight)
        {
            var currentHeight = this.scrollProgress * -this.config.limitComicHeight * this.config.scrollRatio;
            var maxHeight = this.config.limitComicHeight - height;
            top = Math.max(currentHeight, maxHeight);
        }
        scrollable.style.top = top + "px";
        scrollable.style.height = height + "px";
        if (top == this.config.limitComicHeight - height)
        {
            this.scrollProgress = -1;
        }

        this.scrollProgress += 1;
    },

    /* checkUserPresence(notification, payload, sender)
     * Use this method to conveniently suspend your module when no user is present.
     */
    checkUserPresence: function(notification, payload, sender) {
        if (sender && notification === "USER_PRESENCE") {
            if (payload === true)
            {
                this.resume();
            }
            else
            {
                this.suspend();
            }
        }
    },

    /* addAutoSuspendingInterval(callback, time)
     * Use instead of setInterval for automatic pause when on suspend.
     * The callback is executed immediately once after the user returns.
     */
    addAutoSuspendingInterval: function(callback, time) {
        var newInterval = setInterval(callback, time);
        this.autoIntervals.push({
            callback: callback,
            interval: newInterval,
            time: time
        });
    }
});
