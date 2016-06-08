/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//モジュール
	//名前空間（jadeファイル上にある）
	var MainPageNameSpace = __webpack_require__(14);

	//processで順に実行する関数モジュール
	var socketJoin = __webpack_require__(15);
	var preloadData = __webpack_require__(16);
	var init = __webpack_require__(17);
	var main = __webpack_require__(22);

	socketJoin(MainPageNameSpace).then(preloadData).then(init).then(main);

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;var require;/* WEBPACK VAR INJECTION */(function(process, global, module) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
	 * @version   3.2.1
	 */

	(function() {
	    "use strict";
	    function lib$es6$promise$utils$$objectOrFunction(x) {
	      return typeof x === 'function' || (typeof x === 'object' && x !== null);
	    }

	    function lib$es6$promise$utils$$isFunction(x) {
	      return typeof x === 'function';
	    }

	    function lib$es6$promise$utils$$isMaybeThenable(x) {
	      return typeof x === 'object' && x !== null;
	    }

	    var lib$es6$promise$utils$$_isArray;
	    if (!Array.isArray) {
	      lib$es6$promise$utils$$_isArray = function (x) {
	        return Object.prototype.toString.call(x) === '[object Array]';
	      };
	    } else {
	      lib$es6$promise$utils$$_isArray = Array.isArray;
	    }

	    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
	    var lib$es6$promise$asap$$len = 0;
	    var lib$es6$promise$asap$$vertxNext;
	    var lib$es6$promise$asap$$customSchedulerFn;

	    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
	      lib$es6$promise$asap$$len += 2;
	      if (lib$es6$promise$asap$$len === 2) {
	        // If len is 2, that means that we need to schedule an async flush.
	        // If additional callbacks are queued before the queue is flushed, they
	        // will be processed by this flush that we are scheduling.
	        if (lib$es6$promise$asap$$customSchedulerFn) {
	          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
	        } else {
	          lib$es6$promise$asap$$scheduleFlush();
	        }
	      }
	    }

	    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
	      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
	    }

	    function lib$es6$promise$asap$$setAsap(asapFn) {
	      lib$es6$promise$asap$$asap = asapFn;
	    }

	    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
	    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
	    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
	    var lib$es6$promise$asap$$isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

	    // test for web worker but not in IE10
	    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
	      typeof importScripts !== 'undefined' &&
	      typeof MessageChannel !== 'undefined';

	    // node
	    function lib$es6$promise$asap$$useNextTick() {
	      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	      // see https://github.com/cujojs/when/issues/410 for details
	      return function() {
	        process.nextTick(lib$es6$promise$asap$$flush);
	      };
	    }

	    // vertx
	    function lib$es6$promise$asap$$useVertxTimer() {
	      return function() {
	        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
	      };
	    }

	    function lib$es6$promise$asap$$useMutationObserver() {
	      var iterations = 0;
	      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
	      var node = document.createTextNode('');
	      observer.observe(node, { characterData: true });

	      return function() {
	        node.data = (iterations = ++iterations % 2);
	      };
	    }

	    // web worker
	    function lib$es6$promise$asap$$useMessageChannel() {
	      var channel = new MessageChannel();
	      channel.port1.onmessage = lib$es6$promise$asap$$flush;
	      return function () {
	        channel.port2.postMessage(0);
	      };
	    }

	    function lib$es6$promise$asap$$useSetTimeout() {
	      return function() {
	        setTimeout(lib$es6$promise$asap$$flush, 1);
	      };
	    }

	    var lib$es6$promise$asap$$queue = new Array(1000);
	    function lib$es6$promise$asap$$flush() {
	      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
	        var callback = lib$es6$promise$asap$$queue[i];
	        var arg = lib$es6$promise$asap$$queue[i+1];

	        callback(arg);

	        lib$es6$promise$asap$$queue[i] = undefined;
	        lib$es6$promise$asap$$queue[i+1] = undefined;
	      }

	      lib$es6$promise$asap$$len = 0;
	    }

	    function lib$es6$promise$asap$$attemptVertx() {
	      try {
	        var r = require;
	        var vertx = __webpack_require__(5);
	        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
	        return lib$es6$promise$asap$$useVertxTimer();
	      } catch(e) {
	        return lib$es6$promise$asap$$useSetTimeout();
	      }
	    }

	    var lib$es6$promise$asap$$scheduleFlush;
	    // Decide what async method to use to triggering processing of queued callbacks:
	    if (lib$es6$promise$asap$$isNode) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
	    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
	    } else if (lib$es6$promise$asap$$isWorker) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
	    } else if (lib$es6$promise$asap$$browserWindow === undefined && "function" === 'function') {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
	    } else {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
	    }
	    function lib$es6$promise$then$$then(onFulfillment, onRejection) {
	      var parent = this;

	      var child = new this.constructor(lib$es6$promise$$internal$$noop);

	      if (child[lib$es6$promise$$internal$$PROMISE_ID] === undefined) {
	        lib$es6$promise$$internal$$makePromise(child);
	      }

	      var state = parent._state;

	      if (state) {
	        var callback = arguments[state - 1];
	        lib$es6$promise$asap$$asap(function(){
	          lib$es6$promise$$internal$$invokeCallback(state, child, callback, parent._result);
	        });
	      } else {
	        lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
	      }

	      return child;
	    }
	    var lib$es6$promise$then$$default = lib$es6$promise$then$$then;
	    function lib$es6$promise$promise$resolve$$resolve(object) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      if (object && typeof object === 'object' && object.constructor === Constructor) {
	        return object;
	      }

	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$resolve(promise, object);
	      return promise;
	    }
	    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
	    var lib$es6$promise$$internal$$PROMISE_ID = Math.random().toString(36).substring(16);

	    function lib$es6$promise$$internal$$noop() {}

	    var lib$es6$promise$$internal$$PENDING   = void 0;
	    var lib$es6$promise$$internal$$FULFILLED = 1;
	    var lib$es6$promise$$internal$$REJECTED  = 2;

	    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

	    function lib$es6$promise$$internal$$selfFulfillment() {
	      return new TypeError("You cannot resolve a promise with itself");
	    }

	    function lib$es6$promise$$internal$$cannotReturnOwn() {
	      return new TypeError('A promises callback cannot return that same promise.');
	    }

	    function lib$es6$promise$$internal$$getThen(promise) {
	      try {
	        return promise.then;
	      } catch(error) {
	        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
	        return lib$es6$promise$$internal$$GET_THEN_ERROR;
	      }
	    }

	    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	      try {
	        then.call(value, fulfillmentHandler, rejectionHandler);
	      } catch(e) {
	        return e;
	      }
	    }

	    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
	       lib$es6$promise$asap$$asap(function(promise) {
	        var sealed = false;
	        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
	          if (sealed) { return; }
	          sealed = true;
	          if (thenable !== value) {
	            lib$es6$promise$$internal$$resolve(promise, value);
	          } else {
	            lib$es6$promise$$internal$$fulfill(promise, value);
	          }
	        }, function(reason) {
	          if (sealed) { return; }
	          sealed = true;

	          lib$es6$promise$$internal$$reject(promise, reason);
	        }, 'Settle: ' + (promise._label || ' unknown promise'));

	        if (!sealed && error) {
	          sealed = true;
	          lib$es6$promise$$internal$$reject(promise, error);
	        }
	      }, promise);
	    }

	    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
	      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
	      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, thenable._result);
	      } else {
	        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      }
	    }

	    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
	      if (maybeThenable.constructor === promise.constructor &&
	          then === lib$es6$promise$then$$default &&
	          constructor.resolve === lib$es6$promise$promise$resolve$$default) {
	        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
	      } else {
	        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
	        } else if (then === undefined) {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        } else if (lib$es6$promise$utils$$isFunction(then)) {
	          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
	        } else {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        }
	      }
	    }

	    function lib$es6$promise$$internal$$resolve(promise, value) {
	      if (promise === value) {
	        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
	      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
	        lib$es6$promise$$internal$$handleMaybeThenable(promise, value, lib$es6$promise$$internal$$getThen(value));
	      } else {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      }
	    }

	    function lib$es6$promise$$internal$$publishRejection(promise) {
	      if (promise._onerror) {
	        promise._onerror(promise._result);
	      }

	      lib$es6$promise$$internal$$publish(promise);
	    }

	    function lib$es6$promise$$internal$$fulfill(promise, value) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

	      promise._result = value;
	      promise._state = lib$es6$promise$$internal$$FULFILLED;

	      if (promise._subscribers.length !== 0) {
	        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
	      }
	    }

	    function lib$es6$promise$$internal$$reject(promise, reason) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
	      promise._state = lib$es6$promise$$internal$$REJECTED;
	      promise._result = reason;

	      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
	    }

	    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
	      var subscribers = parent._subscribers;
	      var length = subscribers.length;

	      parent._onerror = null;

	      subscribers[length] = child;
	      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
	      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

	      if (length === 0 && parent._state) {
	        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
	      }
	    }

	    function lib$es6$promise$$internal$$publish(promise) {
	      var subscribers = promise._subscribers;
	      var settled = promise._state;

	      if (subscribers.length === 0) { return; }

	      var child, callback, detail = promise._result;

	      for (var i = 0; i < subscribers.length; i += 3) {
	        child = subscribers[i];
	        callback = subscribers[i + settled];

	        if (child) {
	          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
	        } else {
	          callback(detail);
	        }
	      }

	      promise._subscribers.length = 0;
	    }

	    function lib$es6$promise$$internal$$ErrorObject() {
	      this.error = null;
	    }

	    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

	    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
	      try {
	        return callback(detail);
	      } catch(e) {
	        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
	        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
	      }
	    }

	    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
	      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
	          value, error, succeeded, failed;

	      if (hasCallback) {
	        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

	        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
	          failed = true;
	          error = value.error;
	          value = null;
	        } else {
	          succeeded = true;
	        }

	        if (promise === value) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
	          return;
	        }

	      } else {
	        value = detail;
	        succeeded = true;
	      }

	      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
	        // noop
	      } else if (hasCallback && succeeded) {
	        lib$es6$promise$$internal$$resolve(promise, value);
	      } else if (failed) {
	        lib$es6$promise$$internal$$reject(promise, error);
	      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, value);
	      }
	    }

	    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
	      try {
	        resolver(function resolvePromise(value){
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function rejectPromise(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      } catch(e) {
	        lib$es6$promise$$internal$$reject(promise, e);
	      }
	    }

	    var lib$es6$promise$$internal$$id = 0;
	    function lib$es6$promise$$internal$$nextId() {
	      return lib$es6$promise$$internal$$id++;
	    }

	    function lib$es6$promise$$internal$$makePromise(promise) {
	      promise[lib$es6$promise$$internal$$PROMISE_ID] = lib$es6$promise$$internal$$id++;
	      promise._state = undefined;
	      promise._result = undefined;
	      promise._subscribers = [];
	    }

	    function lib$es6$promise$promise$all$$all(entries) {
	      return new lib$es6$promise$enumerator$$default(this, entries).promise;
	    }
	    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
	    function lib$es6$promise$promise$race$$race(entries) {
	      /*jshint validthis:true */
	      var Constructor = this;

	      if (!lib$es6$promise$utils$$isArray(entries)) {
	        return new Constructor(function(resolve, reject) {
	          reject(new TypeError('You must pass an array to race.'));
	        });
	      } else {
	        return new Constructor(function(resolve, reject) {
	          var length = entries.length;
	          for (var i = 0; i < length; i++) {
	            Constructor.resolve(entries[i]).then(resolve, reject);
	          }
	        });
	      }
	    }
	    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
	    function lib$es6$promise$promise$reject$$reject(reason) {
	      /*jshint validthis:true */
	      var Constructor = this;
	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$reject(promise, reason);
	      return promise;
	    }
	    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;


	    function lib$es6$promise$promise$$needsResolver() {
	      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	    }

	    function lib$es6$promise$promise$$needsNew() {
	      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	    }

	    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
	    /**
	      Promise objects represent the eventual result of an asynchronous operation. The
	      primary way of interacting with a promise is through its `then` method, which
	      registers callbacks to receive either a promise's eventual value or the reason
	      why the promise cannot be fulfilled.

	      Terminology
	      -----------

	      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	      - `thenable` is an object or function that defines a `then` method.
	      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	      - `exception` is a value that is thrown using the throw statement.
	      - `reason` is a value that indicates why a promise was rejected.
	      - `settled` the final resting state of a promise, fulfilled or rejected.

	      A promise can be in one of three states: pending, fulfilled, or rejected.

	      Promises that are fulfilled have a fulfillment value and are in the fulfilled
	      state.  Promises that are rejected have a rejection reason and are in the
	      rejected state.  A fulfillment value is never a thenable.

	      Promises can also be said to *resolve* a value.  If this value is also a
	      promise, then the original promise's settled state will match the value's
	      settled state.  So a promise that *resolves* a promise that rejects will
	      itself reject, and a promise that *resolves* a promise that fulfills will
	      itself fulfill.


	      Basic Usage:
	      ------------

	      ```js
	      var promise = new Promise(function(resolve, reject) {
	        // on success
	        resolve(value);

	        // on failure
	        reject(reason);
	      });

	      promise.then(function(value) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```

	      Advanced Usage:
	      ---------------

	      Promises shine when abstracting away asynchronous interactions such as
	      `XMLHttpRequest`s.

	      ```js
	      function getJSON(url) {
	        return new Promise(function(resolve, reject){
	          var xhr = new XMLHttpRequest();

	          xhr.open('GET', url);
	          xhr.onreadystatechange = handler;
	          xhr.responseType = 'json';
	          xhr.setRequestHeader('Accept', 'application/json');
	          xhr.send();

	          function handler() {
	            if (this.readyState === this.DONE) {
	              if (this.status === 200) {
	                resolve(this.response);
	              } else {
	                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	              }
	            }
	          };
	        });
	      }

	      getJSON('/posts.json').then(function(json) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```

	      Unlike callbacks, promises are great composable primitives.

	      ```js
	      Promise.all([
	        getJSON('/posts'),
	        getJSON('/comments')
	      ]).then(function(values){
	        values[0] // => postsJSON
	        values[1] // => commentsJSON

	        return values;
	      });
	      ```

	      @class Promise
	      @param {function} resolver
	      Useful for tooling.
	      @constructor
	    */
	    function lib$es6$promise$promise$$Promise(resolver) {
	      this[lib$es6$promise$$internal$$PROMISE_ID] = lib$es6$promise$$internal$$nextId();
	      this._result = this._state = undefined;
	      this._subscribers = [];

	      if (lib$es6$promise$$internal$$noop !== resolver) {
	        typeof resolver !== 'function' && lib$es6$promise$promise$$needsResolver();
	        this instanceof lib$es6$promise$promise$$Promise ? lib$es6$promise$$internal$$initializePromise(this, resolver) : lib$es6$promise$promise$$needsNew();
	      }
	    }

	    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
	    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
	    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
	    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
	    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
	    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
	    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

	    lib$es6$promise$promise$$Promise.prototype = {
	      constructor: lib$es6$promise$promise$$Promise,

	    /**
	      The primary way of interacting with a promise is through its `then` method,
	      which registers callbacks to receive either a promise's eventual value or the
	      reason why the promise cannot be fulfilled.

	      ```js
	      findUser().then(function(user){
	        // user is available
	      }, function(reason){
	        // user is unavailable, and you are given the reason why
	      });
	      ```

	      Chaining
	      --------

	      The return value of `then` is itself a promise.  This second, 'downstream'
	      promise is resolved with the return value of the first promise's fulfillment
	      or rejection handler, or rejected if the handler throws an exception.

	      ```js
	      findUser().then(function (user) {
	        return user.name;
	      }, function (reason) {
	        return 'default name';
	      }).then(function (userName) {
	        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	        // will be `'default name'`
	      });

	      findUser().then(function (user) {
	        throw new Error('Found user, but still unhappy');
	      }, function (reason) {
	        throw new Error('`findUser` rejected and we're unhappy');
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	      });
	      ```
	      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

	      ```js
	      findUser().then(function (user) {
	        throw new PedagogicalException('Upstream error');
	      }).then(function (value) {
	        // never reached
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // The `PedgagocialException` is propagated all the way down to here
	      });
	      ```

	      Assimilation
	      ------------

	      Sometimes the value you want to propagate to a downstream promise can only be
	      retrieved asynchronously. This can be achieved by returning a promise in the
	      fulfillment or rejection handler. The downstream promise will then be pending
	      until the returned promise is settled. This is called *assimilation*.

	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // The user's comments are now available
	      });
	      ```

	      If the assimliated promise rejects, then the downstream promise will also reject.

	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // If `findCommentsByAuthor` fulfills, we'll have the value here
	      }, function (reason) {
	        // If `findCommentsByAuthor` rejects, we'll have the reason here
	      });
	      ```

	      Simple Example
	      --------------

	      Synchronous Example

	      ```javascript
	      var result;

	      try {
	        result = findResult();
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```

	      Errback Example

	      ```js
	      findResult(function(result, err){
	        if (err) {
	          // failure
	        } else {
	          // success
	        }
	      });
	      ```

	      Promise Example;

	      ```javascript
	      findResult().then(function(result){
	        // success
	      }, function(reason){
	        // failure
	      });
	      ```

	      Advanced Example
	      --------------

	      Synchronous Example

	      ```javascript
	      var author, books;

	      try {
	        author = findAuthor();
	        books  = findBooksByAuthor(author);
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```

	      Errback Example

	      ```js

	      function foundBooks(books) {

	      }

	      function failure(reason) {

	      }

	      findAuthor(function(author, err){
	        if (err) {
	          failure(err);
	          // failure
	        } else {
	          try {
	            findBoooksByAuthor(author, function(books, err) {
	              if (err) {
	                failure(err);
	              } else {
	                try {
	                  foundBooks(books);
	                } catch(reason) {
	                  failure(reason);
	                }
	              }
	            });
	          } catch(error) {
	            failure(err);
	          }
	          // success
	        }
	      });
	      ```

	      Promise Example;

	      ```javascript
	      findAuthor().
	        then(findBooksByAuthor).
	        then(function(books){
	          // found books
	      }).catch(function(reason){
	        // something went wrong
	      });
	      ```

	      @method then
	      @param {Function} onFulfilled
	      @param {Function} onRejected
	      Useful for tooling.
	      @return {Promise}
	    */
	      then: lib$es6$promise$then$$default,

	    /**
	      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	      as the catch block of a try/catch statement.

	      ```js
	      function findAuthor(){
	        throw new Error('couldn't find that author');
	      }

	      // synchronous
	      try {
	        findAuthor();
	      } catch(reason) {
	        // something went wrong
	      }

	      // async with promises
	      findAuthor().catch(function(reason){
	        // something went wrong
	      });
	      ```

	      @method catch
	      @param {Function} onRejection
	      Useful for tooling.
	      @return {Promise}
	    */
	      'catch': function(onRejection) {
	        return this.then(null, onRejection);
	      }
	    };
	    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
	    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
	      this._instanceConstructor = Constructor;
	      this.promise = new Constructor(lib$es6$promise$$internal$$noop);

	      if (!this.promise[lib$es6$promise$$internal$$PROMISE_ID]) {
	        lib$es6$promise$$internal$$makePromise(this.promise);
	      }

	      if (lib$es6$promise$utils$$isArray(input)) {
	        this._input     = input;
	        this.length     = input.length;
	        this._remaining = input.length;

	        this._result = new Array(this.length);

	        if (this.length === 0) {
	          lib$es6$promise$$internal$$fulfill(this.promise, this._result);
	        } else {
	          this.length = this.length || 0;
	          this._enumerate();
	          if (this._remaining === 0) {
	            lib$es6$promise$$internal$$fulfill(this.promise, this._result);
	          }
	        }
	      } else {
	        lib$es6$promise$$internal$$reject(this.promise, lib$es6$promise$enumerator$$validationError());
	      }
	    }

	    function lib$es6$promise$enumerator$$validationError() {
	      return new Error('Array Methods must be provided an Array');
	    }

	    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
	      var length  = this.length;
	      var input   = this._input;

	      for (var i = 0; this._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
	        this._eachEntry(input[i], i);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
	      var c = this._instanceConstructor;
	      var resolve = c.resolve;

	      if (resolve === lib$es6$promise$promise$resolve$$default) {
	        var then = lib$es6$promise$$internal$$getThen(entry);

	        if (then === lib$es6$promise$then$$default &&
	            entry._state !== lib$es6$promise$$internal$$PENDING) {
	          this._settledAt(entry._state, i, entry._result);
	        } else if (typeof then !== 'function') {
	          this._remaining--;
	          this._result[i] = entry;
	        } else if (c === lib$es6$promise$promise$$default) {
	          var promise = new c(lib$es6$promise$$internal$$noop);
	          lib$es6$promise$$internal$$handleMaybeThenable(promise, entry, then);
	          this._willSettleAt(promise, i);
	        } else {
	          this._willSettleAt(new c(function(resolve) { resolve(entry); }), i);
	        }
	      } else {
	        this._willSettleAt(resolve(entry), i);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
	      var promise = this.promise;

	      if (promise._state === lib$es6$promise$$internal$$PENDING) {
	        this._remaining--;

	        if (state === lib$es6$promise$$internal$$REJECTED) {
	          lib$es6$promise$$internal$$reject(promise, value);
	        } else {
	          this._result[i] = value;
	        }
	      }

	      if (this._remaining === 0) {
	        lib$es6$promise$$internal$$fulfill(promise, this._result);
	      }
	    };

	    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
	      var enumerator = this;

	      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
	        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
	      }, function(reason) {
	        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
	      });
	    };
	    function lib$es6$promise$polyfill$$polyfill() {
	      var local;

	      if (typeof global !== 'undefined') {
	          local = global;
	      } else if (typeof self !== 'undefined') {
	          local = self;
	      } else {
	          try {
	              local = Function('return this')();
	          } catch (e) {
	              throw new Error('polyfill failed because global object is unavailable in this environment');
	          }
	      }

	      var P = local.Promise;

	      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
	        return;
	      }

	      local.Promise = lib$es6$promise$promise$$default;
	    }
	    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

	    var lib$es6$promise$umd$$ES6Promise = {
	      'Promise': lib$es6$promise$promise$$default,
	      'polyfill': lib$es6$promise$polyfill$$default
	    };

	    /* global define:true module:true window: true */
	    if ("function" === 'function' && __webpack_require__(6)['amd']) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return lib$es6$promise$umd$$ES6Promise; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module['exports']) {
	      module['exports'] = lib$es6$promise$umd$$ES6Promise;
	    } else if (typeof this !== 'undefined') {
	      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
	    }

	    lib$es6$promise$polyfill$$default();
	}).call(this);


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), (function() { return this; }()), __webpack_require__(4)(module)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = $;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = createjs;

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	module.exports = THREE;

/***/ },
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports) {

	module.exports = TweenLite;

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = MainPageNameSpace;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//------------------------------------------------------
	//PCとスマホを一対一で接続する仕組み
	//------------------------------------------------------

	var Promise = __webpack_require__(2).Promise;
	var $ = __webpack_require__(7);

	module.exports = function (NameSpace) {
	    return new Promise(function (resolve) {
	        var socket = NameSpace.preset.socket;
	        var thisDevice = NameSpace.preset.thisDevice;
	        var thisRoomID = NameSpace.preset.thisRoomID;

	        //PC最初にPCをログインさせて、次にスマホを同じ部屋にログインさせる
	        if (thisDevice === 'PC') {
	            console.log('this ID is ' + thisRoomID);
	            socket.emit('PC_login', {
	                id: thisRoomID
	            });
	        } else if (thisDevice === 'SM') {
	            socket.emit('SM_login', {
	                id: thisRoomID
	            });
	        }

	        resolve(NameSpace);
	    });
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//------------------------------------------------------
	//画像をプリロードする
	//------------------------------------------------------

	var Promise = __webpack_require__(2).Promise;
	var $ = __webpack_require__(7);
	var createjs = __webpack_require__(8);

	module.exports = function (NameSpace) {
	    return new Promise(function (resolve) {
	        var thisDevice = NameSpace.preset.thisDevice;

	        //PCだけ、音楽をプリロード
	        if (thisDevice === 'PC') {
	            var PCLoader = new createjs.LoadQueue(false);
	            PCLoader.installPlugin(createjs.Sound);
	            PCLoader.loadFile({ id: 'audioSprite', src: './json/birdSoundsSprite.json' });
	            PCLoader.addEventListener('fileload', function (data) {
	                if (data.item.id === 'audioSprite') {
	                    createjs.Sound.alternateExtensions = ['mp3'];
	                    //manifestは配列に入っている必要があるので、jsonファイルを前もって配列で囲んでおく
	                    var audioSpriteManifest = data.result;
	                    createjs.Sound.registerSounds(audioSpriteManifest);
	                }
	            });
	        }

	        //PC,スマホが共にロードすべきもの
	        var manifest = [{ id: 'emptyImg', src: './img/dialbird.jpg' }, { id: 'planePositionsJSON', src: './json/planePositions.json' }, { id: 'birdDataJSON', src: './json/birdData.json' }, { id: 'birdSpriteImg', src: './build/img/birdSprite.min.jpg' }, { id: 'birdSpriteJSON', src: './json/birdSprite.json' }, { id: 'springImg', src: './img/springEnv/springEnv.min.jpg' }, { id: 'summerImg', src: './img/summerEnv/summerEnv.min.jpg' }, { id: 'fallImg', src: './img/fallEnv/fallEnv.min.jpg' }, { id: 'winterImg', src: './img/winterEnv/winterEnv.min.jpg' }];
	        var loader = new createjs.LoadQueue(false);
	        loader.loadManifest(manifest);

	        if (thisDevice === 'SM') {
	            loader.addEventListener('progress', handleProgress_for_SM);
	        } else if (thisDevice === 'PC') {
	            loader.addEventListener('progress', handleProgress_for_PC);
	        }

	        loader.addEventListener('complete', function () {
	            //Envマップを取得するために登録する
	            NameSpace.preload.loader = loader;
	            resolve(NameSpace);
	        });

	        //スマホで動くローディングアニメーション
	        function handleProgress_for_SM(e) {
	            var $canvas = $('#canvas');
	            var $loadWindow = $('.loadWindow');
	            var $loadBar = $('.loadWindow__insideLoadBar');
	            var $startWindow = $('.startWindow');
	            var progress = e.progress * 100;

	            //ロードバーをアニメーション
	            $loadBar.css('width', progress + '%');

	            //ロードし終わったら
	            if (progress === 100) {
	                $loadWindow.addClass('js-hide');
	                $canvas.addClass('js-show');
	                $startWindow.addClass('js-show');
	            }
	        }

	        //PCで動くローディングアニメーション
	        function handleProgress_for_PC(e) {
	            var progress = e.progress * 100;

	            //ロードバーをアニメーション
	            $('.loadingWindow__insideLoadBar').css('width', progress + '%');

	            //ロードし終わったら
	            if (progress === 100) {
	                $('.loadingWindow').addClass('js-disappear');
	                $('.QRCodeWindow').addClass('js-show');
	            }
	        }
	    });
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//------------------------------------------------------------------------------------------------------------
	//threejsのinit関数
	//------------------------------------------------------------------------------------------------------------

	var Promise = __webpack_require__(2).Promise;
	var $ = __webpack_require__(7);
	var THREE = __webpack_require__(10);
	var Stats = __webpack_require__(18);

	var RayCastClosure = __webpack_require__(19);
	var OmniSphere = __webpack_require__(20);
	var AnimationClosure = __webpack_require__(21);

	module.exports = function (NameSpace) {
	    return new Promise(function (resolve) {
	        var socket = NameSpace.preset.socket;
	        var thisRoomID = NameSpace.preset.thisRoomID;
	        var thisDevice = NameSpace.preset.thisDevice;

	        var loader = NameSpace.preload.loader;
	        var cylinderPos = loader.getResult('planePositionsJSON');
	        var emptyImg = loader.getResult('emptyImg');

	        //ThreeJSの初期化に必要な要素
	        var planeNum = 100;
	        var planeWidth = 30;
	        var planeHeight = 20;
	        var $canvas = $('#canvas');
	        var cylinderParentNum = 5;

	        //ループ用変数
	        var i = void 0;

	        //------------------------------------------------------
	        //statsを設定
	        //------------------------------------------------------

	        var stats = new Stats();
	        stats.setMode(0);
	        stats.domElement.style.position = "fixed";
	        stats.domElement.style.right = "5px";
	        stats.domElement.style.top = "5px";
	        stats.domElement.style.zIndex = 100;
	        if (NameSpace.preset.statsOn) {
	            document.body.appendChild(stats.domElement);
	        }

	        //------------------------------------------------------
	        //threeJSの基盤となる要素
	        //------------------------------------------------------

	        //canvasのDOM,大きさを設定
	        var canWidth = window.innerWidth;
	        var canHeight = window.innerHeight;

	        //レンダラー（canvasの独立性を鑑みた結果、再度canvasをDOMから呼び出した方が見やすくなると判断）
	        var renderer = new THREE.WebGLRenderer();
	        renderer.setSize(canWidth, canHeight);
	        renderer.setClearColor('#ffffff', 1);
	        $canvas.append(renderer.domElement);

	        //カメラ
	        var camera = new THREE.PerspectiveCamera(45, canWidth / canHeight, 1, 4000);
	        if (thisDevice === 'PC') {
	            camera.position.set(300, 300, 300);
	            camera.lookAt(new THREE.Vector3(0, 0, 0));
	            NameSpace.init.camera = camera;
	        } else if (thisDevice === 'SM') {
	            camera.position.set(0, 0, 0);
	            camera.lookAt(new THREE.Vector3(1, 0, 0));
	            NameSpace.init.camera = camera;
	        }

	        //シーン
	        var scene = new THREE.Scene();
	        NameSpace.init.scene = scene;

	        //コントローラ
	        var control = "";
	        if (thisDevice === 'PC') {
	            control = new THREE.OrbitControls(camera);
	            control.enableZoom = false;
	            //        control.enabled = false;
	        } else if (thisDevice === 'SM') {
	                control = new THREE.DeviceOrientationControls(camera);
	            }

	        //ライト
	        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	        directionalLight.position.set(0, 100, 0);
	        scene.add(directionalLight);
	        var amb = new THREE.AmbientLight(0xa5a5a5, 1);
	        scene.add(amb);

	        //------------------------------------------------------
	        //リサイズ時にcanvasを変形させる
	        //------------------------------------------------------
	        $(window).on('resize', function () {
	            camera.aspect = window.innerWidth / window.innerHeight;
	            camera.updateProjectionMatrix();
	            renderer.setSize(window.innerWidth, window.innerHeight);
	        });

	        //------------------------------------------------------
	        //Planeオブジェクト作成、配置
	        //------------------------------------------------------
	        /*流れ：planeオブジェクトを枚数分作り、その後同じ数位置情報だけ格納した配列を作る。
	        次に親オブジェクトを作り、特定の数だけplaneオブジェクトを子にしていく
	        */

	        //画像を貼るPlaneを１００枚作成する
	        var planes = function () {
	            //格納するarray
	            var array = [];
	            var texture = new THREE.Texture(emptyImg);
	            texture.needsUpdate = true;
	            for (i = 0; i < planeNum; i++) {
	                //mesh作成
	                var pG = new THREE.PlaneGeometry(planeWidth, planeHeight);
	                var pM = new THREE.MeshPhongMaterial({
	                    map: texture,
	                    side: THREE.DoubleSide,
	                    opacity: 0, //最初は透明のままにしておく
	                    transparent: true, //planeのopacityを下げると透けるように設定
	                    depthWrite: false
	                });
	                array[i] = new THREE.Mesh(pG, pM);
	                //planeに紐付ける情報
	                array[i].name = i;
	                scene.add(array[i]);
	            }
	            return array;
	        }();

	        NameSpace.init.planes = planes;

	        //Planeの親オブジェクト作成(nameは特定の段のみを回転させる時に、オブジェクトを特定するために使う)
	        var cylinderParents = function () {
	            var array = [];
	            var cG = new THREE.BoxGeometry(1, 1, 1); //見えなくてもいい
	            var cM = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true, opacity: 0, depthWrite: false });
	            for (i = 0; i < cylinderParentNum; i++) {
	                var parentObject = new THREE.Mesh(cG, cM);
	                parentObject.position.set(0, 0, 0);
	                parentObject.name = i;
	                scene.add(parentObject);
	                array.push(parentObject);
	            }
	            return array;
	        }();

	        //Planeを円柱上に配置し、高さごとに親オブジェクトにadd
	        (function () {
	            //planeを配置する
	            for (i = 0; i < planeNum; i++) {
	                var posX = cylinderPos[i].posX;
	                var posY = cylinderPos[i].posY;
	                var posZ = cylinderPos[i].posZ;
	                var rotX = cylinderPos[i].rotX;
	                var rotY = cylinderPos[i].rotY;
	                var rotZ = cylinderPos[i].rotZ;
	                planes[i].position.set(posX, posY, posZ);
	                planes[i].rotation.set(rotX, rotY, rotZ);
	            }
	            //親オブジェクトにadd
	            for (i = 0; i < planeNum; i++) {
	                var num = Math.floor(i / 20);
	                cylinderParents[num].add(planes[i]);
	            }
	        })();

	        //------------------------------------------------------
	        //Envマップを作成する
	        //------------------------------------------------------
	        var omniSphere = new OmniSphere(NameSpace);
	        omniSphere.createOmniSphere();
	        omniSphere.changeMode('spring');

	        NameSpace.init.omniSphere = omniSphere;

	        //------------------------------------------------------
	        //canvasのクリックイベント（RayCast）を支配するクロージャ
	        //------------------------------------------------------
	        var RCC = new RayCastClosure(NameSpace, $canvas, canWidth, canHeight);

	        NameSpace.init.RCC = RCC;

	        //------------------------------------------------------
	        //アニメーションを支配するクロージャ
	        //------------------------------------------------------
	        var AC = new AnimationClosure(NameSpace, cylinderParents);

	        NameSpace.init.AC = AC;

	        //------------------------------------------------------
	        //アニメーション開始
	        //------------------------------------------------------
	        (function animate() {
	            requestAnimationFrame(animate);
	            AC.observe();
	            control.update();
	            stats.update();
	            renderer.render(scene, camera);
	        })();

	        //------------------------------------------------------
	        //メイン関数開始
	        //------------------------------------------------------
	        resolve(NameSpace);
	    });
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = Stats;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//------------------------------------------------------
	//rayCastの支配をするクロージャ
	//------------------------------------------------------

	var THREE = __webpack_require__(10);

	var RayCastClosure = function RayCastClosure(NameSpace, $canvas, canWidth, canHeight) {
	    _classCallCheck(this, RayCastClosure);

	    var socket = NameSpace.preset.socket;
	    var thisRoomID = NameSpace.preset.thisRoomID;
	    var thisDevice = NameSpace.preset.thisDevice;

	    var camera = NameSpace.init.camera;
	    var planes = NameSpace.init.planes;

	    //マウスの位置座標を取得して、レイキャスト判定をするのに必要な変数
	    var ray = new THREE.Raycaster();
	    var mouse = new THREE.Vector2();

	    //スクリーンをタップした後、スライドすればスワイプアクションして認識し、スライドせずに話した時は時には説明画像を出すようにする
	    var isScreenTapped = false;

	    //画像をスライドアクションした時に、スライドする方向へ画像を動かせるように、画像が属している親オブジェクトを取得し、その親オブジェクトをスライドした方向にスライドした分だけ動かすために使う変数
	    var parentObjectName = '';
	    var prevPosition = '';
	    var speed = 0;

	    //rayCastをオンオフするスイッチ（鳥の説明が出ている間はオフにするため）
	    var rayCastSwitch = false;

	    //------------------------------------------------------
	    //メソッド
	    //------------------------------------------------------

	    //rayCastSwitchを変更する(main関数で、鳥の画像が映し出されるまで、raycastを無効にする)
	    this.changeRayCastSwitch = function (_bool) {
	        rayCastSwitch = _bool;
	    };

	    //------------------------------------------------------
	    //スマホでのタップ・タッチスライドアクションイベントの設定
	    //------------------------------------------------------

	    $canvas.on({
	        'touchstart': handleMouseDown,
	        'touchmove': handleMouseMove,
	        'touchend': handleMouseUp
	    });

	    function handleMouseDown(e) {
	        //鳥の説明出すための判定はこれだけでじゅうぶん
	        isScreenTapped = true;
	        //以下はタップスライドのためのもの
	        if (rayCastSwitch === false) return;
	        speed = 0;
	        mouse.x = e.originalEvent.pageX / canWidth * 2 - 1;
	        mouse.y = -(e.originalEvent.pageY / canHeight) * 2 + 1;
	        ray.setFromCamera(mouse, camera);
	        var intersects = ray.intersectObjects(planes);
	        if (intersects.length > 0) {
	            var target = intersects[0];
	            parentObjectName = target.object.parent.name;
	            prevPosition = { x: mouse.x, y: mouse.y };
	            socket.emit('tapStart', {
	                id: thisRoomID,
	                parentObjectName: parentObjectName
	            });
	        }
	    }

	    function handleMouseMove(e) {
	        //鳥の説明出すための判定はこれだけでじゅうぶん
	        isScreenTapped = false;

	        //以下はタップスライドのためのもの
	        //何も動かしていない
	        if (!prevPosition) return;
	        //画像を動かす()
	        mouse.x = e.originalEvent.pageX / canWidth * 2 - 1;
	        speed = (prevPosition.x - mouse.x) * 0.01;
	        socket.emit('tapMove', {
	            id: thisRoomID,
	            parentObjectName: parentObjectName,
	            speed: speed
	        });
	    }

	    //Raycastを飛ばす
	    function handleMouseUp(e) {
	        (function () {
	            //止めてそのまま話す
	            prevPosition = '';
	            socket.emit('tapEnd', {
	                id: thisRoomID,
	                parentObjectName: parentObjectName,
	                speed: speed
	            });
	        })();

	        //鳥の解説を出すsocket
	        if (isScreenTapped) {
	            isScreenTapped = false;
	            if (rayCastSwitch === false) {
	                return;
	            }
	            mouse.x = e.originalEvent.pageX / canWidth * 2 - 1;
	            mouse.y = -(e.originalEvent.pageY / canHeight) * 2 + 1;
	            //mouseoverの場合は、マウスがcanvas上にある時のみに指定しないと上手くいかなくなるので注意しておくこと
	            ray.setFromCamera(mouse, camera);
	            var intersects = ray.intersectObjects(planes);
	            if (intersects.length > 0) {
	                var target = intersects[0];
	                if (thisDevice === 'PC') {
	                    socket.emit('checkData', {
	                        id: thisRoomID,
	                        name: target.object.name,
	                        birdName: target.object.birdName,
	                        pos: target.object.position
	                    });
	                    socket.emit('selectBird', {
	                        id: thisRoomID,
	                        birdName: target.object.birdName
	                    });
	                } else if (thisDevice === 'SM') {
	                    socket.emit('selectBird', {
	                        id: thisRoomID,
	                        birdName: target.object.birdName
	                    });
	                }
	            }
	        }
	    }
	};

	module.exports = RayCastClosure;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var THREE = __webpack_require__(10);
	var TweenLite = __webpack_require__(13);

	var OmniSphere = function () {
	    function OmniSphere(NameSpace) {
	        _classCallCheck(this, OmniSphere);

	        this.loader = NameSpace.preload.loader;
	        this.scene = NameSpace.init.scene;
	        this.geometry = '';
	    }

	    _createClass(OmniSphere, [{
	        key: 'createOmniSphere',
	        value: function createOmniSphere() {
	            var self = this;
	            var sphereG = new THREE.SphereGeometry(1000, 32, 32);
	            var sphereM = new THREE.MeshBasicMaterial({ transparent: true, opacity: 1, side: THREE.DoubleSide });
	            var sphere = new THREE.Mesh(sphereG, sphereM);
	            self.scene.add(sphere);
	            this.geometry = sphere;
	        }
	    }, {
	        key: 'changeMode',
	        value: function changeMode(season) {
	            var texture = new THREE.Texture(this.loader.getResult(season + 'Img'));
	            texture.needsUpdate = true;
	            this.geometry.material.map = texture;
	        }
	    }, {
	        key: 'fadeOut',
	        value: function fadeOut() {
	            TweenLite.fromTo(this.geometry.material, 1, { opacity: 1 }, { opacity: 0 });
	        }
	    }, {
	        key: 'fadeIn',
	        value: function fadeIn() {
	            TweenLite.fromTo(this.geometry.material, 1, { opacity: 0 }, { opacity: 1 });
	        }
	    }]);

	    return OmniSphere;
	}();

	module.exports = OmniSphere;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//------------------------------------------------------
	//アニメーションを変える核となる変数を監視し、処理を変えるシステム。（クロージャ）
	//------------------------------------------------------

	var $ = __webpack_require__(7);
	var TweenLite = __webpack_require__(13);

	var AnimationClosure = function AnimationClosure(NameSpace, cylinderParents) {
	    var _this = this;

	    _classCallCheck(this, AnimationClosure);

	    var thisDevice = NameSpace.preset.thisDevice;

	    var cylinderPos = NameSpace.preload.planePositions;

	    var planes = NameSpace.init.planes;
	    var planeNum = planes.length;

	    var cylinderParentNum = cylinderParents.length;

	    //ループ用の変数
	    var i = void 0;

	    //------------------------------------------------------
	    //DOMキャッシュ
	    //------------------------------------------------------
	    //PCのみ
	    if (thisDevice === 'PC') {
	        var $birdNavWindow = $('.birdNavWindow');
	        var $birdName = $('.birdNavWindow__birdName');
	        var $birdImageBlock = $('.birdNavWindow__birdPicture');
	    }

	    //------------------------------------------------------
	    //アニメーションを変更する核となる変数。これが変わることによってアニメーションモードが変わる
	    //------------------------------------------------------
	    //五段のそれぞれの段において、回転しているかどうかを格納しておく（スワイプしている時は、その段だけ回転を止めるため）
	    var rotateSwitchs = [true, true, true, true, true];

	    //本来はdisplayModeを円柱状以外のバージョンも作った際に切り替えられるように作成。しかし今回はcylinderのみ。
	    var displayMode = 'cylinder';
	    var rotationSpeed = 0.05;
	    var animationMode = 'off';

	    //------------------------------------------------------
	    //メソッド
	    //------------------------------------------------------

	    //アニメーションモードを変更する
	    this.changeAnimationMode = function (val) {
	        animationMode = val;
	    };

	    //rotateSwitchを変更する
	    this.changeRotateSwitch = function (num, bool) {
	        rotateSwitchs[num] = bool;
	    };

	    //特定の親オブジェクトを特定の方向に回転させる(スワイプ時に使用)
	    this.rotateSpecificParent = function (num, speed) {
	        cylinderParents[num].rotation.y += speed;
	    };

	    //アニメーションを最初に振り分けるオブサーバー
	    this.observe = function () {
	        switch (displayMode) {
	            case 'cylinder':
	                _this.controlCylinderAnimation();
	                break;
	        }
	    };

	    //円柱状態に配置した際のアニメーションの振り分けを行う
	    //appearなどのモードでは、関数を一回だけ発動させたいので、モードを変えた後にすぐにモードをoffにして、連続して発動するのを防ぐ
	    this.controlCylinderAnimation = function () {
	        switch (animationMode) {
	            case 'start':
	                break;
	            case 'normal':
	                for (i = 0; i < cylinderParentNum; i++) {
	                    if (rotateSwitchs[i] === false) continue;
	                    cylinderParents[i].rotation.y += rotationSpeed * Math.PI / 180 * Math.pow(-1, i);
	                }
	                break;
	            case 'appear':
	                _this.rotateAppearAnimation();
	                animationMode = 'off';
	                break;
	            case 'disappear':
	                _this.rotateDisppearAnimation();
	                animationMode = 'off';
	                break;
	            case 'shaffle':
	                _this.shaffleAnimation();
	                animationMode = 'normal';
	                break;
	            case 'off':
	                //stopAnimation
	                break;
	        }
	    };

	    //回転しながら現れる
	    this.rotateAppearAnimation = function () {
	        var param = { y: Math.PI / 360 };
	        for (i = 0; i < cylinderParentNum; i++) {
	            TweenLite.fromTo(param, 1, { y: Math.PI / 360 }, { y: 0, onUpdate: handleUpdate });
	        }
	        for (i = 0; i < planeNum; i++) {
	            planes[i].material.depthWrite = true;
	            TweenLite.fromTo(planes[i].material, 1, { opacity: 0 }, { opacity: 1, onComplete: handleComp });
	        }
	        function handleUpdate() {
	            for (i = 0; i < cylinderParentNum; i++) {
	                cylinderParents[i].rotation.y += Math.pow(-1, i) * param.y;
	            }
	        }
	        function handleComp() {
	            animationMode = 'normal';
	        }
	    };

	    //回転しながら消える
	    this.rotateDisppearAnimation = function () {
	        var param = { y: 0 };
	        for (i = 0; i < cylinderParentNum; i++) {
	            TweenLite.fromTo(param, 1, { y: 0 }, { y: Math.PI / 360, onUpdate: handleUpdate });
	        }
	        for (i = 0; i < planeNum; i++) {
	            //これがないと、背景のsphereの後ろ側（白背景）が写ってしまう
	            planes[i].material.depthWrite = true;
	            TweenLite.fromTo(planes[i].material, 1, { opacity: 1 }, { opacity: 0, onComplete: handleComp });
	        }
	        function handleUpdate() {
	            for (i = 0; i < cylinderParentNum; i++) {
	                cylinderParents[i].rotation.y += Math.pow(-1, i) * param.y;
	            }
	        }
	        function handleComp() {
	            animationMode = 'off';
	        }
	    };

	    //鳥の画像をシャッフルする
	    this.shaffleAnimation = function () {
	        for (i = 0; i < planeNum; i++) {
	            TweenLite.fromTo(planes[i].material, Math.random(), { opacity: 0 }, { opacity: 1, delay: Math.random() * 2 });
	        }
	    };
	};

	module.exports = AnimationClosure;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(7);
	var TweenLite = __webpack_require__(13);
	var THREE = __webpack_require__(10);

	var SoundJukeBox = __webpack_require__(23);

	module.exports = function (NameSpace) {
	    var thisDevice = NameSpace.preset.thisDevice;
	    var socket = NameSpace.preset.socket;
	    var thisRoomID = NameSpace.preset.thisRoomID;

	    var loader = NameSpace.preload.loader;
	    var birdData = loader.getResult('birdDataJSON');
	    var spriteImage = loader.getResult('birdSpriteImg');
	    var spriteJSON = loader.getResult('birdSpriteJSON');

	    var planes = NameSpace.init.planes;
	    var RCC = NameSpace.init.RCC;
	    var omniSphere = NameSpace.init.omniSphere;
	    var AC = NameSpace.init.AC;

	    //PCにのみ、季節ごとに鳥たちの声を自動で流すSoundJukeBoxクラスを追加する（bgm）
	    var SJB = void 0;
	    if (thisDevice === 'PC') {
	        SJB = new SoundJukeBox();
	    }

	    //------------------------------------------------------
	    //PCで使うDOMのキャッシュ
	    //------------------------------------------------------

	    var $birdNavWindow = void 0,
	        $birdName = void 0,
	        $birdType = void 0,
	        $birdImageBlock = void 0,
	        $birdNavSoundIcon = void 0;
	    if (thisDevice === 'PC') {
	        //鳥の説明画面のDOM
	        $birdNavWindow = $('.birdNavWindow');
	        $birdName = $('.birdNavWindow__birdName');
	        $birdType = $('.birdNavWindow__type');
	        $birdImageBlock = $('.birdNavWindow__birdPicture');
	        $birdNavSoundIcon = $('.birdNavWindow__soundIcon');
	    }

	    //------------------------------------------------------
	    //DOMイベント
	    //------------------------------------------------------

	    //スマホ側
	    //一番最初にボタンを押して、鳥図鑑のディスプレイを始める
	    $('#start').on('touchend', function () {
	        socket.emit('startDisplay', {
	            id: thisRoomID
	        });
	        if (thisDevice === 'SM') {
	            $('#navWrap').addClass('js-disappear');
	        }
	    });

	    //PC側
	    if (thisDevice === 'PC') {
	        //headerのマウスアクション
	        $('.header__menuIconWrapper').on({
	            'mouseenter': function mouseenter() {
	                $('.header__pullDownMenu').addClass('js-show');
	            },
	            'mouseleave': function mouseleave() {
	                $('.header__pullDownMenu').removeClass('js-show');
	            }
	        });

	        //bgmのサウンドをオンオフするボタン(スタートボタン押すまでは使えない)
	        (function () {
	            var isBgmOn_ = void 0;
	            $('.soundIconWrapper').on('click', function () {
	                if (isBgmOn_) {
	                    isBgmOn_ = false;
	                    //アイコンの見た目を変える
	                    $('.soundIconWrapper').addClass('js-soundOff');
	                    $('.soundIconWrapper').siblings('p').text('sound off');
	                    SJB.BGM_state = 'stop';
	                    SJB.stopBGM();
	                } else {
	                    isBgmOn_ = true;
	                    $('.soundIconWrapper').removeClass('js-soundOff');
	                    $('.soundIconWrapper').siblings('p').text('sound on');
	                    SJB.BGM_state = 'playing';
	                    SJB.startBGM();
	                }
	            });
	        })();

	        //季節を変更するボタン
	        $('.seasonBtn').on('click', function (e) {
	            socket.emit('changeSeason', {
	                id: thisRoomID,
	                season: e.target.value
	            });
	        });

	        //鳥の解説windowを引っ込めるdeleteIcon
	        $('.birdNavWindow__deleteIcon').on('click', function () {
	            $birdNavWindow.addClass('js-slideOutToLeft');
	        });
	    } else if (thisDevice === 'SM') {
	        $('#check').on('click', function () {
	            socket.emit('startDisplay', {
	                id: thisRoomID
	            });
	        });
	    }

	    //------------------------------------------------------
	    //Socketでイベント待機
	    //------------------------------------------------------

	    //スマホがログインしてきたらQRコードを消す
	    socket.on('SM_login', function () {
	        $('#firstIntroWindow').addClass('js-disappear');
	        $('.main__mainGearIconWrapper').addClass('js-slideInFromOutside');
	        $('.main__mainGearIcon').addClass('js-rotate');
	    });

	    //スマホで開始ボタンを押したらplaneを円柱状に配置。最初のアニメーションを実行。PCで音楽を開始
	    socket.on('startDisplay', function (data) {
	        //ヘッダーを表示する
	        $('#headerWrapper').css('transform', 'translateY(0)');
	        //スマホのシェイクアクションをオンにするために、displayが始まったことを伝える。
	        NameSpace.main.isDisplaying = true;
	        var birdNames = data.birdNames;
	        printBirdImages(birdNames);
	        AC.changeAnimationMode('appear');
	        RCC.changeRayCastSwitch(true);
	        if (thisDevice === 'PC') {
	            SJB.setBirdNames(birdNames);
	            if (SJB.BGM_state === 'playing') {
	                SJB.startBGM();
	            }
	        }
	    });

	    //スマホで鳥をタップしたら、PC上に説明が現れる
	    socket.on('selectBird', function (data) {
	        //PCで、鳥の情報から画像を特定し、DOMの鳥解説画面にappendする
	        if (thisDevice === 'PC') {
	            (function () {
	                //birdNameはローマ字で書かれている鳥の名前。様々な情報を引き出すためのkeyとして活用
	                var birdName = data.birdName;

	                //日本語名と種類を取得
	                var JPName = birdData[birdName].JPName;
	                var type = birdData[birdName].type;

	                //画像を取得
	                var imageCanvas = document.createElement('canvas');
	                var ctx = imageCanvas.getContext('2d');
	                var birdImgPos = spriteJSON[birdName];
	                var sourceX = birdImgPos.x;
	                var sourceY = birdImgPos.y;
	                imageCanvas.width = 450;
	                imageCanvas.height = 300;
	                ctx.drawImage(spriteImage, sourceX, sourceY, 256, 256, 0, 0, 450, 300);
	                var birdImage = imageCanvas;

	                //鳥の解説パネルの初期化
	                $birdImageBlock.html('');
	                $birdNavSoundIcon.off('click');

	                //DOM要素を修飾
	                $birdName.text(JPName);
	                $birdType.text(type);
	                $birdImageBlock.append(birdImage);

	                //サウンドアイコンをクリックしたら音を流す仕組み
	                (function () {
	                    //アイコンをピンクにするaddClassはSoundJukeBox.js内に記述している
	                    var isSingleSoundOn_ = false;
	                    var tid = void 0;
	                    $birdNavSoundIcon.on({
	                        'click': function click() {
	                            if (!isSingleSoundOn_) {
	                                /*まず音源があるかどうかを確認し、あれば音楽を流してスイッチをオンにする
	                                そのあと約7秒間の音楽が流れるので、7秒後にスイッチをオフにする
	                                BGMのボリュームは、皆クラスの方で管理
	                                */
	                                var result = SJB.playSpecificBirdSound(birdName);
	                                if (result) {
	                                    isSingleSoundOn_ = true;
	                                    $birdNavSoundIcon.addClass('js-turnPink');
	                                    tid = setTimeout(function () {
	                                        isSingleSoundOn_ = false;
	                                        $birdNavSoundIcon.removeClass('js-turnPink');
	                                    }, 7500);
	                                } else {
	                                    //console.log('no sound');
	                                }
	                            } else {
	                                    //こちらは押せばオフにするの一択
	                                    clearTimeout(tid);
	                                    isSingleSoundOn_ = false;
	                                    $birdNavSoundIcon.removeClass('js-turnPink');
	                                    SJB.stopSpecificBirdSound();
	                                }
	                        },
	                        'mouseenter': function mouseenter() {
	                            $birdNavSoundIcon.addClass('js-enlarge');
	                        },
	                        'mouseleave': function mouseleave() {
	                            $birdNavSoundIcon.removeClass('js-enlarge');
	                        }
	                    });
	                })();

	                //鳥の画像をスマホでタップしたら、左側から鳥の説明画像がスライドしてきて残る。説明画像右上のデリートボタンを押すまで残る
	                $birdNavWindow.removeClass('js-slideInFromLeft js-slideOutToLeft');
	                $birdNavWindow.addClass('js-slideInFromLeft');
	            })();
	        }
	    });

	    //PCで季節のボタンを押したら映る鳥が変わる
	    socket.on('changeSeason', function (data) {
	        var season = data.season;
	        NameSpace.main.season = season;
	        var birdNames = data.birdNames;
	        if (thisDevice === 'PC') {
	            SJB.stopBGM();
	            SJB.setBirdNames(birdNames);
	        }
	        omniSphere.fadeOut();
	        AC.changeAnimationMode('disappear');
	        setTimeout(function () {
	            printBirdImages(birdNames);
	            omniSphere.changeMode(season);
	            omniSphere.fadeIn();
	            AC.changeAnimationMode('appear');
	            if (thisDevice === 'PC') {
	                switch (season) {
	                    case 'spring':
	                        $('.main__seasonTeller').text('春');
	                        break;
	                    case 'summer':
	                        $('.main__seasonTeller').text('夏');
	                        break;
	                    case 'fall':
	                        $('.main__seasonTeller').text('秋');
	                        break;
	                    case 'winter':
	                        $('.main__seasonTeller').text('冬');
	                        break;
	                }

	                //こちらは季節が変わっても、音楽マークがオフならばならない
	                SJB.startBGM();
	            }
	        }, 1000);
	    });

	    //スマホでタップした時、もしも画像の上であれば、回転を停止する
	    socket.on('tapStart', function (data) {
	        var parentObjectName = data.parentObjectName;
	        AC.changeRotateSwitch(parentObjectName, false);
	    });

	    //スマホのタップスライド
	    socket.on('tapMove', function (data) {
	        var parentObjectName = data.parentObjectName;
	        var speed = data.speed;
	        AC.rotateSpecificParent(parentObjectName, speed);
	    });

	    //スマホのタップ終了
	    socket.on('tapEnd', function (data) {
	        var parentObjectName = data.parentObjectName;
	        var speed = data.speed;
	        AC.changeRotateSwitch(parentObjectName, true);
	        if (speed === 0) return;
	        var param = { speed: speed };
	        TweenLite.to(param, 1, { speed: 0, onUpdate: handleUpdate });
	        function handleUpdate() {
	            AC.rotateSpecificParent(parentObjectName, param.speed);
	        }
	    });

	    //スマホをシェイクした時に鳥をシャッフルする
	    socket.on('shake', function (data) {
	        var birdNames = data.birdNames;
	        AC.changeAnimationMode('shaffle');
	        printBirdImages(birdNames);
	    });

	    //------------------------------------------------------
	    //app.jsから鳥の名前データが送られてきたら、そのデータを元にPlaneに画像を張る。
	    //------------------------------------------------------

	    function printBirdImages(_birdNames) {
	        var len = planes.length;
	        var i = void 0;
	        for (i = 0; i < len; i++) {
	            var birdName = _birdNames[i];
	            var imageCanvas = document.createElement('canvas');
	            var ctx = imageCanvas.getContext('2d');
	            var birdImgPos = spriteJSON[birdName];
	            var sourceX = birdImgPos.x;
	            var sourceY = birdImgPos.y;
	            var size = 256;
	            imageCanvas.width = imageCanvas.height = size;
	            ctx.drawImage(spriteImage, sourceX, sourceY, size, size, 0, 0, size, size);
	            var texture = new THREE.Texture(imageCanvas);
	            texture.needsUpdate = true;
	            planes[i].birdName = birdName;
	            planes[i].material.map = texture;
	        }
	    }
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//------------------------------------------------------
	//音声を管理するクラス
	//------------------------------------------------------
	/*
	bgmのオンオフはBGM_stateとstartBGM~stopBGMまでの４つの関数で行う
	BGM_stateは外部から操作し、これが「stop」になっている間は、４つの関数は機能しなくなる
	このBGM_stateに直接関与するのはheaderにあるsoundのオンオフボタンと、一番最初の開始の時だけである
	*/

	//soundJSとpreloadJS両方
	var createjs = __webpack_require__(8);

	var SoundJukeBox = function () {
	    function SoundJukeBox() {
	        _classCallCheck(this, SoundJukeBox);

	        this.birdNameList = '';
	        this.specificBirdSoundChannel = '';
	        this.BGMchannel = '';
	        this.BGM_state = 'playing';
	    }
	    //特定の鳥の音声だけ流す


	    _createClass(SoundJukeBox, [{
	        key: 'playSpecificBirdSound',
	        value: function playSpecificBirdSound(_birdName) {
	            var self = this;

	            //インスタンス作成
	            this.specificBirdSoundChannel = createjs.Sound.createInstance(_birdName);
	            this.specificBirdSoundChannel.play();

	            //もしインスタンスがなければreturn
	            if (this.specificBirdSoundChannel.playState !== 'playSucceeded') return false;

	            //もしBGMが流れていれば、一時的に停止する
	            if (this.BGM_state === 'playing') this.BGMchannel._pause();

	            //流し終えたらBGMの音量を元に戻す
	            //toDo: もし特定の鳥の音声を流している間にBGMをオフにした場合、一回だけpauseした時の音楽が流れてしまうことに注意
	            setTimeout(function () {
	                if (self.BGM_state === 'playing') {
	                    self.BGMchannel._resume();
	                }
	            }, 7500);

	            return true;
	        }
	    }, {
	        key: 'stopSpecificBirdSound',
	        value: function stopSpecificBirdSound() {
	            if (this.BGM_state === 'playing') {
	                this.BGMchannel._resume();
	            }
	            this.specificBirdSoundChannel.stop();
	        }
	        //app側からsoundリストを受け取って、ランダムに音楽を流す

	    }, {
	        key: 'setBirdNames',
	        value: function setBirdNames(_birdNameList) {
	            this.birdNameList = _birdNameList;
	        }
	    }, {
	        key: 'startBGM',
	        value: function startBGM() {
	            //もしbgmをoffにしていればreturn
	            if (this.BGM_state === 'stop') return;

	            var self = this;
	            this.BGMchannel = this.createRandomInstance();
	            this.BGMchannel.play();

	            //もし音楽の再生に失敗したらやり直し（鳥によっては音源が登録されていなかったり、うまくいかなかった場合にこの関数をやり直すため）
	            if (this.BGMchannel.playState !== 'playSucceeded') {
	                this.startBGM();
	                return;
	            }

	            //一つのインスタンスを流し終えたら次のbgmを流し始める
	            this.BGMchannel.on('complete', function () {
	                self.startBGM();
	            });
	        }
	    }, {
	        key: 'stopBGM',
	        value: function stopBGM() {
	            if (this.BGM_state === 'playing') return;
	            this.BGMchannel.stop();
	        }
	    }, {
	        key: 'createRandomInstance',
	        value: function createRandomInstance() {
	            var len = this.birdNameList.length;
	            var ranNum = Math.floor(Math.random() * len);
	            var birdName = this.birdNameList[ranNum];
	            var instance = createjs.Sound.createInstance(birdName);
	            return instance;
	        }
	    }]);

	    return SoundJukeBox;
	}();

	module.exports = SoundJukeBox;

/***/ }
/******/ ]);