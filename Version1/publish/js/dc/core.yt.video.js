/* global Enabler */
/* global studioinnovation */
/* global console */

console.log ('BLT // YOUTUBE VIDEO');

var BLTvid = {};
    BLTvid.coreReady = false;
    BLTvid.ytp;
    BLTvid.ytPlayer = {};
    BLTvid.containerId;
    BLTvid.videoId;
    BLTvid.videoWidth;
    BLTvid.videoHeight;
    BLTvid.autoplay = 1;
    BLTvid.controls = 1;
    BLTvid.selectedVideo = 0;
    BLTvid.initialVideo = true;

BLTvid.DCready = function() {
    BLTvid.coreReady = true;
    console.log("DC Core is ready to go ----  BLTvid.coreReady = "+BLTvid.coreReady);
};

BLTvid.setVideoProperties = function() {
    console.log ('Setting video Properties');
    // YouTube player properties configuration.
    BLTvid.ytPlayer = {
        'containerId': BLTvid.containerId,
        'videoId': BLTvid.videoId[BLTvid.selectedVideo],
        'videoWidth': BLTvid.videoWidth,
        'videoHeight': BLTvid.videoHeight,
        'suggestedQuality': 'default',
        'playerVars':
        {
            'autoplay': BLTvid.autoplay, /* For the YouTube view to count, the user must click to start the video using the standard YouTube play button. Autoplay videos don't count toward YouTube views. */
            'rel': 0, /*Show related videos*/
            'showinfo': 0, /*Show info about the uploader    and video title*/
            'controls': BLTvid.controls,
            'fs': 0,
            'modestbranding': 1,
            'enablejsapi': 1
        }
    };
    document.dispatchEvent(new CustomEvent("getVidEnabler"));
};

BLTvid.getVideoEnabler = function(){
    document.removeEventListener("getVidEnabler", BLTvid.getVideoEnabler);
    if(BLTvid.coreReady){ BLTvid.initVideo();
    }else{ document.addEventListener(DC.events.CORE_READY, BLTvid.initVideo);}
};

BLTvid.YTFunction = function(){
    console.log ('constructing youtube player');
    BLTvid.ytp = new studioinnovation.YTPlayer(BLTvid.ytPlayer); // Construct the YouTube player variable.
    BLTvid.bindListeners(); // Bind event listeners.
};

BLTvid.initVideo = function() {
     console.log ('init YouTube player');
    Enabler.loadScript(Enabler.getUrl('https://www.gstatic.com/doubleclick/studio/innovation/h5/ytplayer/ytp_v2.js'), BLTvid.YTFunction);
    _removeClass("videoWrapper",'hide');
};

BLTvid.bindListeners = function(){
    console.log ('Binded video Listeners added');
    // Ready Handler
    BLTvid.ytp.addEventListener('ready', BLTvid.handleVideoReady, true);
    // Video State Handler
    BLTvid.ytp.addEventListener('statechange', BLTvid.handleVideoStateChange, true);
    // click for sound
    document.addEventListener('clickForSound', BLTvid.clickForSound, true);

// YouTube playback quartiles
    BLTvid.ytp.addEventListener(studioinnovation.YTPlayer.Events.VIDEO_0_PERCENT, function() {
        Enabler.counter('YTVideo Percent 0');
    }, false);
    BLTvid.ytp.addEventListener(studioinnovation.YTPlayer.Events.VIDEO_25_PERCENT, function() {
        Enabler.counter('YTVideo Percent 25');
    }, false);
    BLTvid.ytp.addEventListener(studioinnovation.YTPlayer.Events.VIDEO_50_PERCENT, function() {
        Enabler.counter('YTVideo Percent 50');
    }, false);
    BLTvid.ytp.addEventListener(studioinnovation.YTPlayer.Events.VIDEO_75_PERCENT, function() {
        Enabler.counter('YTVideo Percent 75');
    }, false);
    BLTvid.ytp.addEventListener(studioinnovation.YTPlayer.Events.VIDEO_100_PERCENT, function() {
        Enabler.counter('YTVideo Percent 100');
    }, false);
};

BLTvid.handleVideoReady = function (event) {
    console.log ('///////////////////////  YT -- player ready');
    if(BLTvid.initialVideo){  BLTvid.ytp.mute();
    }else{ BLTvid.ytp.unMute();  }
};

BLTvid.handleVideoStateChange = function (stateChangeEvent){
    console.log ('player state: ' + stateChangeEvent.getPlayerState());
    var playerState = stateChangeEvent.getPlayerState();
    switch(playerState){
        case studioinnovation.YTPlayer.Events.BUFFERING:
            console.log ('VIDEO IS BUFFERING');
            break;

        case studioinnovation.YTPlayer.Events.PLAYING:
            console.log ('VIDEO IS PLAYING');
            break;

        case  studioinnovation.YTPlayer.Events.ENDED:
            console.log ('VIDEO IS DONE');
            document.dispatchEvent(new CustomEvent("videoDone"));
            break;

        case  studioinnovation.YTPlayer.Events.PAUSED:
            console.log ('VIDEO IS PAUSED');
            break;

        case  studioinnovation.YTPlayer.Events.TIMER_START:
            console.log ('VIDEO IS TIMER START');
            break;

        case studioinnovation.YTPlayer.Events.TIMER_STOP:
            console.log ('VIDEO IS TIMER STOP');
            break;

        case studioinnovation.YTPlayer.Events.UNSTARTED:
            console.log ('VIDEO IS UNSTARTED');
            break;
    }
};

BLTvid.clickForSound = function() {
    console.log ('//////////////////////////////////////////////////////    CLICK FOR SOUND - YT');
    //console.log("BLTvid.ytp CONTROLS ----  ",BLTvid.ytp);
    BLTvid.initialVideo = false;
    BLTvid.ytp.destroy();
    BLTvid.setVideoProperties();
    BLTvid.YTFunction();
};

BLTvid.switchVideo = function(){
    console.log ('SWITCH VIDEO');
    if( BLTvid.initialVideo){
        BLTvid.clickForSound();
    }else{
        BLTvid.ytp.loadVideoById(BLTvid.videoId[BLTvid.selectedVideo],0);
        BLTvid.ytp.unMute();
    }

};

BLTvid.killVideo = function(){
    console.log ('//////////////////////////////////////////////////////   KILL VIDEO');
    BLTvid.ytp.stopVideo();
};

BLTvid.replayVideo = function(){
    console.log ('//////////////////////////////////////////////////////  Replay VIDEO');
    BLTvid.ytp.loadVideoById(BLTvid.videoId[BLTvid.selectedVideo],0);
};

document.addEventListener(DC.events.CORE_READY,BLTvid.DCready);
document.addEventListener("setVideoProperties", BLTvid.setVideoProperties, true);
document.addEventListener("getVidEnabler", BLTvid.getVideoEnabler);
document.addEventListener('switchVideo', BLTvid.switchVideo, true);
document.addEventListener('killVideo', BLTvid.killVideo, true);
document.addEventListener('replayVideo', BLTvid.replayVideo, true);


