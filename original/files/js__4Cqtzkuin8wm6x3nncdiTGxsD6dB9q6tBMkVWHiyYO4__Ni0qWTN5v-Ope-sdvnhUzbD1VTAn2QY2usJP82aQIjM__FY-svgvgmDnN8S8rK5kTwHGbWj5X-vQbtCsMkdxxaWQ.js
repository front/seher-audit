// Generated by CoffeeScript 1.6.3
(function() {
  var Console,
    __hasProp = {}.hasOwnProperty,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Console = (function() {
    var fn_level_val, fn_name, self, _ref;

    self = Console;

    self.prototype.output_fn_levels = {
      debug: 60,
      log: 50,
      info: 40,
      trace: 30,
      warn: 20,
      error: 10
    };

    if (!window.console) {
      window.console = {};
    }

    if (!typeof window.console.log === 'function') {
      window.console.log = function() {};
    }

    _ref = self.prototype.output_fn_levels;
    for (fn_name in _ref) {
      if (!__hasProp.call(_ref, fn_name)) continue;
      fn_level_val = _ref[fn_name];
      if (typeof window.console[fn_name] !== 'function') {
        window.console[fn_name] = window.console.log;
      }
    }

    function Console(prefix, output_level) {
      var e;
      if (!(this instanceof arguments.callee)) {
        console.error("Console Constructor called as a function! (You forgot the 'new'-keyword!)");
        console.trace();
        return;
      }
      this.output_level = '';
      this.prefix = prefix;
      this.output_level_val = false;
      try {
        this.setLevel(output_level);
      } catch (_error) {
        e = _error;
        console.error(e, this);
      }
    }

    Console.prototype.validateLevel = function(output_level) {
      if (self.prototype.output_fn_levels[output_level]) {
        return true;
      } else {
        console.warn("Console: Unknown output_level '" + output_level + "'");
        return false;
      }
    };

    Console.prototype.getLevel = function(output_level) {
      if (output_level == null) {
        output_level = null;
      }
      if (output_level === null) {
        return this.output_level;
      }
      if (!this.validateLevel(output_level)) {
        return false;
      }
      return output_level === this.output_level;
    };

    Console.prototype.allowLevel = function(output_level) {
      if (!this.validateLevel(output_level)) {
        return false;
      }
      return self.prototype.output_fn_levels[output_level] <= self.prototype.output_fn_levels[this.output_level];
    };

    Console.prototype.setLevel = function(output_level) {
      var _ref1, _results;
      if (output_level === true) {
        output_level = 'debug';
      } else if (output_level === false) {
        output_level = 'error';
      } else if (typeof output_level === 'undefined') {
        console.warn("Console.setLevel: No output-level! Using 'debug'!");
        output_level = 'debug';
      }
      if (!self.prototype.output_fn_levels[output_level]) {
        console.error("Console.setLevel: Unknown level '" + output_level + "'! Using 'debug'!");
        output_level = 'debug';
      }
      this.output_level = output_level;
      this.output_level_val = self.prototype.output_fn_levels[output_level];
      _ref1 = self.prototype.output_fn_levels;
      _results = [];
      for (fn_name in _ref1) {
        if (!__hasProp.call(_ref1, fn_name)) continue;
        fn_level_val = _ref1[fn_name];
        if (fn_level_val > this.output_level_val) {
          _results.push(this[fn_name] = function() {});
        } else {
          _results.push(this[fn_name] = this.getWrappedFn(fn_name, this.prefix));
        }
      }
      return _results;
    };

    Console.prototype.getWrappedFn = function(fn_name, prefix) {
      prefix = (fn_name === 'log' || fn_name === 'debug' ? fn_name + '@' : '') + prefix;
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (prefix) {
          args.unshift(prefix + ':');
        }
        return window.console[fn_name].apply(window.console, args);
      };
    };

    return Console;

  })();

  Console.getLevels = function() {
    var k, _;
    return (function() {
      var _ref, _results;
      _ref = Console.prototype.output_fn_levels;
      _results = [];
      for (k in _ref) {
        if (!__hasProp.call(_ref, k)) continue;
        _ = _ref[k];
        _results.push(k);
      }
      return _results;
    })();
  };

  window.moduleManager = (function() {
    var console, exports, self;
    console = new Console('moduleManager', 'debug');
    self = this;
    exports = {};
    self.registry = {};
    self.locatorRegistry = [];
    exports.getRegistry = function() {
      return self.registry;
    };
    exports.isRegistered = function(id) {
      if (self.registry[id]) {
        return true;
      } else {
        return false;
      }
    };
    exports.unregister = function(id) {
      var idx;
      if (exports.isRegistered(id)) {
        idx = self.locatorRegistry.indexOf(registry[id]);
        self.locatorRegistry = self.locatorRegistry.splice(idx, 1);
        return delete registry[id];
      }
    };
    exports.registerForced = function(id, obj) {
      exports.unregister(id);
      return exports.register(id, obj);
    };
    exports.register = function(id, obj) {
      if (exports.isRegistered(id)) {
        console.error("Cannot register '" + id + "': allready a module registered by this id!");
      } else {
        if (!obj.__id) {
          obj.__id = id;
        }
        registry[id] = obj;
        self.locatorRegistry.push(obj);
      }
      return obj;
    };
    exports.locate = function(preferIds, name, filter, callerInfo) {
      var arg, args, id, matches, obj, prefered, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
      if (preferIds == null) {
        preferIds = [];
      }
      if (filter == null) {
        filter = 'last';
      }
      if (callerInfo == null) {
        callerInfo = '';
      }
      args = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          arg = arguments[_i];
          _results.push(arg);
        }
        return _results;
      }).apply(this, arguments);
      if (typeof args[0] === 'string') {
        args.splice(0, 0, []);
      }
      if ((_ref = args[2]) !== 'first' && _ref !== 'last' && _ref !== 'all') {
        args.splice(2, 0, 'last');
      }
      _ref1 = __slice.call(args), preferIds = _ref1[0], name = _ref1[1], filter = _ref1[2], callerInfo = _ref1[3];
      matches = [];
      if (preferIds.length) {
        prefered = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = preferIds.length; _i < _len; _i++) {
            id = preferIds[_i];
            if (exports.isRegistered(id)) {
              _results.push(self.registry[id]);
            }
          }
          return _results;
        })();
        for (_i = 0, _len = prefered.length; _i < _len; _i++) {
          obj = prefered[_i];
          if (obj[name]) {
            matches.push(obj[name]);
          }
        }
      }
      if (!matches.length || !preferIds.length) {
        _ref2 = self.locatorRegistry;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          obj = _ref2[_j];
          if (obj[name] && (_ref3 = obj.__id, __indexOf.call(preferIds, _ref3) < 0)) {
            matches.push(obj[name]);
          }
        }
      }
      if (!matches.length) {
        if (typeof callerInfo === 'string') {
          callerInfo = "Caller info: '" + callerInfo + "'";
        } else {
          callerInfo = '';
        }
        console.warn("locate(): '" + name + "' not found in any registered module! " + callerInfo);
        console.trace();
        return null;
      }
      if (filter === 'first') {
        matches = matches[0];
      } else if (filter === 'last') {
        matches = matches[matches.length - 1];
      }
      return matches;
    };
    exports.require = function(id) {
      if (!exports.isRegistered(id)) {
        console.warn("require(): Module '" + id + "' not defined! Define it first!");
        console.trace();
      }
      return self.registry[id];
    };
    exports.defineForced = function(id) {
      exports.unregister(id);
      return exports.define.apply(self, arguments);
    };
    exports.define = function(id, deps, factory_fn) {
      var arg, args, dep_id, dep_module, dependencies, e, module, _i, _len, _ref;
      if (deps == null) {
        deps = null;
      }
      if (arguments.length < 2) {
        console.error("define(): Not enough arguments!");
        return;
      }
      args = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          arg = arguments[_i];
          _results.push(arg);
        }
        return _results;
      }).apply(this, arguments);
      if (args.length === 2) {
        args.splice(1, 0, []);
      }
      _ref = __slice.call(args), id = _ref[0], deps = _ref[1], factory_fn = _ref[2];
      if (!typeof factory_fn === 'function') {
        console.error("define: Invalid function passed! Args:", args);
        return;
      }
      try {
        dependencies = [];
        for (_i = 0, _len = deps.length; _i < _len; _i++) {
          dep_id = deps[_i];
          dep_module = self.require(dep_id);
          dependencies.push(dep_module);
        }
      } catch (_error) {
        e = _error;
        console.error(e);
      }
      module = exports.register(id, {});
      factory_fn.apply(factory_fn, [module].concat(dependencies));
      return module;
    };
    return exports;
  })();

  /* Define the core module*/


  moduleManager.define('core', function(exports) {
    var console, fn, fn_name, self;
    console = new Console(exports.__id, 'debug');
    self = (console.getLevel('debug') ? exports : this);
    self.globalExports = ['define', 'defineForced', 'require', 'isRegistered', 'getRegistry', 'locate'];
    self.globalExportsLog = {};
    self.consolePrefixLevels = null;
    for (fn_name in moduleManager) {
      if (!__hasProp.call(moduleManager, fn_name)) continue;
      fn = moduleManager[fn_name];
      exports[fn_name] = fn;
      if (__indexOf.call(self.globalExports, fn_name) >= 0) {
        if (!window[fn_name]) {
          window[fn_name] = moduleManager[fn_name];
          self.globalExportsLog[fn_name] = true;
        } else {
          self.globalExportsLog[fn_name] = false;
          console.warn("Could not set function '" + fn_name + "' on window!");
        }
      }
    }
    exports.getGlobalExportsLog = function() {
      var e, isExported, _ref;
      try {
        _ref = self.globalExportsLog;
        for (fn_name in _ref) {
          if (!__hasProp.call(_ref, fn_name)) continue;
          isExported = _ref[fn_name];
          console.log("" + fn_name + ": " + (isExported ? 'ok! (is set on window!)' : 'failed! (Not set on window!)'));
        }
      } catch (_error) {
        e = _error;
      }
      return self.globalExportsLog;
    };
    self.getConsolePrefixLevels = function() {
      var debug_param_regexp, debug_string, e, location_search_str, matches, output_level, output_level_regexp, part, prefix_level, prefix_levels, prefix_regexp, prefix_str, store, storeModuleId, _i, _j, _len, _len1, _ref, _ref1;
      prefix_levels = [];
      storeModuleId = 'core/utils/store';
      if (moduleManager.isRegistered(storeModuleId)) {
        try {
          store = moduleManager.require(storeModuleId);
          location_search_str = decodeURIComponent(window.location.search) || '';
          debug_param_regexp = new RegExp(/(\?|\&)jam=\[([\w\*\/\:, ]+)\]/);
          output_level_regexp = new RegExp(/^(debug|trace|log|info|warn|error)$/);
          if (/(\?|\&)jam=0/.test(location_search_str)) {
            debug_string = store.set('newConsole_debug_string', '');
          } else if (debug_param_regexp.test(location_search_str)) {
            debug_string = store.set('newConsole_debug_string', location_search_str);
          } else {
            debug_string = store.get('newConsole_debug_string') || '';
          }
          matches = debug_string.match(debug_param_regexp);
          if (matches && matches.length) {
            debug_string = matches[matches.length - 1].replace(RegExp(" ", "g"), "");
            _ref = debug_string.split(",");
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              part = _ref[_i];
              _ref1 = part.split(':'), prefix_str = _ref1[0], output_level = _ref1[1];
              if (prefix_str && output_level_regexp.test(output_level)) {
                prefix_regexp = prefix_str;
                prefix_regexp = prefix_regexp.split('*').join('.+');
                prefix_regexp = prefix_regexp.split('/').join('\/');
                prefix_levels.push({
                  'string': prefix_str,
                  'regexp': new RegExp(prefix_regexp),
                  'output_level': output_level
                });
              } else {
                console.warn("-Invalid jam debug-param part: '" + part + "'");
              }
            }
            if (console.allowLevel('info')) {
              console.info("[ JAM - Javascript Adaptive Machinery ]");
              console.info("Console debug settings ('<prefix>' -> '<level>'):");
              for (_j = 0, _len1 = prefix_levels.length; _j < _len1; _j++) {
                prefix_level = prefix_levels[_j];
                window.console.log(" '" + prefix_level.string + "' -> '" + prefix_level.output_level + "'");
              }
            }
            console.info("-Use query-param 'jam=0' turn off debugging.");
            console.info("-Current debug-param 'jam=[" + debug_string + "]'");
          } else {
            console.info("No console debugging!");
            console.info("-Use query-param 'jam=[<prefix>: <debug_level>, <...>]' to switch on debugging.");
            console.info(" <prefix>: Tests for case-sensitive substring match (use '*' for in-string wildcard)");
            console.info(" <debug_level>: (debug|trace|log|info|warn|error)");
          }
        } catch (_error) {
          e = _error;
          console.error(e);
        }
      }
      return prefix_levels;
    };
    self.getDebugOutputLevel = function(prefix) {
      var output_level, prefix_level, _i, _len, _ref;
      if (self.consolePrefixLevels === null) {
        self.consolePrefixLevels = self.getConsolePrefixLevels();
      }
      output_level = 'error';
      _ref = self.consolePrefixLevels;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prefix_level = _ref[_i];
        if (prefix_level.regexp.test(prefix)) {
          output_level = prefix_level.output_level;
        }
      }
      return output_level;
    };
    exports.newConsole = function(prefix, output_level) {
      var e, newConsole;
      try {
        output_level = self.getDebugOutputLevel(prefix);
        newConsole = new Console(prefix, output_level);
        if (output_level !== 'error') {
          if (prefix) {
            window.console.log("New Console: '" + prefix + "': " + (newConsole.getLevel()));
          } else {
            window.console.log("New Console: " + (newConsole.getLevel()));
          }
        }
        return newConsole;
      } catch (_error) {
        e = _error;
        return console.error(e);
      }
    };
    if (window.newConsole) {
      return console.warn("Cannot set 'window.newConsole': Already set to:", window.newConsole);
    } else {
      return window.newConsole = exports.newConsole;
    }
  });

  /* Define jQuery as module*/


  (function() {
    if (window.jQuery) {
      return moduleManager.register('jQuery', window.jQuery);
    } else {
      return console.error('jQuery is not loaded!');
    }
  })();

}).call(this);
;/**/
// Generated by CoffeeScript 1.6.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define('core/utils', function(exports) {
    var Mixin, mixinKeywords;
    exports.objectKeys = function(obj, get_all) {
      var k, v, values;
      values = [];
      if (get_all) {
        for (k in obj) {
          v = obj[k];
          values.push(k);
        }
      } else {
        for (k in obj) {
          if (!__hasProp.call(obj, k)) continue;
          v = obj[k];
          values.push(k);
        }
      }
      return values;
    };
    exports.objectValues = function(obj, get_all) {
      var k, v, values;
      values = [];
      if (get_all) {
        for (k in obj) {
          v = obj[k];
          values.push(v);
        }
      } else {
        for (k in obj) {
          if (!__hasProp.call(obj, k)) continue;
          v = obj[k];
          values.push(v);
        }
      }
      return values;
    };
    exports.arrayMax = function(array) {
      var v, value, _i, _len;
      value = array[0];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        v = array[_i];
        if (v > value) {
          value = v;
        }
      }
      return value;
    };
    exports.arrayMin = function(array) {
      var v, value, _i, _len;
      value = array[0];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        v = array[_i];
        if (v < value) {
          value = v;
        }
      }
      return value;
    };
    exports.arrayJoinNonEmpty = function(array, concatenator) {
      var merged, part, parts, _i, _len;
      parts = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        part = array[_i];
        if (part != null ? part.trim() : void 0) {
          parts.push(part);
        }
      }
      merged = parts.join(concatenator);
      return merged;
    };
    exports.arraySplitNonEmpty = function(array, separator) {
      var part, _i, _len, _ref, _results;
      _ref = array.split(separator || '/');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        if (part) {
          _results.push(part);
        }
      }
      return _results;
    };
    exports.type = (function() {
      var classToType, name, type, _i, _len, _ref;
      classToType = {};
      _ref = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        type = classToType["[object " + name + "]"] = name.toLowerCase();
      }
      return function(obj, useNumberTypes) {
        var strType;
        strType = Object.prototype.toString.call(obj);
        type = classToType[strType] || "object";
        if (!(useNumberTypes === false) && type === 'number') {
          if (obj % 1 === 0) {
            type = 'integer';
          } else {
            type = 'float';
          }
        }
        return type;
      };
    })();
    exports.parseInt = function(x) {
      return parseInt(x, 10);
    };
    exports.getPathMatch = function(paths, target_path, fallback) {
      var level, match_parts, match_path, max_level, max_value, path_parts, value;
      max_value = fallback;
      max_level = 0;
      path_parts = ai.utils.arraySplitNonEmpty(target_path, '/');
      for (match_path in paths) {
        if (!__hasProp.call(paths, match_path)) continue;
        value = paths[match_path];
        level = 0;
        match_parts = ai.utils.arraySplitNonEmpty(match_path, '/');
        while (match_parts.length && match_parts[level] === path_parts[level]) {
          level++;
        }
        if (level > max_level) {
          max_level = level;
          max_value = value;
        }
      }
      return max_value;
    };
    exports.getVpDims = function() {
      return {
        'width': document.documentElement.clientWidth,
        'height': document.documentElement.clientHeight
      };
    };
    exports.cloneObj = function(obj) {
      var flags, key, newInstance;
      if ((obj == null) || typeof obj !== 'object') {
        return obj;
      }
      if (obj instanceof Date) {
        return new Date(obj.getTime());
      }
      if (obj instanceof RegExp) {
        flags = '';
        if (obj.global != null) {
          flags += 'g';
        }
        if (obj.ignoreCase != null) {
          flags += 'i';
        }
        if (obj.multiline != null) {
          flags += 'm';
        }
        if (obj.sticky != null) {
          flags += 'y';
        }
        return new RegExp(obj.source, flags);
      }
      newInstance = new obj.constructor();
      for (key in obj) {
        newInstance[key] = exports.cloneObj(obj[key]);
      }
      return newInstance;
    };
    exports.extendObj = function() {
      var extenders, key, object, other, val, _i, _len;
      object = arguments[0], extenders = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (object == null) {
        return {};
      }
      for (_i = 0, _len = extenders.length; _i < _len; _i++) {
        other = extenders[_i];
        for (key in other) {
          if (!__hasProp.call(other, key)) continue;
          val = other[key];
          if ((object[key] == null) || typeof val !== "object") {
            object[key] = val;
          } else {
            object[key] = exports.extendObj(object[key], val);
          }
        }
      }
      return object;
    };
    exports.mergeObj = function() {
      var key, mergers, object, other, val, _i, _len;
      object = arguments[0], mergers = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (object == null) {
        return {};
      }
      for (_i = 0, _len = mergers.length; _i < _len; _i++) {
        other = mergers[_i];
        for (key in other) {
          if (!__hasProp.call(other, key)) continue;
          val = other[key];
          if (object[key] == null) {
            object[key] = val;
          } else {
            object[key] = exports.extendObj(object[key], val);
          }
        }
      }
      return object;
    };
    exports.getCssSelectorClassnames = function(selector) {
      var classname, classnames, _i, _len, _ref;
      classnames = [];
      if (typeof selector === 'string') {
        _ref = selector.trim().match(/\.[\w\d-]+/gi);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          classname = _ref[_i];
          classnames.push(classname.trim().replace('.', ''));
        }
      }
      return classnames;
    };
    exports.dasherize = function(str) {
      return str.replace(/([A-Z])/g, function($1) {
        return "-" + $1.toLowerCase();
      });
    };
    exports.addCssClassToString = function(str, classnames) {
      if (!str || typeof str !== 'string') {
        str = '';
      }
      return str.split(' ').concat(classnames).join(' ');
    };
    mixinKeywords = ['extended', 'included'];
    exports.Mixin = Mixin = (function() {
      function Mixin() {}

      Mixin.extend = function(obj) {
        var key, value, _ref;
        for (key in obj) {
          value = obj[key];
          if (__indexOf.call(mixinKeywords, key) < 0) {
            this[key] = value;
          }
        }
        if ((_ref = obj.extended) != null) {
          _ref.apply(this);
        }
        return this;
      };

      Mixin.include = function(obj) {
        var key, value, _ref;
        for (key in obj) {
          value = obj[key];
          if (__indexOf.call(mixinKeywords, key) < 0) {
            this.prototype[key] = value;
          }
        }
        if ((_ref = obj.included) != null) {
          _ref.apply(this);
        }
        return this;
      };

      return Mixin;

    })();
    exports.getUrlParam = function(name) {
      var matches, regExp, value;
      regExp = new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)");
      matches = regExp.exec(location.search);
      if (matches) {
        value = matches[1].replace(/\+/g, "%20");
        value = decodeURIComponent(value);
      } else {
        value = null;
      }
      return value;
    };
    return exports.getFunctionName = function(fn) {
      var fn_name;
      fn_name = arguments.callee.toString();
      fn_name = fn_name.substr('function '.length);
      fn_name = fn_name.substr(0, fn_name.indexOf('('));
      return fn_name;
    };
  });

}).call(this);
;/**/
// Generated by CoffeeScript 1.6.3
/*
See:
  https://github.com/deleteme/store/blob/master/store.coffee
  
A simple wrapper around html5 local storage and cookies
provides three methods to interact with data

it automatically purges data from localStorage if it's full.

set: key, value
  stores the value in a key
  returns the value
get: key
  retrieves the value in the key
  returns the value
clear: key
  removes the data and the key
  returns the value
*/


(function() {
  define('core/utils/store', function(exports) {
    var createCookie, getCookie, localStorageSupported, safeSet;
    localStorageSupported = (function() {
      var e;
      try {
        return (('localStorage' in window) && window['localStorage'] !== null);
      } catch (_error) {
        e = _error;
        return false;
      }
    })();
    if (localStorageSupported) {
      safeSet = function(key, value) {
        var e, num, _i;
        try {
          localStorage.setItem(key, value);
          return value;
        } catch (_error) {
          e = _error;
          for (num = _i = 0; _i <= 5; num = ++_i) {
            localStorage.removeItem(localStorage.key(localStorage.length - 1));
          }
          return safeSet(key, value);
        }
      };
      exports.set = safeSet;
      exports.get = function(key) {
        return localStorage[key];
      };
      return exports.clear = function(key) {
        var value;
        value = localStorage[key];
        localStorage.removeItem(key);
        return value;
      };
    } else {
      createCookie = function(name, value, days) {
        var date, expires;
        if (days) {
          date = new Date;
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toGMTString();
        } else {
          expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
        return value;
      };
      getCookie = function(key) {
        var cookieFragment, _i, _len, _ref;
        key = key + "=";
        _ref = document.cookie.split(';');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cookieFragment = _ref[_i];
          if (cookieFragment.indexOf(key) === 0) {
            return cookieFragment.replace(/^\s+/, '').substring(key.length + 1, cookieFragment.length);
          }
        }
        return null;
      };
      exports.set = function(key, value) {
        return createCookie(key, value, 1);
      };
      exports.get = getCookie;
      return exports.clear = function(key) {
        var value;
        value = Store.get(key);
        createCookie(key, "", -1);
        return value;
      };
    }
  });

}).call(this);
;/**/