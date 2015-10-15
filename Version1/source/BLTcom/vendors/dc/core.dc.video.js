"use strict";

var DC = DC || {};
var DCV = DCV || {version : "v0.1.3.4"};
DCV.initVideo = function () {
  DCV.setVideoVars();
  Enabler.loadModule(
    studio.module.ModuleId.RAD_VIDEO, function () {
      DCV.buildVideo(DC.isMobile ? 1 : 0 );
      var closebtn = document.getElementById('close');
      if (closebtn) {
        closebtn.addEventListener('click', DC.hideVideo);
      }
      DC.dispatchEvent(DC.events.LIB_READY, {lib : "video", o : DCV, v : DCV.version});
      DC.debug("[video] " + DCV.version);
    }
  );
};
DCV.buildVideo = function (i) {
  if (i == undefined) {
    i = 0;
  }
  if (DCV.videoComponent) {
    DCV.videoComponent.destroy();
  }
  DCV.videoComponent = new studio.sdk.rad.Video(
    {
      id : 'video' + ( parseInt(i + 1) ),
      autoplay : DC.isMobile ? false : DC.config.video.autoplay || false,
      controls : typeof DC.config.video.controls === 'undefined' ? true : DC.config.video.controls,
      muted : DC.config.video.muted ? DC.config.video.muted[i] : false,
      sources : DC.config.video.sources[i] || DC.config.video.sources[0],
      width : DC.config.video.size[i] ? DC.config.video.size[i].width : DC.config.video.size[0].width,
      height : DC.config.video.size[i] ? DC.config.video.size[i].height : DC.config.video.size[0].height
    }
  );
  DCV.videoComponent.setElement(document.getElementById(DC.config.video.containers[i] || DC.config.video.containers[0]));
  DCV.videoElement = DCV.videoComponent.getVideoElement();
  DCV.setVideoEvents();
};
DC.playVideo = function (i) {
  if (i) {
    DCV.buildVideo(i);
  }
  DCV.videoElement.load();
  DCV.videoElement.pause();
  DCV.videoWrapper.classList.remove('hide');
  // DCV.videoElement.currentTime = 0;
  if (DC.config.video.fullscreen) {
    DCV.enterFullscreen(DCV.videoElement);
  }

  DCV.videoElement.play();
};
DC.hideVideo = function () {
  DCV.videoWrapper.classList.add('hide');
  DCV.videoElement.pause();
  DCV.stopTimer();
  DCV.exitFullScreen();
  DC.dispatchEvent(DC.events.VideoEvents.HIDE);
};
DC.seekVideo = function (s) {
  DCV.videoElement.currentTime = s;
  DCV.videoElement.pause();
  DCV.stopTimer();
};
DCV.onVideoPlay = function () {
  DCV.videoWrapper.classList.remove('hide');
  DCV.startTimer();
};
DCV.onVideoClick = function () {
  DC.dispatchEvent(DC.events.VideoEvents.CLICK);
};
DCV.setVideoVars = function () {
  DCV.videoWrapper = document.getElementById('videoWrapper');
  DCV.videoContainer = document.getElementById('videoWrapper');
  DCV.videoClick = document.getElementById('videoClick');
  DCV.videoWrapper.style.width = DC.config.video.size[0].width + "px";
  DCV.videoWrapper.style.height = DC.config.video.size[0].height + "px";
  DCV.videoContainer.style.width = DC.config.video.size[0].width + "px";
  DCV.videoContainer.style.height = DC.config.video.size[0].height + "px";
  if (DCV.videoClick) {
   // DCV.videoClick.style.width = DC.config.video.size[0].width + "px";
    //DCV.videoClick.style.height = (DC.config.video.size[0].height - 50) + "px";
    DCV.videoClick.addEventListener('click', DCV.onVideoClick);
  }
};
DCV.stopTimer = function () {
  clearInterval(DCV.timer)
};
DCV.startTimer = function () {
  DCV.timer = setInterval(DCV.timeStep, 1000)
};
DCV.timeStep = function () {
  DC.dispatchEvent(
    DC.events.VideoEvents.TIMER, {
      currentTime : Math.round(DCV.videoElement.currentTime),
      duration    : Math.round(DCV.videoElement.duration)
    }
  );
};
DCV.setVideoEvents = function () {
  DCV.videoElement.addEventListener('ended', DCV.videoEnded);
  DCV.videoElement.addEventListener('play', DCV.onVideoPlay);
  // DCV.videoElement.addEventListener( 'click', DCV.onVideoClick );
};
DCV.videoEnded = function () {
  if (DC.config.video.hideOnComplete) {
    DC.hideVideo();
  }
  DCV.stopTimer();
  DC.dispatchEvent(DC.events.VideoEvents.COMPLETE);
};
DCV.enterFullscreen = function (element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
};
DCV.exitFullScreen = function () {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};
DCV.initVideo();