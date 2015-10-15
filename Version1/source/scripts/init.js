/* jshint undef: false */


// Video Shiv
//document.createElement('video');
//document.createElement('audio');
//document.createElement('track');

var BLTinit = {};
BLTinit.GS = "js/vendor.js";
BLTinit.DC_core = "js/dc/core.dc.js";
BLTinit.DC_YTvideo = "js/dc/core.yt.video.js";
BLTinit.jsFiles = [BLTinit.DC_core,BLTinit.DC_YTvideo,BLTinit.GS,"js/main.js"];

BLTinit.loadUnitAssets = function()
{
  var totalFiles = BLTinit.jsFiles.length - 1;
  var currentLoaded = 0;

  function loadNextJS()
  {

    if(totalFiles > currentLoaded)
    {
      currentLoaded++;
      //console.log('currentLoaded = '+currentLoaded);
      BLTinit.loadExtJS(BLTinit.jsFiles[currentLoaded],loadNextJS);
    }else
    {
      console.log('All JS files loaded');
    }
  }
  //console.log('currentLoaded = '+currentLoaded);
  BLTinit.loadExtJS(BLTinit.jsFiles[currentLoaded],loadNextJS);
};

BLTinit.loadExtJS = function (url, callback)
{
  var script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState){  //IE
    script.onreadystatechange = function(){
      if (script.readyState === "loaded" ||   script.readyState === "complete"){
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {  //Others
    script.onload = function(){
      callback();
    };
  }

  script.src = url;
  //console.log('currentLoaded URL = '+url);
  document.getElementsByTagName("head")[0].appendChild(script);
};

//// DOM Helpers
// Get Element
function _getElement(id) {
  return document.getElementById(id);
}
function _getElementByClass(className) {
  return document.getElementsByClassName(className);
}

function _addClass(element, classes) {
  var Element = (typeof element === 'string') ? _getElement(element) : element,
      classNames = Element.className;

  if (classNames.indexOf(classes) === -1) {
    classNames = classNames + " " + classes;
    classNames = classNames.replace(/\s{2,}/g, ' ').replace(/^ +/gm, '').replace(/\s+$/, '');
    Element.className = classNames;
  }
}

function _removeClass(element, className) {
  // Declare Vars
  var Element = (typeof element === 'string') ? _getElement(element) : element,
      classNames = Element.className;

  // Clean up Class Names
  classNames = classNames.replace(className, '');
  classNames = classNames.replace(/\s{2,}/g, ' ').replace(/^ +/gm, '').replace(/\s+$/, '');

  // Update Class Names
  Element.className = classNames;
}

// Site Ready
window.onload = BLTinit.loadUnitAssets();