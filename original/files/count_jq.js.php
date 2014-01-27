var _count_onload = true;  // Wait for onload to send count request
var _count_click_track = 1; // Track a percentage of the pages click
var _count_click_pause = 500; // delay wainting for server
var _count_percentage = 1;  // Track a percentage of the pages click

// Track a percentage of the pages
if (Math.random()<_count_percentage) {
  function _count_escape(_count_str){
    if(typeof(encodeURIComponent) == 'function') {
      return encodeURIComponent(_count_str);
    } else {
      return escape(_count_str);
    }
  }

  function _count_rpc(url){
    // create SCRIPT tag
    var scrptElement = document.createElement("script");

    // set its attributes
    scrptElement.setAttribute("type", "text/javascript");
    scrptElement.setAttribute("language", "JavaScript");
    scrptElement.setAttribute("src", url);
    //scrptElement.setAttribute("defer", "defer");

    // add this new element to the head tag
    document.getElementsByTagName("head")[0].appendChild(scrptElement);
  }

  function _count_count() {
    //alert('count_count');
    var _count_cookie = (navigator.cookieEnabled)? '1' : '0';
    if((typeof (navigator.cookieEnabled) == "undefined") && (_count_cookie == '0')) {
      document.cookie="_count_testcookie"
      _count_cookie=(document.cookie.indexOf("_count_testcookie")!=-1)? '1' : '0';
    }

    var _count_ref = '';
    try {
      _count_ref = top.document.referrer;
    } catch(e1) {
      if(parent){
        try{ _count_ref = parent.document.referrer; } catch(e2) { _count_ref=''; }
      }
    }
    if(_count_ref == '') {
      _count_ref = document.referrer;
    }

    var _count_src = _count_url
        +'?site='+_count_escape(_count_site)
        +'&cat='+_count_escape(_count_cat)
        +'&type='+_count_escape(_count_type)
        +'&id='+_count_escape(_count_pageid)
        +'&url='+_count_escape(document.location.href)
        +'&ref='+_count_escape(_count_ref)
        +'&c=' + _count_cookie
        +'&v=' + _count_version
        +'&r=' + Math.random();

    if (_count_onload) {
      _count_now = new Date();
      _count_src += '&lt='+ (_count_now.valueOf()-_count_load_date.valueOf());
    }
    _count_rpc(_count_src);
  }

  // Main
  _count_load_date = new Date()

  if (_count_onload) {
    // Count on window load
    jQuery(document).ready(function() { _count_count(); });    

  } else {
    // Count
    _count_count();
  }
}
