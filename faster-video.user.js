// ==UserScript==
// @name         video speedup controls
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @namespace    me.stefanheule.com
// @version      1.0
// @include      *
// @grant        none
// ==/UserScript==

// document.getElementsByTagName('video')[0].playbackRate = 1;

// alert('ok')
this.$ = this.jQuery = jQuery.noConflict(true);

var converted = {};

function run(callNr) {
  var videos = document.getElementsByTagName('video');
  for (var i = 0; i < videos.length; i++) {
    var video = videos[i];
    var isYoutube = video.baseURI.indexOf("youtube.com") != -1;

    // mark video as done
    var key = 'speedup_done';
    //if ($(video).data(key) === true) continue; // seems to not work with this on cc
    $(video).data(key, true);

    if (video.baseURI.indexOf("www.cc.com") != -1) {
        video.playbackRate = 2;
        continue;
    }

    if (!isYoutube) continue;

    // increase playback speed
    video.playbackRate = 2;

    // autoplay if necessary
    var pageUrl = (window.location != window.parent.location) ? document.referrer : document.location.href;
    //console.log(window.parent.location);
    // for (var k in document) {
    //   console.log(k, document[k]);
    // }
    // console.log(unsafeWindow.parent.location.href)
    if (false && isYoutube && video.currentTime == 0 && $(video).data(key) === true) {
      $(video.parentElement.parentElement).find('.ytp-large-play-button').get(0).click();
    }
  }

  // run again
  if (callNr > 0) {
    setTimeout(function(){
      run(callNr - 1);
    }, 500);
  }
}

$( document ).ready(function() {
  run(10);
});
