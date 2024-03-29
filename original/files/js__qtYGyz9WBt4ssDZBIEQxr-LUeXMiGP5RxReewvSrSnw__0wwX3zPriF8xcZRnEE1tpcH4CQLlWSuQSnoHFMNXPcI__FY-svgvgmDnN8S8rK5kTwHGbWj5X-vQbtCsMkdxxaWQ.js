// Generated by CoffeeScript 1.6.3
/*
dfpManager (Dart for Publishers - Google ads)
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define('adaptive/dfpManager', ['jQuery', 'core/utils'], function(exports, $, utils) {
    var Slot, console, self,
      _this = this;
    console = newConsole(exports.__id);
    self = (console.getLevel('debug') ? exports : this);
    self.activeLayoutName = null;
    self.layoutNameAliases = {};
    self.layoutNames = [];
    self.slotDefinitions = [];
    self.slots = [];
    self.servicesEnabled = false;
    self.initialLoadDone = false;
    self.serviceFlags = {
      'allowRefresh': true,
      'forceRefreshAll': false,
      'enableServices': false,
      'pubads.collapseEmptyDivs': true,
      'pubads.enableSingleRequest': true,
      'pubads.enableAsyncRendering': true,
      'pubads.enableSyncRendering': false,
      'pubads.disableInitialLoad': true
    };
    exports.configure = function(configSettings) {
      var adUnitParts, flagName, flagValue, _ref;
      if (!configSettings.serviceFlags) {
        configSettings.serviceFlags = {};
      }
      _ref = self.serviceFlags;
      for (flagName in _ref) {
        if (!__hasProp.call(_ref, flagName)) continue;
        flagValue = _ref[flagName];
        if (typeof configSettings.serviceFlags[flagName] === 'boolean') {
          console.info("" + flagName + ": " + flagValue + " -> " + configSettings.serviceFlags[flagName]);
          self.serviceFlags[flagName] = configSettings.serviceFlags[flagName];
        } else {
          console.info("" + flagName + ": " + flagValue + " -> [Unchanged]");
        }
      }
      self.dfpNetworkCode = configSettings.dfpNetworkCode || '';
      if (!self.dfpNetworkCode) {
        console.error("No dfpNetworkCode provided!");
      }
      self._adUnitOverride = self.getAdUnitOverride();
      self._adUnitPrefix = configSettings.adUnitPrefix || '';
      self._adUnitPath = configSettings.adUnitPath || '';
      adUnitParts = self.dfpNetworkCode.split('/');
      if (self._adUnitOverride) {
        adUnitParts = adUnitParts.concat(self._adUnitOverride.split('/'));
      } else {
        adUnitParts = adUnitParts.concat(self._adUnitPrefix.split('/'), self._adUnitPath.split('/'));
      }
      self.adUnitBase = "/" + (utils.arrayJoinNonEmpty(adUnitParts, '/')) + "/";
      console.info("adUnitBase: '" + self.adUnitBase + "'");
      self.layoutNameAliases = configSettings.layoutNameAliases || {};
      self.slotDefinitions = configSettings.slotDefinitions;
      self.adCheckBrute = configSettings.adCheckBrute || true;
      self.adCheckSelector = configSettings.adCheckSelector || '.creative-container';
      self.adCheckPeriod = configSettings.adCheckPeriod || 15;
      self.adCheckInterval = configSettings.adCheckInterval || 500;
      return exports;
    };
    exports.initialize = function(activeLayoutName, allLayoutNames) {
      var slot, slots, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref;
      self.setLayoutNames(allLayoutNames);
      self.setActiveLayoutName(activeLayoutName);
      console.info('Instantiating slots from definitions...');
      self.setSlots(self.slotDefinitions);
      if (!window.googletag) {
        console.error("window.googletag is not set!");
        console.info("-The 'www.googletagservices.com/tag/js/gpt.js'-script must be loaded!");
        return;
      }
      console.info('Setting slot target-elements...');
      _ref = self.getValidSlots();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slot = _ref[_i];
        slot.setTargetElement();
      }
      slots = self.getValidSlots();
      if (self.serviceFlags['pubads.disableInitialLoad']) {
        console.info("Initial load disabled!");
      } else {
        console.info("Initial load enabled!");
      }
      if (!self.serviceFlags['pubads.disableInitialLoad']) {
        for (_j = 0, _len1 = slots.length; _j < _len1; _j++) {
          slot = slots[_j];
          if (slot.eligibleForFetch(self.activeLayoutName)) {
            slot.prepareFetch(self.activeLayoutName);
          }
        }
      }
      console.info('Defining googletag-slots...');
      for (_k = 0, _len2 = slots.length; _k < _len2; _k++) {
        slot = slots[_k];
        slot.define();
      }
      self.enableServices();
      if (!self.serviceFlags['pubads.disableInitialLoad']) {
        console.info("Initial load enabled! -Displaying slots!");
        for (_l = 0, _len3 = slots.length; _l < _len3; _l++) {
          slot = slots[_l];
          slot.display();
        }
        return self.initialLoadDone = true;
      }
    };
    exports.renderLayout = function(activeLayoutName, prevActiveLayoutName) {
      require('adaptive/dfpManager').checkAdHeight();
      console.log("renderLayout('" + activeLayoutName + "') -> fetchAds(" + (exports.getAliasedLayoutName(activeLayoutName)) + ")");
      return exports.fetchAds(activeLayoutName, self.serviceFlags.forceRefreshAll);
    };
    exports.fetchAds = function(layoutName, forceRefreshAll) {
      var slot, _i, _len, _ref, _results;
      if (forceRefreshAll == null) {
        forceRefreshAll = false;
      }
      layoutName = exports.getAliasedLayoutName(layoutName);
      if (!layoutName) {
        console.error("fetchAds: '" + layoutName + "' is not a valid layoutName!");
        return;
      }
      if (!self.initialLoadDone) {
        console.info("fetchAds: Initial load disabled, so doing first fetch!");
        self.initialLoadDone = true;
      } else if (self.activeLayoutName === layoutName && !forceRefreshAll) {
        console.log("fetchAds: '" + layoutName + "' allready active, no need to re-fetch!");
        return;
      }
      self.setActiveLayoutName(layoutName);
      console.info("Fetching ads for layout '" + layoutName + "'");
      if (self.servicesEnabled) {
        if (self.serviceFlags.allowRefresh) {
          return self.refresh(forceRefreshAll);
        } else {
          console.info("No refresh, serviceFlag 'allowRefresh' is 'false'");
          console.log("-Hiding all targetElements!");
          _ref = self.getValidSlots();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            slot = _ref[_i];
            _results.push(slot.hide());
          }
          return _results;
        }
      } else {
        return console.error("fetchAds: Cannot fetch ads before the Google service is enabled (run 'initialize' first)!");
      }
    };
    self.refresh = function(forceRefreshAll) {
      var refreshSlots, slot, _i, _len, _ref;
      if (forceRefreshAll == null) {
        forceRefreshAll = false;
      }
      if (!self.servicesEnabled) {
        console.warn("Services not enabled: Cannot refresh!");
        return;
      }
      console.info("Doing a refresh!");
      refreshSlots = [];
      _ref = self.getValidSlots();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slot = _ref[_i];
        if (!slot.eligibleForFetch(self.activeLayoutName)) {
          slot.hide();
          continue;
        }
        if (!(forceRefreshAll || slot.needsRefresh(self.activeLayoutName))) {
          slot.targetElement.show();
          continue;
        }
        slot.prepareFetch(self.activeLayoutName);
        if (!slot.isDefined) {
          slot.define();
        }
        if (!slot.isDisplayed) {
          slot.display();
        }
        refreshSlots.push(slot);
      }
      if (refreshSlots.length) {
        self.add_gtp_command_fn(self, function() {
          console.log("gpt_Refresh, " + refreshSlots.length + " slot(s)!");
          return googletag.pubads().refresh((function() {
            var _j, _len1, _results;
            _results = [];
            for (_j = 0, _len1 = refreshSlots.length; _j < _len1; _j++) {
              slot = refreshSlots[_j];
              _results.push(slot.gptSlot);
            }
            return _results;
          })());
        });
      }
      return refreshSlots;
    };
    self.getAdUnitOverride = function() {
      var adUnit, e, key, store, storeModuleId;
      adUnit = utils.getUrlParam('adUnit');
      if (adUnit) {
        console.debug("adUnit override url-param:", adUnit);
      }
      storeModuleId = 'core/utils/store';
      if (isRegistered(storeModuleId)) {
        try {
          key = 'adunit_override';
          store = require(storeModuleId);
          if (adUnit === '0') {
            adUnit = null;
            store.clear(key);
            console.info("Cleared adUnit override!");
          } else if (!adUnit) {
            adUnit = store.get(key);
            if (adUnit) {
              console.info("Retrieved adUnit override '" + adUnit + "' from store!");
            }
          } else {
            store.set(key, adUnit);
            console.debug("Stored adUnit override '" + adUnit + "'!");
          }
        } catch (_error) {
          e = _error;
          console.error(e);
        }
      }
      if (adUnit) {
        console.warn("Using adUnit override: '" + adUnit + "'!");
        console.info("Use query-param 'adUnit=0' to revert to default adUnit");
      } else {
        console.info("Use query-param 'adUnit=<dfp_ad_unit>' to set a different adUnit");
      }
      return adUnit;
    };
    Slot = (function() {
      function Slot(slotName, targetElementId, layoutSizes, targetingParams, forceRefresh) {
        var layoutName, sizes;
        this.slotName = slotName;
        this.targetElementId = targetElementId;
        this.layoutSizes = layoutSizes;
        this.targetingParams = targetingParams != null ? targetingParams : {};
        this.forceRefresh = forceRefresh != null ? forceRefresh : false;
        this.currentLayoutName = null;
        this.isDefined = false;
        this.isDisplayed = false;
        this.valid = this.validate();
        if (!this.valid) {
          return;
        }
        this.creativeElementId = "" + this.targetElementId + "-creative-container";
        this.slotSizes = [];
        for (layoutName in layoutSizes) {
          sizes = layoutSizes[layoutName];
          if (utils.type(sizes[0]) !== 'array') {
            this.slotSizes.push(sizes);
          } else {
            this.slotSizes = this.slotSizes.concat(sizes);
          }
        }
        if (!this.targetingParams['pos']) {
          targetingParams['pos'] = slotName;
        }
        console.info("" + this.slotName + ": sizes: ", this.slotSizes);
        console.log(" -targetElementId = '" + this.targetElementId + "'");
        console.log(" -targetingParameter['pos'] = '" + slotName + "'");
        if (this.targetingParams['layout']) {
          console.warn("'" + slotName + "': targetingParameter 'layout' is reserved! (Will be overwritten!)");
        }
      }

      Slot.prototype.validate = function() {
        var layoutName, logPrefix, size, sizes, valid, validSize, _i, _len, _ref;
        logPrefix = "Slot: '" + this.slotName + "':";
        valid = true;
        validSize = true;
        if (!utils.type(this.layoutSizes) === 'object' || !this.layoutSizes) {
          console.warn("" + logPrefix + " 'layoutSizes' must include at least one size!");
          valid = false;
        }
        _ref = this.layoutSizes;
        for (layoutName in _ref) {
          if (!__hasProp.call(_ref, layoutName)) continue;
          sizes = _ref[layoutName];
          if (!self.hasLayout(exports.getAliasedLayoutName(layoutName))) {
            console.warn("" + logPrefix + " '" + layoutName + "' is not a defined layout!");
            valid = false;
          }
          if (utils.type(sizes[0]) !== 'array') {
            validSize = this.validateSize(sizes);
          } else {
            for (_i = 0, _len = sizes.length; _i < _len; _i++) {
              size = sizes[_i];
              validSize = this.validateSize(size);
              if (!validSize) {
                break;
              }
            }
          }
        }
        if (!validSize) {
          valid = validSize;
          console.debug("" + logPrefix + " Invalid sizes for layout '" + layoutName + "':", sizes);
        }
        if (!valid) {
          console.error("" + logPrefix + " Invalid definition!");
          console.debug(this);
        }
        return valid;
      };

      Slot.prototype.validateSize = function(size) {
        var valid;
        valid = true;
        if (size === 'out-of-page') {
          return valid;
        }
        if (utils.type(size[0]) !== 'integer') {
          console.warn("" + logPrefix + " width(" + size[0] + ") must be an integer or 'out-of-page'");
          valid = false;
        }
        if (utils.type(size[1]) !== 'integer') {
          console.warn("" + logPrefix + " height(" + size[1] + ") must be an integer or 'out-of-page'");
          valid = false;
        }
        return valid;
      };

      Slot.prototype.setTargetElement = function() {
        this.targetElement = $('#' + this.targetElementId);
        if (!this.targetElement.length) {
          console.warn("Slot: '" + this.slotName + "': targetElementId '" + this.targetElementId + "' not found!");
          this.valid = false;
        } else {
          console.log("Slot: '" + this.slotName + "': targetElement:", this.targetElement);
          this.targetElement.addClass('dfp-gpt area');
          this.creativeElement = $('<div class="creative-container do-not-style"></div>').attr('id', this.creativeElementId);
          this.targetElement.html(this.creativeElement);
          if (console.getLevel('debug')) {
            this.targetElement.addClass('ad-debug');
            this.adLabel = $("<div class='this-is-advertisement ad-debug'>" + this.slotName + "#</div>");
          } else {
            this.adLabel = $('<div class="this-is-advertisement">Annonse</div>');
          }
          this.targetElement.prepend(this.adLabel);
        }
        return this.targetElement;
      };

      Slot.prototype.setGptSlotTargetingParams = function() {
        var formats, key, keyDelta, keyword, keywords, value, _ref, _ref1;
        if (this.isDefined && this.gptSlot && this.currentLayoutName) {
          this.gptSlot.clearTargeting();
          this.targetingParams['layout'] = this.currentLayoutName;
          _ref = this.targetingParams;
          for (key in _ref) {
            if (!__hasProp.call(_ref, key)) continue;
            value = _ref[key];
            this.gptSlot.setTargeting(key, value);
          }
          keywords = [];
          keyDelta = 0;
          _ref1 = Drupal.settings.dfp;
          for (keyword in _ref1) {
            if (!__hasProp.call(_ref1, keyword)) continue;
            formats = _ref1[keyword];
            if (formats.indexOf(this.slotName) > -1) {
              keywords.push(keyword);
              console.info("Setting keyword for '" + this.slotName + "'!");
              key = keyDelta > 0 ? keyDelta : '';
              this.gptSlot.setTargeting('key' + key, keyword);
              keyDelta = keyDelta + 1;
            }
          }
          if (keywords.length > 0) {
            this.targetingParams['key'] = keywords.join(',');
          }
          console.info("Setting targetingParams for '" + this.slotName + "'!");
          return console.info('-TargetingParams:', this.targetingParams);
        }
      };

      Slot.prototype.eligibleForFetch = function(layoutName) {
        var eligibleForFetch, hiddenParent, parent, _i, _len, _ref;
        eligibleForFetch = true;
        if (!this.layoutSizes[layoutName]) {
          console.info("eligibleForFetch '" + this.slotName + "': NO! (No size for layout '" + layoutName + "'!)");
          eligibleForFetch = false;
        }
        if (eligibleForFetch) {
          if (this.targetElement.is(':hidden')) {
            hiddenParent = null;
            _ref = this.targetElement.parents();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              parent = _ref[_i];
              if (!($(parent).css('display') === 'none')) {
                continue;
              }
              hiddenParent = parent;
              break;
            }
            if (hiddenParent) {
              console.info("eligibleForFetch '" + this.slotName + "': NO! (TargetElement inside hidden parent!)");
              console.debug("-TargetElement:", this.targetElement, console.debug("-Hidden parent:", hiddenParent));
              eligibleForFetch = false;
            }
          }
        }
        if (eligibleForFetch) {
          console.info("eligibleForFetch '" + this.slotName + "': YES!");
        }
        return eligibleForFetch;
      };

      Slot.prototype.needsRefresh = function(layoutName) {
        var needsRefresh;
        needsRefresh = false;
        if (this.eligibleForFetch) {
          if (this.forceRefresh) {
            needsRefresh = true;
          } else if (this.layoutSizes[layoutName] && this.layoutSizes[layoutName] !== this.currentLayoutName) {
            if (this.layoutSizes[layoutName] !== this.layoutSizes[this.currentLayoutName]) {
              needsRefresh = true;
            }
          }
        }
        console.log("needsRefresh '" + this.slotName + "' -> '" + layoutName + "':", (this.forceRefresh ? 'forced!' : needsRefresh));
        return needsRefresh;
      };

      Slot.prototype.prepareFetch = function(layoutName) {
        var ad_width, size, _i, _len, _ref;
        console.log("prepareFetch '" + this.slotName + "': '" + layoutName + "'", this.layoutSizes[layoutName]);
        this.currentLayoutName = layoutName;
        this.targetElement.show();
        if (console.getLevel('debug')) {
          this.adLabel.html("" + this.slotName + " - " + self.activeLayoutName);
        }
        if (utils.type(this.layoutSizes[layoutName][0]) === 'array') {
          ad_width = 0;
          _ref = this.layoutSizes[layoutName];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            size = _ref[_i];
            if (size[0] > ad_width) {
              ad_width = this.layoutSizes[layoutName][0][0];
            }
          }
        } else {
          ad_width = this.layoutSizes[layoutName][0];
        }
        this.creativeElement.css('width', ad_width + 'px');
        this.creativeElement.css('height', 'auto');
        this.creativeElement.css('width');
        return this.setGptSlotTargetingParams();
      };

      Slot.prototype.define = function() {
        if (this.isDefined) {
          return;
        }
        console.log("Defining '" + this.slotName + "'");
        this.isDefined = true;
        this.adUnit = self.adUnitBase;
        this.adUnit = this.adUnit.replace(/\/+$/, "");
        return self.add_gtp_command_fn(this, function() {
          var e;
          try {
            if (this.slotSizes === 'out-of-page') {
              this.gptSlot = window.googletag.defineOutOfPageSlot(this.adUnit, this.creativeElementId);
            } else {
              this.gptSlot = window.googletag.defineSlot(this.adUnit, this.slotSizes, this.creativeElementId);
            }
            console.log("gpt_Define '" + this.slotName + "' -> " + (utils.type(this.gptSlot)));
            this.gptSlot.dfpManagerSlot = this;
            this.gptSlot.addService(window.googletag.pubads());
            return this.setGptSlotTargetingParams();
          } catch (_error) {
            e = _error;
            console.error(this.slotName, e);
            return console.trace();
          }
        });
      };

      Slot.prototype.display = function() {
        if (this.isDisplayed) {
          return;
        }
        console.log("Displaying '" + this.slotName + "'");
        this.isDisplayed = true;
        return self.add_gtp_command_fn(this, function() {
          var e;
          try {
            console.log("gpt_Display '" + this.slotName + "'");
            return googletag.display(this.creativeElementId);
          } catch (_error) {
            e = _error;
            console.error(e);
            return console.trace();
          }
        });
      };

      Slot.prototype.hide = function() {
        return this.targetElement.hide();
      };

      Slot.prototype.getSizeByLayoutName = function(layoutName) {
        var sizes;
        layoutName = exports.getAliasedLayoutName(layoutName);
        return sizes = this.layoutSizes[layoutName];
      };

      return Slot;

    })();
    self.setActiveLayoutName = function(layoutName) {
      return self.activeLayoutName = exports.getAliasedLayoutName(layoutName);
    };
    self.setLayoutNames = function(layoutNames) {
      var layoutName, _i, _len;
      if (utils.type(layoutNames) !== 'array') {
        console.warn("setLayoutNames: 'layoutNames(" + (utils.type(layoutNames)) + ") must be an array of names!");
      }
      for (_i = 0, _len = layoutNames.length; _i < _len; _i++) {
        layoutName = layoutNames[_i];
        if (self.layoutNameAliases[layoutName]) {
          layoutName = self.layoutNameAliases[layoutName];
        }
        if (!self.hasLayout(layoutName)) {
          self.layoutNames.push(layoutName);
        }
      }
      return self.layoutNames;
    };
    exports.getLayoutName = function() {
      return self.activeLayoutName;
    };
    self.hasLayout = function(layoutName) {
      return __indexOf.call(self.layoutNames, layoutName) >= 0;
    };
    exports.getAliasedLayoutName = function(layoutName) {
      if (self.layoutNameAliases[layoutName]) {
        layoutName = self.layoutNameAliases[layoutName];
      }
      if (!self.hasLayout(layoutName)) {
        console.warn("getAliasedLayoutName: '" + layoutName + "' is not a defined layout!");
        console.log("-Valid layoutNames:", self.layoutNames);
        console.log("-LayoutName aliases:", self.layoutNameAliases);
        return;
      }
      return layoutName;
    };
    self.setSlots = function(defintitions) {
      self.slots = [];
      return exports.addSlots(defintitions);
    };
    exports.addSlots = function(defintitions) {
      var definition, slotName, _results;
      _results = [];
      for (slotName in defintitions) {
        if (!__hasProp.call(defintitions, slotName)) continue;
        definition = defintitions[slotName];
        _results.push(exports.addSlot(slotName, definition.targetElementId, definition.layoutSizes, definition.targetingParams, definition.forceRefresh));
      }
      return _results;
    };
    exports.addSlot = function(slotName, targetElementId, layoutSizes, targetingParams, forceRefresh) {
      var slot;
      if (targetingParams == null) {
        targetingParams = {};
      }
      if (forceRefresh == null) {
        forceRefresh = false;
      }
      slot = new Slot(slotName, targetElementId, layoutSizes, targetingParams, forceRefresh);
      self.slots.push(slot);
      return slot;
    };
    exports.getSlot = function(slotName) {
      var slot, _i, _len, _ref;
      _ref = self.slots;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slot = _ref[_i];
        if (slot.slotName === slotName) {
          return slot;
        }
      }
    };
    exports.getSlotByTargetElementId = function(targetElementId) {
      var slot, _i, _len, _ref;
      _ref = self.slots;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slot = _ref[_i];
        if (slot.targetElementId === targetElementId) {
          return slot;
        }
      }
    };
    self.getValidSlots = function() {
      var slot, _i, _len, _ref, _results;
      _ref = self.slots;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slot = _ref[_i];
        if (slot.valid) {
          _results.push(slot);
        }
      }
      return _results;
    };
    self.enableServices = function() {
      self.servicesEnabled = true;
      return self.add_gtp_command_fn(self, function() {
        var e;
        try {
          return self.enableServices_fn();
        } catch (_error) {
          e = _error;
          console.error("Failed enabling service!", e);
          return self.adsFetched = false;
        }
      });
    };
    self.enableServices_fn = function() {
      var flagName, flagValue, matches, pubads, _ref;
      console.info("Enabling services...");
      pubads = window.googletag.pubads();
      _ref = self.serviceFlags;
      for (flagName in _ref) {
        flagValue = _ref[flagName];
        if ((matches = flagName.match(/^pubads\.(.*)/)) && (flagName = matches[1])) {
          if (typeof pubads[flagName] === 'function') {
            console.info("googletag.pubads." + flagName + "() - " + (flagValue ? 'Invoked' : 'Skipped'));
            if (flagValue === true) {
              pubads[flagName]();
            }
          } else {
            console.warn("Unknown googletag.pubads function: '" + flagName);
          }
        } else {
          console.info("ServiceFlags['" + flagName + "']: ", flagValue);
        }
      }
      if (!self.serviceFlags.enableServices) {
        return console.warn('Test-run only! -googletag.enableServices NOT called!');
      } else {
        window.googletag.enableServices();
        return console.warn('Live run!');
      }
    };
    exports.checkAdHeight = function() {
      if (self.adCheckBrute) {
        console.info("Start brute ad height check");
        console.info("Using selector: " + self.adCheckSelector);
        self.intervalAdHeightCheck = setInterval(self.checkAdHeightLoop, self.adCheckInterval);
        setTimeout(function() {
          return clearInterval(self.intervalAdHeightCheck);
        }, self.adCheckPeriod * self.adCheckInterval);
        return true;
      }
    };
    self.checkAdHeightLoop = function() {
      var ads,
        _this = this;
      console.info('New checkAdHeightLoop');
      ads = $('.creative-container > div > iframe:visible, .creative-container > div > div:visible');
      return ads.each(function(i, elm) {
        var adHeight, err, iframedocument;
        adHeight = 0;
        if ($(elm).is('iframe')) {
          iframedocument = $(elm)[0].contentWindow.document;
          try {
            adHeight = iframedocument.getElementsByTagName('iframe') ? iframedocument.getElementsByTagName('iframe')[0].clientHeight : 0;
          } catch (_error) {
            err = _error;
          }
          adHeight = adHeight < 10 && iframedocument.body ? iframedocument.body.offsetHeight : adHeight;
          adHeight = iframedocument.getElementById('google_image_div') ? iframedocument.getElementById('google_image_div').clientHeight : adHeight;
          console.log('Measured IFRAME height: ' + adHeight);
        } else if ($(elm).is('div')) {
          adHeight = $(elm).height();
          console.log('Measured DIV height: ' + adHeight);
        }
        if (adHeight > 0) {
          console.log('Setting new height on: ' + $(elm).attr('id') + ' : ' + adHeight + 'px');
          $(elm).css('height', adHeight + 'px');
          $(elm).parentsUntil('.dfp-gpt').each((function(index, parent) {
            console.log('Setting new height on parent: ' + $(parent).attr('id') + ' : ' + adHeight + 'px');
            return $(parent).css('height', adHeight + 'px');
          }));
          return $(elm).parents('.dfp-gpt.area').last().children(0).css('height', 'auto');
        }
      });
    };
    return self.add_gtp_command_fn = function(context, cmd_fn, timeout_ms) {
      var _ref;
      if (!cmd_fn) {
        _ref = [context, cmd_fn || window], cmd_fn = _ref[0], context = _ref[1];
      }
      if (self.serviceFlags['enableServices']) {
        if (timeout_ms) {
          return googletag.cmd.push(function() {
            return setTimeout((function() {
              return cmd_fn.call(context);
            }), 1000);
          });
        } else {
          return googletag.cmd.push(function() {
            return cmd_fn.call(context);
          });
        }
      }
    };
  });

}).call(this);
;/**/
