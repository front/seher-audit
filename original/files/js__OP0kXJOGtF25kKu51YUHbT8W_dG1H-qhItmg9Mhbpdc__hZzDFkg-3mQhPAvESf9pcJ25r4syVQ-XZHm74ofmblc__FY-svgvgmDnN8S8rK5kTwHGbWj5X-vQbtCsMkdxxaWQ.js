// Generated by CoffeeScript 1.6.3
/*
adsenseManager - Google Adsense
*/


(function() {
  define('adaptive/adsenseManager', ['core/utils', 'jQuery', 'adaptive/layoutManager'], function(exports, utils, $, layoutManager) {
    var console, self;
    console = newConsole(exports.__id);
    self = (console.getLevel('debug') ? exports : this);
    self.googleLibUrl = 'http://pagead2.googlesyndication.com/pagead/show_ads.js';
    self.isInitialized = false;
    self.google_ad_client = null;
    self.google_ui_version = 1;
    self.activeLayoutName = null;
    self.layoutNameAliases = {};
    self.areaDefinitions = {};
    self.markupParts = {};
    exports.configure = function(configSettings) {
      self.google_ad_client = configSettings.google_ad_client;
      self.google_ui_version = configSettings.google_ui_version;
      self.layoutNameAliases = configSettings.layoutNameAliases || {};
      self.areaDefinitions = configSettings.areaDefinitions || {};
      self.markupParts['first'] = "<div class=\"text-ads-header\">Sponsede lenker</div>\n<script type=\"text/javascript\">\nvar google_ad_client = '" + self.google_ad_client + "';";
      self.markupParts['last'] = "</script>\n<script type=\"text/javascript\" src=\"" + self.googleLibUrl + "\"></script>";
      console.log("Adsense configured with adclient-id " + self.google_ad_client);
      return exports;
    };
    exports.initialize = function(activeLayoutName, allLayoutNames) {
      console.info('Initialize!');
      return self.isInitialized = true;
    };
    exports.renderLayout = function(activeLayoutName, prevActiveLayoutName) {
      return console.log("renderLayout('" + activeLayoutName + "', '" + prevActiveLayoutName + "')");
    };
    return exports.writeAdsenseMarkup = function(areaName) {
      var isValid, layoutName, markup, paramName, paramValue, _ref;
      isValid = true;
      if (!self.areaDefinitions[areaName]) {
        console.warn("writeAdsenseMarkup: No definition found for area '" + areaName + "'!");
        isValid = false;
      }
      if (self.isInitialized) {
        console.warn("writeAdsenseMarkup: '" + exports.__id + "' is initialized! Cannot write out any more adsense tags!");
        console.info("writeAdsenseMarkup: Can ONLY be called INLINE due to 'document.write()'!");
        console.trace();
        isValid = false;
      }
      if (!isValid) {
        return;
      }
      layoutName = layoutManager.getLayoutName();
      if (self.layoutNameAliases[layoutName]) {
        layoutName = self.layoutNameAliases[layoutName];
      }
      console.debug("writeAdsenseMarkup: '" + areaName + "' -> '" + layoutName + "'!");
      markup = [];
      markup.push(self.markupParts['first']);
      _ref = self.areaDefinitions[areaName].layoutParams[layoutName];
      for (paramName in _ref) {
        paramValue = _ref[paramName];
        if (typeof paramValue === 'string') {
          paramValue = "'" + paramValue + "'";
        }
        if (typeof paramValue === 'object') {
          paramValue = paramValue[paramValue.length - 1];
        }
        markup.push("var " + paramName + " = " + paramValue + ";");
      }
      markup.push(self.markupParts['last']);
      return document.write(markup.join('\n'));
    };
  });

}).call(this);
;/**/