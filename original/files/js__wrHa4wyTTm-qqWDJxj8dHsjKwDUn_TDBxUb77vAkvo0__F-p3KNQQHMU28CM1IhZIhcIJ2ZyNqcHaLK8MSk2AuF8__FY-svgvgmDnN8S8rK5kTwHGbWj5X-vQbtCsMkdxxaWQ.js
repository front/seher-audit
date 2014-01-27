/**
 * @file
 * Javascript file that performs the image path manipulations.
 */
(function ($) {

  // Attaching to Drupal behaviors
  window.imgflyFallbackSrc = "data-src";
  window.imgflyFallbackAspect = "data-aspect";
  window.imgflySrc = window.imgflyFallbackSrc;
  window.imgflyAspect = window.imgflyFallbackAspect;
  Drupal.behaviors.imgfly_js = {

    // Make theese variable accessible also outside this module
    loadwatch: function() {
      return 0 + $(window).scrollTop() + $(window).height() + parseInt(Drupal.settings.imgfly.loadvalue);
    },
    imagereplace: function(){
      $('.imgfly-placeholder').each(function() {
        var imgSrc = ($(this).attr(window.imgflySrc)) ? $(this).attr(window.imgflySrc) : $(this).attr(window.imgflyFallbackSrc);
        if (imgSrc){
          var aspect = ($(this).attr(window.imgflyAspect)) ? $(this).attr(window.imgflyAspect) : $(this).attr(window.imgflyFallbackAspect);
          var imgWidth = $(this).width();
          var imgHeight = (aspect > 0) ? Math.round(imgWidth / aspect) : $(this).height();
          var imgflyPath = 'imgfly/' + imgWidth + '/' + imgHeight;
          var newPath = imgSrc.replace(/sites\/\S+\/files/, imgflyPath);

          if ($(this).attr('src') != newPath) {
            if (Drupal.settings.imgfly.lazyload){
              if ($(this).offset().top < Drupal.behaviors.imgfly_js.loadwatch()) {
                $(this).attr('src', newPath);
              }
            }
            else {
               $(this).attr('src', newPath);
            }
          }
        }
      });
    },
    attach: function (context, settings) {
      Drupal.behaviors.imgfly_js.imagereplace();
    }
  };
}(jQuery));
;/**/
/**
 * DFP: Add window.googletag
 */
googletag = window.googletag || {};
googletag.cmd = googletag.cmd || [];
(function() {
  var gads = document.createElement('script');
  gads.async = true;
  gads.type = 'text/javascript';
  var useSSL = 'https:' == document.location.protocol;
  gads.src = (useSSL ? 'https:' : 'http:') +
  '//www.googletagservices.com/tag/js/gpt.js';
  var node = document.getElementsByTagName('script')[0];
  node.parentNode.insertBefore(gads, node);
})();
;/**/
/**
 * @file
 * Loads content of blocks via AJAX just after page loading, updates Drupal.settings, reattaches behaviors.
 */

(function ($) {

Drupal.ajaxqueryblocksSendRequest = function (request, delay) {
  if (delay) {
    setTimeout(function () {Drupal.ajaxqueryblocksSendRequest(request, 0);}, delay);
    return;
  }

  var ajaxurl = "";

  if(typeof Drupal.settings.ajaxqueryblocks_path !== 'undefined') {
    ajaxurl = Drupal.settings.ajaxqueryblocks_path;
  } else {
    ajaxurl = Drupal.settings.basePath + "ajaxqueryblocks";
  }

  $.ajax({
    url: ajaxurl,
    type: "GET",
    dataType: "json",
    data: request,
    cache: true,
    success: function (data) {
      // Replaces the placeholder divs by the actual block contents returned by the AJAX call,
      // executes the extra JavaScript code and attach behaviours if the apply to the blocks.
      Drupal.freezeHeight();
      for (var id in data) {
        Drupal.ajaxqueryblocksSetBlockContent(id, data[id]);
      }
      Drupal.unfreezeHeight();
    }
  });
}

Drupal.ajaxqueryblocksSetBlockContent = function (id, data) {
  if (data['delay']) {
    setTimeout(function () {data['delay'] = 0; Drupal.ajaxqueryblocksSetBlockContent(id, data);}, data['delay']);
    return;
  }

  var media_query = matchMedia(data.ajaxqueryblocks_query);
  var wrapper = $('#block-' + id + '-ajax-content');
  var context = wrapper.parent();

  function call_ajax() {
    if(!wrapper) {
      return;
    }

    Drupal.detachBehaviors(context);
    if (!context) {
      return;
    }

    if (context.hasClass('ajaxqueryblocks-loaded')){
      context.show();
      return;
    }

    context.addClass('ajaxqueryblocks-loaded');
    context.append(data['content']);
    wrapper.remove();
    if (data['ajaxqueryblocks_settings']) {
      $.extend(true, Drupal.settings, data['ajaxqueryblocks_settings']);
    }
    Drupal.attachBehaviors(context);
  }

  if(media_query.matches) {
    call_ajax();
  }

  media_query.addListener(function(query) {
    if (query.matches) {
      call_ajax();
    } else {
      if(context) {
        context.hide();
      }
    }
  });
}

$(document).ready(function () {
  if (typeof Drupal.settings.ajaxqueryblocks !== 'undefined') {
    Drupal.ajaxqueryblocksSendRequest(Drupal.settings.ajaxqueryblocks, Drupal.settings.ajaxqueryblocks_delay);
  }
});

$(window).load(function () {
  if (typeof Drupal.settings.ajaxqueryblocks_late !== 'undefined') {
    Drupal.ajaxqueryblocksSendRequest(Drupal.settings.ajaxqueryblocks_late, Drupal.settings.ajaxqueryblocks_late_delay);
  }
});

})(jQuery);
;/**/
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */

window.matchMedia = window.matchMedia || (function(doc, undefined) {

  "use strict";

  var bool,
      docElem = doc.documentElement,
      refNode = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement("body"),
      div = doc.createElement("div");

  div.id = "mq-test-1";
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.style.background = "none";
  fakeBody.appendChild(div);

  return function(q){

    div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

    docElem.insertBefore(fakeBody, refNode);
    bool = div.offsetWidth === 42;
    docElem.removeChild(fakeBody);

    return {
      matches: bool,
      media: q
    };

  };

}(document));

/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. Dual MIT/BSD license */
(function(){
  // monkeypatch unsupported addListener/removeListener with polling
  if(!window.matchMedia("").addListener){
    var oldMM = window.matchMedia;

    window.matchMedia = function(q){
      var ret = oldMM(q),
        listeners = [],
        last = ret.matches,
        timer,
        check = function(){
          var list = oldMM(q),
            unmatchToMatch = list.matches && !last,
            matchToUnmatch = !list.matches && last;

                                        //fire callbacks only if transitioning to or from matched state
          if(unmatchToMatch || matchToUnmatch){
            for(var i = 0, il = listeners.length; i < il; i++){
              listeners[ i ].call(ret, list);
            }
          }
          last = list.matches;
        };

      ret.addListener = function(cb){
        listeners.push(cb);
        if(!timer){
          timer = setInterval(check, 1000);
        }
      };

      ret.removeListener = function(cb){
        for(var i = 0, il = listeners.length; i < il; i++){
          if(listeners[ i ] === cb){
            listeners.splice(i, 1);
          }
        }
        if(!listeners.length && timer){
          clearInterval(timer);
        }
      };

      return ret;
    };
  }
}());
;/**/
/*global jQuery */
/*! 
* FitVids 1.0
*
* Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/

(function( $ ){

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null
    }
    
    var div = document.createElement('div'),
        ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0];
        
  	div.className = 'fit-vids-style';
    div.innerHTML = '&shy;<style>         \
      .fluid-width-video-wrapper {        \
         width: 100%;                     \
         position: relative;              \
         padding: 0;                      \
      }                                   \
                                          \
      .fluid-width-video-wrapper iframe,  \
      .fluid-width-video-wrapper object,  \
      .fluid-width-video-wrapper embed {  \
         position: absolute;              \
         top: 0;                          \
         left: 0;                         \
         width: 100%;                     \
         height: 100%;                    \
      }                                   \
    </style>';
                      
    ref.parentNode.insertBefore(div,ref);
    
    if ( options ) { 
      $.extend( settings, options );
    }
    
    return this.each(function(){
      var selectors = [
        "iframe[src*='player.vimeo.com']", 
        "iframe[src*='www.youtube.com']",  
        "iframe[src*='www.kickstarter.com']", 
        "object", 
        "embed"
      ];
      
      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }
      
      var $allVideos = $(this).find(selectors.join(','));

      $allVideos.each(function(){
        var $this = $(this);
        if (this.tagName.toLowerCase() == 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; } 
        var height = this.tagName.toLowerCase() == 'object' ? $this.attr('height') : $this.height(),
            aspectRatio = height / $this.width();
		if(!$this.attr('id')){
			var videoID = 'fitvid' + Math.floor(Math.random()*999999);
			$this.attr('id', videoID);
		}
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  
  }
})( jQuery );;/**/
