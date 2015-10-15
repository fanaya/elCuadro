/* global DC */
/* global studio */
/* global Enabler */
/* global _getElement */
/* global _addClass */
/* global TweenLite */
/* global TimelineLite */
/* jshint undef: false, debug: true, devel: true */

//var clickTag = "http://www.hulu.com/start/nocommercials";


// Name Space ******
var BLT = {};
BLT.firstRun = true;
BLT.Animation = {};


// VIDEO -------------------
BLT.vid = {};
BLT.vid.isVideoPlaying = false;
BLT.vid.initVideo = false;
BLT.vid.videoDivID = 'myvideo';
BLT.vid.videoID = 'video';
BLT.vid.videoWidth = '970';
BLT.vid.videoHeight = '250';
BLT.vid.userVideoWidth = '448';
BLT.vid.userVideoHeight = '250';
BLT.vid.videoSrc = ['4yyfm_Q-dFE','kcPwvn3REoI','eWsCXE52v70','8N9DqtutSZ8'];
BLT.vid.videoControls = false;
BLT.vid.autoplay = true;
BLT.vid.muted = true;
BLT.vid.selectedVideo = 0;
BLT.vid.videoWrapper = _getElement("videoWrapper");
BLT.vid.videoContainerObj = _getElement("videoContainer");
BLT.vid.videobutton= _getElement("videoClick");

// Ad Ready
BLT.adReady = function () {

    console.log('<<< AD READY >>>');
  // Declare Vars
  var $ad = _getElement('ad');

  // Init Event
  this.initEvents();

  // Setup
  this.Animation.setup();

  // Ad is Ready
  _addClass($ad, 'ready');
  BLT.vid.setVideoAttributes();
};
// Init Events
BLT.initEvents = function () {
  // Declare Events
  var bgExits = _getElementByClass('bg-exit'),
      playVideoBtn = _getElement('playVideoButton'),
      mainCta = _getElement('cta');


  // Exit Events
  for (var bgExitIndex = 0; bgExitIndex < bgExits.length; bgExitIndex++) {
    bgExits[bgExitIndex].addEventListener('click', this.eventHandler_exit);
  }
   // Play Video
    playVideoBtn.addEventListener('click', this.eventHandler_playvideoClick);

    // Main Cta
    mainCta.addEventListener('click', this.eventHandler_exit);

  // close button
  var closeBtn = _getElement('ytClose_dc');
    closeBtn.addEventListener('click', handleCloseAd);
};
// CLOSE AD
handleCloseAd = function () {
  console.log('<<< CLOSE AD >>>');
    BLT.vid.killVideo();
    Enabler.reportManualClose();
};
// Exit Event Listener
BLT.eventHandler_exit = function () {
    BLT.vid.killVideo();
    //window.open(clickTag, '_blank');
    Enabler.exit("GENERAL EXIT");
};
BLT.eventHandler_playvideoClick = function(){
  // Play Video
  var $videoCap = _getElement('videoCap');
    TweenLite.set($videoCap, {  opacity : 0});
    if(BLT.vid.selectedVideo !== 0){
        console.log('<<< replay video >>>');
        _removeClass('videoWrapper','hide');
        BLT.vid.replayVideo();
    }else{
        console.log('<<< replay video  - via switch >>>');
        BLT.vid.selectedVideo = 3;
        BLT.vid.videoControls = 1;
        BLTvid.controls = BLT.vid.videoControls;
        BLT.vid.switchVideo();
    }

};
//// Animation
BLT.Animation.setup = function () {
  // Auto Reset End Card
    BLT.Animation.resetEndCard();

};
// sets the endcard elements in position to animate ------------------
BLT.Animation.resetEndCard = function () {
    console.log('<<<<<// BLT -------// RESET ENDCARD CALLED');
  // Declare Vars
  var $thumbnails = _getElement('thumbnails'),
      $tt = _getElement('tt'),
      $tag = _getElement('tag'),
      $ctaButton = _getElement('cta'),
      $videoCap = _getElement('videoCap');

      // Hide End Card
      TweenLite.set($thumbnails, {x : -700});
      TweenLite.set($videoCap, {  opacity : 0});
      TweenLite.set($tt, {  y : 250});
      TweenLite.set($tag, {y : 250});
      TweenLite.set($ctaButton, {y:250});
};
BLT.Animation.transformHelperMoveTo = function ($el, targetLeft, targetRight) {
  // Declare Vars
  var xOffset = $el.getAttribute('data-offsetX'),
      yOffset = $el.getAttribute('data-offsetX');

  // Auto Set Offsets if NONE exist - X
  if (typeof(xOffset) === 'undefined' || xOffset === null) {
    // Update Value Attribute
    xOffset = 0;

    // Set Attribute
    $el.setAttribute('data-offsetX', xOffset);
  } else {
    xOffset = parseInt(xOffset);
  }
  // Auto Set Offsets if NONE exist - X
  if (typeof(yOffset) === 'undefined' || yOffset === null) {
    // Update Value Attribute
    yOffset = 0;

    // Set Attribute
    $el.setAttribute('data-offsetY', yOffset);
  } else {
    yOffset = parseInt(yOffset);
  }

  // Return Result
  return "translate(" + (xOffset + targetLeft) + "px, " + (yOffset + targetRight) + "px)";
};
BLT.Animation.showEndCard = function () {
    console.log('<<<<<// BLT -------// ENDFRAME CALLED');
  // Declare Vars
    var $thumbnails = _getElement('thumbnails'),
        $tt = _getElement('tt'),
        $tag = _getElement('tag'),
        $videoCap = _getElement('videoCap'),
        $ctaButton = _getElement('cta');

    $mainLogoMove = this.transformHelperMoveTo($tt,0,0);
    $mainHeaderMove = this.transformHelperMoveTo($tag,0,0);
    $mainCtaMove = this.transformHelperMoveTo($ctaButton,0,0);
    $thumbnailsMove = this.transformHelperMoveTo($thumbnails,0,0);

    var timeline = new TimelineLite({paused : true});

    timeline.add(new TweenLite($videoCap,0.8, {opacity : 1, ease :  Expo.easeInOut}));
    timeline.add(new TweenLite($tt, 0.6, {transform : $mainLogoMove, ease :  Expo.easeInOut}), "-=0.5");
    timeline.add(new TweenLite($tag, 0.6, {transform : $mainHeaderMove, ease :  Expo.easeInOut}), "-=0.5");
    timeline.add(new TweenLite($ctaButton, 0.6, {transform : $mainCtaMove, ease :  Expo.easeInOut}), "-=0.5");
    timeline.add(new TweenLite($thumbnails, 0.8, {transform : $thumbnailsMove, ease :  Expo.easeOut}), "-=0.5");

    timeline.play();
};
BLT.Animation.showVideoCap = function () {
  console.log('>>>> show video cap');
    var $videoCap = _getElement('videoCap');
    TweenLite.to($videoCap, 1.5, {opacity : 1, ease : Quad.easeOut});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////
// VIDEO ////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

BLT.vid.videoComplete = function (){
    console.log('<<< Video Complete >>>');
    console.log("<< BLT.vid.initVideo = "+BLT.vid.initVideo);
    BLT.vid.isVideoPlaying = false;
    _addClass('videoWrapper','hide');

    if (BLT.firstRun) {
        BLT.firstRun = false; // Kill First Run
        BLT.vid.initVideo = false;
        _addClass('snd-icon', 'hidden'); // Hide Sound Icon
        _addClass('videoClick', 'hidden'); // Hide VideoButton
        _addClass('videoWrapper', 'smaller-video');
        BLT.Animation.showEndCard();
    } else if(!BLT.firstRun && BLT.vid.initVideo){
        BLT.vid.initVideo = false;
        _removeClass('videoWrapper', 'full-video');
        _addClass('videoWrapper', 'smaller-video');
        BLT.Animation.showEndCard();
    } else {
        BLT.Animation.showVideoCap();
    }

};

BLT.vid.videoClick = function (){
    console.log('<<< Video has been clicked >>>');
    if (BLT.firstRun){
      BLT.firstRun = false; // Kill First Run
      BLT.vid.isVideoPlaying = true;
      _addClass('snd-icon', 'hidden'); // Hide Sound Icon
      _addClass('videoClick', 'hidden'); // Hide VideoButton
      _addClass('videoWrapper', 'full-video');
      BLT.vid.videoControls = 1;
      BLTvid.controls = BLT.vid.videoControls;
      document.dispatchEvent(new CustomEvent("clickForSound"));
    } else {
        BLT.vid.killVideo();
        Enabler.exit("GENERAL EXIT");
     }
};

BLT.vid.killVideo = function (){
    if(BLT.vid.isVideoPlaying)
    {
        BLT.vid.isVideoPlaying = false;
        document.dispatchEvent(new CustomEvent("killVideo"));
        BLT.vid.videoComplete();
    }
};

// Setting video attributes ------------------------------------
BLT.vid.setVideoAttributes = function(){
    console.log('>>>> Setting video Attributes');

    //// ADD VIDEO ---------------------------------------------
    BLT.vid.initVideo = true;

    BLT.vid.videobutton.style.width = BLT.vid.videoWidth + "px !important";
    BLT.vid.videobutton.style.height = BLT.vid.videoHeight + "px !important";
    BLT.vid.videobutton.addEventListener('click', BLT.vid.videoClick);

    // setting youtube settings
    BLTvid.selectedVideo = BLT.vid.selectedVideo;
    BLTvid.containerId = "videoContainer";
    BLTvid.videoId = BLT.vid.videoSrc;
    BLTvid.videoWidth = BLT.vid.videoWidth;
    BLTvid.videoHeight = BLT.vid.videoHeight;
    if(!BLT.vid.videoControls){BLTvid.controls = 0;}
    if(!BLT.vid.autoplay){ BLTvid.autoplay = 2;} // Auto Play Default is set to 1 = yes

    BLT.vid.setThumbnails();

    document.dispatchEvent(new CustomEvent("setVideoProperties"));
    document.addEventListener('videoDone', BLT.vid.videoComplete, true);
};

BLT.vid.setThumbnails = function(){
    var $thumb1 = _getElement("thumb1"),
        $thumb2 = _getElement("thumb2"),
        $thumb3= _getElement("thumb3");

    $thumb1.addEventListener('click', BLT.vid.thumbClick);
    $thumb2.addEventListener('click', BLT.vid.thumbClick);
    $thumb3.addEventListener('click', BLT.vid.thumbClick);

    console.log("THUMBNAILS SET");
};
BLT.vid.thumbClick = function(e){
    console.log("Thumb click = "+ e.currentTarget);
    var $thumb1 = _getElement("thumb1"),
        $thumb2 = _getElement("thumb2"),
        $thumb3= _getElement("thumb3");

    switch(e.currentTarget){
        case $thumb1:
            BLT.vid.selectedVideo = 1;
            console.log("thumb 1 hit - switch Video");
            break;
        case $thumb2:
            BLT.vid.selectedVideo = 2;
            console.log("thumb 2 hit - switch Video");
            break;
        case $thumb3:
            BLT.vid.selectedVideo = 3;
            console.log("thumb 3 hit - switch Video");
            break;
    }
    BLT.vid.switchVideo();
};
BLT.vid.switchVideo = function(){
    _removeClass('videoWrapper','hide');
    BLTvid.selectedVideo = BLT.vid.selectedVideo;
    document.dispatchEvent(new CustomEvent("switchVideo"));
    BLT.vid.isVideoPlaying = true;
};

BLT.vid.replayVideo = function(){
    document.dispatchEvent(new CustomEvent("replayVideo"));
    BLT.vid.isVideoPlaying = true;
};


/////////
// Start Ad
BLT.adReady();