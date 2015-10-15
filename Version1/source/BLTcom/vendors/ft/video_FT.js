//console.log("FT Video JS File loaded");

BLT.FTV = {}; //// Video
BLT.myFT = new FT();

BLT.FTV.videoPlayer = BLT.myFT.insertVideo();

// Video Variables ******

//BLT.Vid.isVideoPlaying = false;
//BLT.Vid.initVideo = false;
//BLT.Vid.videoDivID = 'mainVideo';
//BLT.Vid.videoID = 'video1';
//BLT.Vid.videoDimensions = [['970','250'],['446','250']];
//BLT.Vid.videoSrc = ['video1','video2'];
////BLT.Vid.videoThumbs = ['show1','show2','show3'];
//BLT.Vid.currentVideo = 0;
//BLT.Vid.selectedVideo = 1;
//BLT.Vid.videoControls = true;
//BLT.Vid.autoplay = true;
//BLT.Vid.muted = true;
////BLT.Vid.videoPlayer = BLT.myFT.insertVideo();
//BLT.Vid.videoWrapper = _getElement("videoWrapper");
//BLT.Vid.videoContainerObj = _getElement("videoContainer");
//BLT.Vid.videobutton = _getElement("videoClick");


//////////////////////////////////////////////////////
//// VIDEO ///////////////////////////////////////////
//////////////////////////////////////////////////////

BLT.FTV.initVideo = function () {


    BLT.FTV.setVideoAttr();
    BLT.FTV.buildVideo();
    BLT.FTV.setVideoEvents();

};

// SET VIDEO ------------------------------------
BLT.FTV.setVideoAttr = function() {
    BLT.Vid.initVideo = true;
    BLT.FTV.videoSize(BLT.Vid.videoDimensions[0],BLT.Vid.videoDimensions[1]);
    //_removeClass(BLT.Vid.videoWrapper,'hide');
   //if(BLT.Vid.videoThumbs){BLT.Vid.setThumbnails();}
};

BLT.FTV.buildVideo = function(){
    //// ADD VIDEO ---------------------------------------------
    BLT.FTV.videoPlayer = BLT.myFT.insertVideo({
        video: BLT.Vid.videoSrc[BLT.Vid.currentVideo],
        parent: BLT.Vid.videoContainerObj,
        autoplay: BLT.Vid.autoplay,
        muted: BLT.Vid.muted,
        controls: BLT.Vid.videoControls,
        controlsParent: BLT.Vid.videoContainerObj
    });
    BLT.FTV.videoControlsToggle(false);
};

BLT.FTV.setVideoEvents = function(){

    BLT.Vid.videobutton.addEventListener('click', BLT.FTV.videoClick);
    BLT.Vid.videoContainerObj.addEventListener('ended', BLT.FTV.videoComplete,true);
    BLT.FTV.videoPlayer.addEventListener('tracker', BLT.FTV.videoTracker,true);

    window.addEventListener(BLT.FTV.videoEvents.CLICK,BLT.Vid.videoClick,true);
    window.addEventListener(BLT.FTV.videoEvents.COMPLETE,BLT.Vid.videoComplete,true);
    window.addEventListener(BLT.FTV.videoEvents.PLAY,BLT.Vid.videoReady,true);
    window.addEventListener(BLT.FTV.videoEvents.KILL,BLT.FTV.killVideo,true);
    window.addEventListener(BLT.FTV.videoEvents.REPLAY,BLT.FTV.replayVideo,true);

};

//// VIDEO REPLAY ----------------
//BLT.Vid.Core.replayVideo = function(){
//    console.log('<<< REPLAY VIDEO >>>');
//    _removeClass(BLT.Vid.videoWrapper, 'hide');
//    _addClass('videoCap', 'hide');
//    BLT.Vid.setUserVideo(BLT.Vid.selectedVideo);
//};

//// VIDEO COMPLETED ----------------
BLT.FTV.videoComplete = function () {
    console.log('<<< FTV //---   Video Complete');
    BLT.Vid.isVideoPlaying = false;
    _addClass(BLT.Vid.videoWrapper, 'hide');
    dispatchEvent(new Event(BLT.FTV.videoEvents.COMPLETE));
};

//// VIDEO HAS BEEN CLICKED ----------------
BLT.FTV.videoClick = function () {
    console.log('<<< FTV //---    Video has been clicked');
    //dispatchEvent(new Event(BLT.FTV.videoEvents.CLICK));
    if (BLT.Vid.initVideo)
    {
        console.log('<<< Initial Video play >>>');
        dispatchEvent(new Event(BLT.FTV.videoEvents.CLICK));
    } else {
        console.log('<<< User Video play >>>');
        BLT.eventHandler_exit();
    }
};

//// SET USER VIDEO ----------------
BLT.FTV.setUserVideo = function(vidNum) {
    console.log('<<< FTV //---  SELECTED VIDEO  >>> = '+vidNum);
    BLT.Vid.currentVideo = vidNum;
    BLT.FTV.videoControlsToggle(true);
    BLT.FTV.videoPlayer.switchVideo(BLT.Vid.videoSrc[BLT.Vid.currentVideo]);
    //BLT.FTV.videoPlayer.settings.video = BLT.FTV.videoPlayer.switchVideo(BLT.Vid.videoSrc[BLT.Vid.currentVideo]);
    BLT.FTV.videoAudioToggle(true);
    BLT.FTV.videoPlayer.play();
    //BLT.FTV.videoAudioToggle(true);
    _removeClass(BLT.Vid.videoWrapper,'hide');
   //BLT.FTV.videoPlayer.addEventListener('tracker', BLT.FTV.videoTracker);
   // console.log('<<< FTV //---  vid duration = '+BLT.FTV.videoPlayer.duration);
};

BLT.FTV.replayVideo = function() {
    _removeClass(BLT.Vid.videoWrapper,'hide');
    BLT.FTV.videoPlayer.restart();
    BLT.FTV.videoAudioToggle(true);
    BLT.FTV.videoPlayer.addEventListener('tracker', BLT.FTV.videoTracker);
};

//// KILL VIDEO ----------------
BLT.FTV.killVideo = function () {
    if(BLT.Vid.isVideoPlaying)
    {
        BLT.Vid.isVideoPlaying = false;
        BLT.Vid.videoPlayer.pause();
        BLT.Vid.videoPlayer.currentTime = 0;
        _addClass(BLT.Vid.videoWrapper, 'hide');
    }
};

BLT.FTV.videoTracker = function (e){
    console.log('<<< FTV // -- video tracking  = '+ e.duration+'    ---  '+ e.event);
    switch(e.event){
        case 'init':
            console.log('<<< FTV // -- INIT');
            _removeClass(BLT.Vid.videoWrapper,'hide');
            break;
        case 'starts':
            console.log('<<< FTV // -- START Video');
            BLT.Vid.isVideoPlaying = true;
            dispatchEvent(new Event(BLT.FTV.videoEvents.PLAY));
            break;
        default:
            console.log('<<< FTV // -- video tracking default = '+e.event);
            break;
    }
};



// SETTING THE VIDEO THUMBNAILS --------------------
//BLT.Vid.setThumbnails = function(){
//    for(i=0;i<BLT.Vid.videoThumbs.length;i++){
//        var $thumbObj = _getElement(BLT.Vid.videoThumbs[i]);
//        $thumbObj.addEventListener('mouseover',BLT.Vid.thumbsOver);
//        $thumbObj.addEventListener('mouseout',BLT.Vid.thumbsOff);
//        $thumbObj.addEventListener('click',BLT.Vid.thumbsClick);
//    }
//};
//
///// THUMB OVER ---------------
//BLT.Vid.thumbsOver = function(e){
//    console.log('thumb OVER = '+ e.target.id);
//    switch(e.target.id){
//        case 'show1':
//            _addClass('overlayColorShows2', 'overlayOver');
//            _addClass('overlayColorShows3', 'overlayOver');
//            _removeClass('overlayColorShows1', 'overlayOver');
//            break;
//        case 'show2':
//            _addClass('overlayColorShows1', 'overlayOver');
//            _addClass('overlayColorShows3', 'overlayOver');
//            _removeClass('overlayColorShows2', 'overlayOver');
//            break;
//        case 'show3':
//            _addClass('overlayColorShows2', 'overlayOver');
//            _addClass('overlayColorShows1', 'overlayOver');
//            _removeClass('overlayColorShows3', 'overlayOver');
//            break;
//    }
//
//};
//
////// THUMB OFF ----------------
//BLT.Vid.thumbsOff = function(e){
//    console.log('thumb OFF = '+ e.target.id);
//    switch(e.target.id){
//        case 'show1':
//            _removeClass('overlayColorShows2', 'overlayOver');
//            _removeClass('overlayColorShows3', 'overlayOver');
//            break;
//        case 'show2':
//            _removeClass('overlayColorShows1', 'overlayOver');
//            _removeClass('overlayColorShows3', 'overlayOver');
//            break;
//        case 'show3':
//            _removeClass('overlayColorShows2', 'overlayOver');
//            _removeClass('overlayColorShows1', 'overlayOver');
//            break;
//    }
//};
//
///// THUMB CLICK ---------------------------------
//BLT.Vid.thumbsClick = function(e){
//    console.log('thumb CLICK = '+ e.target.id);
//    switch(e.target.id){
//        case 'show1':
//            BLT.Vid.selectedVideo = 2;
//            break;
//        case 'show2':
//            BLT.Vid.selectedVideo = 3;
//            break;
//        case 'show3':
//            BLT.Vid.selectedVideo = 4;
//            break;
//    }
//
//    if(!BLT.Vid.isVideoPlaying){
//        _removeClass(BLT.Vid.videoWrapper, 'hide');
//        _addClass('videoCap', 'hide');
//    }
//    BLT.Vid.setUserVideo(BLT.Vid.selectedVideo);
//};


///// Video utilityFunctions
////////////////////////////////////////////////////////////////////


// Video Controls toggle  ----
BLT.FTV.videoControlsToggle = function(visible){
    if(visible){
        BLT.Vid.videoControls = true;
    } else  { BLT.Vid.videoControls = false;   }
    BLT.FTV.videoPlayer.settings.controls = BLT.Vid.videoControls;
};
// Video Audio toggle ----
BLT.FTV.videoAudioToggle = function(visible) {
    if (visible) {
        BLT.Vid.muted = true;
        BLT.FTV.videoPlayer.unmute();
    } else {
        BLT.Vid.muted = false;
        BLT.FTV.videoPlayer.mute();
    }
};
// Video size ----
BLT.FTV.videoSize = function(W,H){
    BLT.Vid.videoWrapper.style.width = W + "px !important";
    BLT.Vid.videoWrapper.style.height = H + "px !important";
    BLT.Vid.videoContainerObj.style.width = W + "px !important";
    BLT.Vid.videoContainerObj.style.height = H + "px !important";
    BLT.Vid.videobutton.style.width = W + "px !important";
    BLT.Vid.videobutton.style.height = H + "px !important";
};


BLT.FTV.videoEvents = {
    REPLAY          : "video_replay",
    KILL            : "kill_video",
    HIDE            : "video_hidden",
    CLICK           : "click_video",
    COMPLETE        : "complete",
    TIMER           : "timer",
    CLOSE           : "close",
    PLAY            : "play",
    EXIT_FULLSCREEN : "exit_fullscreen"
};