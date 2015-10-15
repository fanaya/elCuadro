"use strict";
var DC = DC || {version : "v0.1.4.5"};
DC.init = function () {
  DC.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  DC.local = ((document.URL.search("http://localhost") > -1) ||
             (document.URL.search(/((((http|ftp|https):\/{2})[a-z0-9]+(\.local\/)))/) > -1) ||
             (document.URL.search("http://dev.monkapps") > -1))? true : false;
  DC.debug();
  if (typeof(Enabler) != "undefined") {
    if (Enabler.isInitialized()) {
      DC.politeInit();
    } else {
      Enabler.addEventListener(studio.events.StudioEvent.INIT, DC.politeInit);
    }
  } else {
    setTimeout(DC.init, 50);
  }
};
DC.politeInit = function () {
  if (Enabler.isPageLoaded()) {
    DC.getConfig();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, DC.getConfig);
  }
};
DC.getConfig = function () {
  if (typeof config !== 'undefined') {
    loadScript(Enabler.getUrl(config));
  } else {
    DC.debug("No config found");
    document.dispatchEvent(new CustomEvent(DC.events.CORE_READY));
  }
};
DC.initConfig = function (data) {
  DC.config = data;
  DC.debug("config ready");
  DC.initCore();
};
DC.initCore = function () {
  Enabler.addEventListener(studio.events.StudioEvent.EXIT, DC.onExit);
  if (!DC.config || !DC.config.libs) {
    document.dispatchEvent(new CustomEvent(DC.events.CORE_READY));
    return;
  }
  if (DC.config.libs.length) {
    var loader = new DC.loader(DC.config.libs);
    loader.load();
  } else {
    document.dispatchEvent(new CustomEvent(DC.events.CORE_READY));
  }
};
DC.onExit = function () {
  DC.dispatchEvent(DC.events.EXIT);
};
DC.libLoaded = function (e) {
  DC.libs = DC.libs || {};
  DC.libs[e.lib] = e.o;
  DC.libs.length = DC.libs.length || 0;
  DC.libs.length++;
  if (DC.config.libs.length == DC.libs.length) {
    document.dispatchEvent(new CustomEvent(DC.events.CORE_READY));
  }
};
DC.loader = function (files, complete) {
  var total = files.length;
  var loaded = 0;
  this.complete = complete;
  this.fileLoaded = function (e) {
    loaded++;
    if (loaded == total) {
      if (this.complete) {
        this.complete();
      }
    }
  };
  this.load = function () {
    for (var i = 0; i < total; i++) {
      loadScript(files[i], this.fileLoaded.bind(this));
    }
  }
};
DC.dispatchEvent = function (e, args) {
  if (DC.eventslist[e]) {
    DC.debug("[event] " + e);
    DC.eventslist[e](args);
  }
};
DC.addEventListener = function (e, callback) {
  DC.eventslist = DC.eventslist || {};
  DC.eventslist[e] = callback;
};
DC.events = {
  VideoEvents     : {
    HIDE            : "video_hidden",
    CLICK           : "click_video",
    COMPLETE        : "complete",
    TIMER           : "timer",
    CLOSE           : "close",
    PLAY            : "play",
    EXIT_FULLSCREEN : "exit_fullscreen"
  },
  CORE_READY      : "core_ready",
  LIB_READY       : "lib_ready",
  EXIT            : "exit",
  EXPAND          : "expand",
  COLLAPSE        : "collapse",
  FINISH_EXPAND   : "finishexpand",
  FINISH_COLLAPSE : "finishcollapse"
};


DC.debug = function (e) {
  if (DC.local === true) {
    if (console) {
      console.debug(DC.version, "[core.dc]", e || "")
    }
  }
};

// Helper Scripts
function loadScript(url, callback) {
  var s = document.createElement("script");
  s.type = "text/javascript";
  if (s.readyState) {
    s.onreadystatechange = function () {
      if (s.readyState == "loaded" || s.readyState == "complete") {
        s.onreadystatechange = null;
        if (callback) {
          callback();
        }
      }
    };
  } else {
    s.onload = function () {
      if (callback) {
        callback();
      }
    };
    s.onerror = function (e) {
      DC.debug("ERROR LOADING SCRIPT");
    };
  }
  s.src = url;
  document.body.appendChild(s);
}
/* CustomEvent Polyfill*/
(function () {
  function CustomEvent(e, p) {
    p = p || {bubbles : false, cancelable : false, detail : undefined};
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(e, p.bubbles, p.cancelable, p.detail);
    return evt;
  };
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();
/* Class Extends */
var __extends = this.__extends || function (d, b) {
    for (var p in b) {
      if (b.hasOwnProperty(p)) {
        d[p] = b[p];
      }
    }
    function __() {
      this.constructor = d;
    }

    __.prototype = b.prototype;
    d.prototype = new __();
  };

// Listen For Lib Ready
DC.addEventListener("lib_ready", DC.libLoaded);

// Load Ad
window.addEventListener("load", DC.init);

