(function(globals) {
var define, requireModule;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requireModule = function(name) {
    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    var mod = registry[name];
    if (!mod) {
      throw new Error("Module '" + name + "' not found.");
    }

    var deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(resolve(deps[i])));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;

    function resolve(child) {
      if (child.charAt(0) !== '.') {
        return child;
      }
      var parts = child.split("/");
      var parentBase = name.split("/").slice(0, -1);

      for (var i = 0, l = parts.length; i < l; i++) {
        var part = parts[i];

        if (part === '..') {
          parentBase.pop();
        }
        else if (part === '.') {
          continue;
        }
        else {
          parentBase.push(part);
        }
      }

      return parentBase.join("/");
    }
  };
})();

define("my_library", 
  ["./my_library/shout","./my_library/ssshh","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var shout = __dependency1__.shout;
    var ssshh = __dependency2__.ssshh;

    __exports__.shout = shout;
    __exports__.ssshh = ssshh;
  });
define("my_library/shout", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var shout = function(s) {
      return s.toUpperCase();
    };

    __exports__["default"] = shout;
  });
define("my_library/ssshh", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var ssshh = function(s) {
      return s.toLowerCase();
    };

    __exports__["default"] = ssshh;
  });
window.MyLibrary = requireModule("my_library");
})(window);