var ac_main =
webpackJsonpac__name_([2],{

/***/ "./node_modules/angular-2-local-storage/dist/LocalStorageService.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
// Angular:
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var Subscriber_1 = __webpack_require__("./node_modules/rxjs/Subscriber.js");
__webpack_require__("./node_modules/rxjs/add/operator/share.js");
// Dependencies:
var LocalStorageServiceConfig_1 = __webpack_require__("./node_modules/angular-2-local-storage/dist/LocalStorageServiceConfig.js");
// Constants:
var DEPRECATED = 'This function is deprecated.';
var LOCAL_STORAGE_NOT_SUPPORTED = 'LOCAL_STORAGE_NOT_SUPPORTED';
var LocalStorageService = (function () {
    function LocalStorageService(config) {
        var _this = this;
        this.isSupported = false;
        this.notifyOptions = {
            setItem: false,
            removeItem: false
        };
        this.prefix = 'ls';
        this.storageType = 'localStorage';
        this.errors = new Subscriber_1.Subscriber();
        this.removeItems = new Subscriber_1.Subscriber();
        this.setItems = new Subscriber_1.Subscriber();
        this.warnings = new Subscriber_1.Subscriber();
        var notifyOptions = config.notifyOptions, prefix = config.prefix, storageType = config.storageType;
        if (notifyOptions != null) {
            var setItem = notifyOptions.setItem, removeItem = notifyOptions.removeItem;
            this.setNotify(setItem, removeItem);
        }
        if (prefix != null) {
            this.setPrefix(prefix);
        }
        if (storageType != null) {
            this.setStorageType(storageType);
        }
        this.errors$ = new Observable_1.Observable(function (observer) { return _this.errors = observer; }).share();
        this.removeItems$ = new Observable_1.Observable(function (observer) { return _this.removeItems = observer; }).share();
        this.setItems$ = new Observable_1.Observable(function (observer) { return _this.setItems = observer; }).share();
        this.warnings$ = new Observable_1.Observable(function (observer) { return _this.warnings = observer; }).share();
        this.isSupported = this.checkSupport();
    }
    LocalStorageService.prototype.add = function (key, value) {
        if (console && console.warn) {
            console.warn(DEPRECATED);
            console.warn('Use `LocalStorageService.set` instead.');
        }
        return this.set(key, value);
    };
    LocalStorageService.prototype.clearAll = function (regularExpression) {
        // Setting both regular expressions independently
        // Empty strings result in catchall RegExp
        var prefixRegex = !!this.prefix ? new RegExp('^' + this.prefix) : new RegExp('');
        var testRegex = !!regularExpression ? new RegExp(regularExpression) : new RegExp('');
        if (!this.isSupported) {
            this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
            return false;
        }
        var prefixLength = this.prefix.length;
        for (var key in this.webStorage) {
            // Only remove items that are for this app and match the regular expression
            if (prefixRegex.test(key) && testRegex.test(key.substr(prefixLength))) {
                try {
                    this.remove(key.substr(prefixLength));
                }
                catch (e) {
                    this.errors.next(e.message);
                    return false;
                }
            }
        }
        return true;
    };
    LocalStorageService.prototype.deriveKey = function (key) {
        return "" + this.prefix + key;
    };
    LocalStorageService.prototype.get = function (key) {
        if (!this.isSupported) {
            this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
            return null;
        }
        var item = this.webStorage ? this.webStorage.getItem(this.deriveKey(key)) : null;
        // FIXME: not a perfect solution, since a valid 'null' string can't be stored
        if (!item || item === 'null') {
            return null;
        }
        try {
            return JSON.parse(item);
        }
        catch (e) {
            return null;
        }
    };
    LocalStorageService.prototype.getStorageType = function () {
        return this.storageType;
    };
    LocalStorageService.prototype.keys = function () {
        if (!this.isSupported) {
            this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
            return [];
        }
        var prefixLength = this.prefix.length;
        var keys = [];
        for (var key in this.webStorage) {
            // Only return keys that are for this app
            if (key.substr(0, prefixLength) === this.prefix) {
                try {
                    keys.push(key.substr(prefixLength));
                }
                catch (e) {
                    this.errors.next(e.message);
                    return [];
                }
            }
        }
        return keys;
    };
    LocalStorageService.prototype.length = function () {
        var count = 0;
        var storage = this.webStorage;
        for (var i = 0; i < storage.length; i++) {
            if (storage.key(i).indexOf(this.prefix) === 0) {
                count += 1;
            }
        }
        return count;
    };
    LocalStorageService.prototype.remove = function () {
        var _this = this;
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i - 0] = arguments[_i];
        }
        var result = true;
        keys.forEach(function (key) {
            if (!_this.isSupported) {
                _this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
                result = false;
            }
            try {
                _this.webStorage.removeItem(_this.deriveKey(key));
                if (_this.notifyOptions.removeItem) {
                    _this.removeItems.next({
                        key: key,
                        storageType: _this.storageType
                    });
                }
            }
            catch (e) {
                _this.errors.next(e.message);
                result = false;
            }
        });
        return result;
    };
    LocalStorageService.prototype.set = function (key, value) {
        // Let's convert `undefined` values to `null` to get the value consistent
        if (value === undefined) {
            value = null;
        }
        else {
            value = JSON.stringify(value);
        }
        if (!this.isSupported) {
            this.warnings.next(LOCAL_STORAGE_NOT_SUPPORTED);
            return false;
        }
        try {
            if (this.webStorage) {
                this.webStorage.setItem(this.deriveKey(key), value);
            }
            if (this.notifyOptions.setItem) {
                this.setItems.next({
                    key: key,
                    newvalue: value,
                    storageType: this.storageType
                });
            }
        }
        catch (e) {
            this.errors.next(e.message);
            return false;
        }
        return true;
    };
    LocalStorageService.prototype.checkSupport = function () {
        try {
            var supported = this.storageType in window
                && window[this.storageType] !== null;
            if (supported) {
                this.webStorage = window[this.storageType];
                // When Safari (OS X or iOS) is in private browsing mode, it
                // appears as though localStorage is available, but trying to
                // call .setItem throws an exception.
                //
                // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made
                // to add something to storage that exceeded the quota."
                var key = this.deriveKey("__" + Math.round(Math.random() * 1e7));
                this.webStorage.setItem(key, '');
                this.webStorage.removeItem(key);
            }
            return supported;
        }
        catch (e) {
            this.errors.next(e.message);
            return false;
        }
    };
    LocalStorageService.prototype.setPrefix = function (prefix) {
        this.prefix = prefix;
        // If there is a prefix set in the config let's use that with an appended
        // period for readability:
        var PERIOD = '.';
        if (this.prefix && !this.prefix.endsWith(PERIOD)) {
            this.prefix = !!this.prefix ? "" + this.prefix + PERIOD : '';
        }
    };
    LocalStorageService.prototype.setStorageType = function (storageType) {
        this.storageType = storageType;
    };
    LocalStorageService.prototype.setNotify = function (setItem, removeItem) {
        if (setItem != null) {
            this.notifyOptions.setItem = setItem;
        }
        if (removeItem != null) {
            this.notifyOptions.removeItem = removeItem;
        }
    };
    LocalStorageService = __decorate([
        __param(0, core_1.Inject(LocalStorageServiceConfig_1.LOCAL_STORAGE_SERVICE_CONFIG)), 
        __metadata('design:paramtypes', [Object])
    ], LocalStorageService);
    return LocalStorageService;
}());
exports.LocalStorageService = LocalStorageService;
//# sourceMappingURL=../src/LocalStorageService.js.map

/***/ },

/***/ "./node_modules/angular-2-local-storage/dist/LocalStorageServiceConfig.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var LOCAL_STORAGE_SERVICE_CONFIG_TOKEN = 'LOCAL_STORAGE_SERVICE_CONFIG';
exports.LOCAL_STORAGE_SERVICE_CONFIG = new core_1.OpaqueToken(LOCAL_STORAGE_SERVICE_CONFIG_TOKEN);
//# sourceMappingURL=../src/LocalStorageServiceConfig.js.map

/***/ },

/***/ "./node_modules/angular-2-local-storage/dist/angular-2-local-storage.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var LocalStorageService_1 = __webpack_require__("./node_modules/angular-2-local-storage/dist/LocalStorageService.js");
exports.LocalStorageService = LocalStorageService_1.LocalStorageService;
var LocalStorageServiceConfig_1 = __webpack_require__("./node_modules/angular-2-local-storage/dist/LocalStorageServiceConfig.js");
exports.LOCAL_STORAGE_SERVICE_CONFIG = LocalStorageServiceConfig_1.LOCAL_STORAGE_SERVICE_CONFIG;
//# sourceMappingURL=../src/angular-2-local-storage.js.map

/***/ },

/***/ "./node_modules/css-loader/index.js!./src/app/app.component.css":
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")();
// imports


// module
exports.push([module.i, "html, body{\n  margin: 0;\n  min-height: 100%;\n  font-family: Arial, Helvetica, sans-serif;\n  background: #00228F;\n  color: #fff;\n}\n", ""]);

// exports


/***/ },

/***/ "./node_modules/css-loader/index.js!./src/app/game/game.component.css":
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")();
// imports


// module
exports.push([module.i, ".questionCard {\n  background: #00228F;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.questionCard .question {\n  display: flex;\n  flex-flow: column;\n}\n.game {\n  display: flex;\n  width: 100%;\n  justify-content: space-around;\n  flex-direction: column;\n}\n.game .row {\n  display: flex;\n  flex-direction: row;\n  color: #fff;\n  border-bottom: 1px solid #fff;\n}\n.game > .row:last-child {\n  border-bottom: 0;\n}\n.game .row > .col {\n  width: 8%;\n  border-right: 1px solid #fff;\n  padding: 40px 0;\n}\n.game .row > .col:hover {\n  background: #004BAC;\n}\n.game .row > .col:first-child {\n  width: 12%;\n  padding-left: 15px;\n}\n.game .row > .col:last-child {\n  border-right: 0;\n}\n.game .row .col.click {\n  text-align: center;\n  cursor: pointer;\n}\n.users {\n  margin-top: 30px;\n  display: flex;\n  width: 100%;\n  justify-content: space-around;\n  flex-direction: row;\n}\n.users .user {\n  cursor: pointer;\n  text-align: center;\n  padding: 20px;\n}\n.users .user:hover {\n  background: #004BAC;\n}\n.users .user.currentUser {\n  border: 1px solid #fff;\n}\n", ""]);

// exports


/***/ },

/***/ "./node_modules/css-loader/index.js!./src/app/home/home.component.css":
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")();
// imports


// module
exports.push([module.i, ".newGame {\n  width: 500px;\n  margin: 50px auto;\n}\n", ""]);

// exports


/***/ },

/***/ "./node_modules/css-loader/lib/css-base.js":
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ },

/***/ "./node_modules/rxjs/add/observable/of.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var of_1 = __webpack_require__("./node_modules/rxjs/observable/of.js");
Observable_1.Observable.of = of_1.of;
//# sourceMappingURL=of.js.map

/***/ },

/***/ "./node_modules/rxjs/add/operator/share.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var share_1 = __webpack_require__("./node_modules/rxjs/operator/share.js");
Observable_1.Observable.prototype.share = share_1.share;
//# sourceMappingURL=share.js.map

/***/ },

/***/ "./node_modules/rxjs/observable/ConnectableObservable.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = __webpack_require__("./node_modules/rxjs/Subject.js");
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var Subscriber_1 = __webpack_require__("./node_modules/rxjs/Subscriber.js");
var Subscription_1 = __webpack_require__("./node_modules/rxjs/Subscription.js");
/**
 * @class ConnectableObservable<T>
 */
var ConnectableObservable = (function (_super) {
    __extends(ConnectableObservable, _super);
    function ConnectableObservable(source, subjectFactory) {
        _super.call(this);
        this.source = source;
        this.subjectFactory = subjectFactory;
        this._refCount = 0;
    }
    ConnectableObservable.prototype._subscribe = function (subscriber) {
        return this.getSubject().subscribe(subscriber);
    };
    ConnectableObservable.prototype.getSubject = function () {
        var subject = this._subject;
        if (!subject || subject.isStopped) {
            this._subject = this.subjectFactory();
        }
        return this._subject;
    };
    ConnectableObservable.prototype.connect = function () {
        var connection = this._connection;
        if (!connection) {
            connection = this._connection = new Subscription_1.Subscription();
            connection.add(this.source
                .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
            if (connection.closed) {
                this._connection = null;
                connection = Subscription_1.Subscription.EMPTY;
            }
            else {
                this._connection = connection;
            }
        }
        return connection;
    };
    ConnectableObservable.prototype.refCount = function () {
        return this.lift(new RefCountOperator(this));
    };
    return ConnectableObservable;
}(Observable_1.Observable));
exports.ConnectableObservable = ConnectableObservable;
var ConnectableSubscriber = (function (_super) {
    __extends(ConnectableSubscriber, _super);
    function ConnectableSubscriber(destination, connectable) {
        _super.call(this, destination);
        this.connectable = connectable;
    }
    ConnectableSubscriber.prototype._error = function (err) {
        this._unsubscribe();
        _super.prototype._error.call(this, err);
    };
    ConnectableSubscriber.prototype._complete = function () {
        this._unsubscribe();
        _super.prototype._complete.call(this);
    };
    ConnectableSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (connectable) {
            this.connectable = null;
            var connection = connectable._connection;
            connectable._refCount = 0;
            connectable._subject = null;
            connectable._connection = null;
            if (connection) {
                connection.unsubscribe();
            }
        }
    };
    return ConnectableSubscriber;
}(Subject_1.SubjectSubscriber));
var RefCountOperator = (function () {
    function RefCountOperator(connectable) {
        this.connectable = connectable;
    }
    RefCountOperator.prototype.call = function (subscriber, source) {
        var connectable = this.connectable;
        connectable._refCount++;
        var refCounter = new RefCountSubscriber(subscriber, connectable);
        var subscription = source._subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    };
    return RefCountOperator;
}());
var RefCountSubscriber = (function (_super) {
    __extends(RefCountSubscriber, _super);
    function RefCountSubscriber(destination, connectable) {
        _super.call(this, destination);
        this.connectable = connectable;
    }
    RefCountSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        var refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        ///
        // Compare the local RefCountSubscriber's connection Subscription to the
        // connection Subscription on the shared ConnectableObservable. In cases
        // where the ConnectableObservable source synchronously emits values, and
        // the RefCountSubscriber's dowstream Observers synchronously unsubscribe,
        // execution continues to here before the RefCountOperator has a chance to
        // supply the RefCountSubscriber with the shared connection Subscription.
        // For example:
        // ```
        // Observable.range(0, 10)
        //   .publish()
        //   .refCount()
        //   .take(5)
        //   .subscribe();
        // ```
        // In order to account for this case, RefCountSubscriber should only dispose
        // the ConnectableObservable's shared connection Subscription if the
        // connection Subscription exists, *and* either:
        //   a. RefCountSubscriber doesn't have a reference to the shared connection
        //      Subscription yet, or,
        //   b. RefCountSubscriber's connection Subscription reference is identical
        //      to the shared connection Subscription
        ///
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    };
    return RefCountSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=ConnectableObservable.js.map

/***/ },

/***/ "./node_modules/rxjs/observable/MulticastObservable.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var ConnectableObservable_1 = __webpack_require__("./node_modules/rxjs/observable/ConnectableObservable.js");
var MulticastObservable = (function (_super) {
    __extends(MulticastObservable, _super);
    function MulticastObservable(source, subjectFactory, selector) {
        _super.call(this);
        this.source = source;
        this.subjectFactory = subjectFactory;
        this.selector = selector;
    }
    MulticastObservable.prototype._subscribe = function (subscriber) {
        var _a = this, selector = _a.selector, source = _a.source;
        var connectable = new ConnectableObservable_1.ConnectableObservable(source, this.subjectFactory);
        var subscription = selector(connectable).subscribe(subscriber);
        subscription.add(connectable.connect());
        return subscription;
    };
    return MulticastObservable;
}(Observable_1.Observable));
exports.MulticastObservable = MulticastObservable;
//# sourceMappingURL=MulticastObservable.js.map

/***/ },

/***/ "./node_modules/rxjs/operator/multicast.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var MulticastObservable_1 = __webpack_require__("./node_modules/rxjs/observable/MulticastObservable.js");
var ConnectableObservable_1 = __webpack_require__("./node_modules/rxjs/observable/ConnectableObservable.js");
/**
 * Returns an Observable that emits the results of invoking a specified selector on items
 * emitted by a ConnectableObservable that shares a single subscription to the underlying stream.
 *
 * <img src="./img/multicast.png" width="100%">
 *
 * @param {Function|Subject} Factory function to create an intermediate subject through
 * which the source sequence's elements will be multicast to the selector function
 * or Subject to push source elements into.
 * @param {Function} Optional selector function that can use the multicasted source stream
 * as many times as needed, without causing multiple subscriptions to the source stream.
 * Subscribers to the given source will receive all notifications of the source from the
 * time of the subscription forward.
 * @return {Observable} an Observable that emits the results of invoking the selector
 * on the items emitted by a `ConnectableObservable` that shares a single subscription to
 * the underlying stream.
 * @method multicast
 * @owner Observable
 */
function multicast(subjectOrSubjectFactory, selector) {
    var subjectFactory;
    if (typeof subjectOrSubjectFactory === 'function') {
        subjectFactory = subjectOrSubjectFactory;
    }
    else {
        subjectFactory = function subjectFactory() {
            return subjectOrSubjectFactory;
        };
    }
    return !selector ?
        new ConnectableObservable_1.ConnectableObservable(this, subjectFactory) :
        new MulticastObservable_1.MulticastObservable(this, subjectFactory, selector);
}
exports.multicast = multicast;
//# sourceMappingURL=multicast.js.map

/***/ },

/***/ "./node_modules/rxjs/operator/share.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var multicast_1 = __webpack_require__("./node_modules/rxjs/operator/multicast.js");
var Subject_1 = __webpack_require__("./node_modules/rxjs/Subject.js");
function shareSubjectFactory() {
    return new Subject_1.Subject();
}
/**
 * Returns a new Observable that multicasts (shares) the original Observable. As long as there is at least one
 * Subscriber this Observable will be subscribed and emitting data. When all subscribers have unsubscribed it will
 * unsubscribe from the source Observable. Because the Observable is multicasting it makes the stream `hot`.
 * This is an alias for .publish().refCount().
 *
 * <img src="./img/share.png" width="100%">
 *
 * @return {Observable<T>} an Observable that upon connection causes the source Observable to emit items to its Observers
 * @method share
 * @owner Observable
 */
function share() {
    return multicast_1.multicast.call(this, shareSubjectFactory).refCount();
}
exports.share = share;
;
//# sourceMappingURL=share.js.map

/***/ },

/***/ "./src/app/about/about.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */
console.log('`About` component loaded asynchronously');
var AboutComponent = (function () {
    function AboutComponent(route) {
        this.route = route;
    }
    AboutComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route
            .data
            .subscribe(function (data) {
            // your resolved data from route
            _this.localState = data.yourData;
        });
        console.log('hello `About` component');
        // static data that is bundled
        // var mockData = require('assets/mock-data/mock-data.json');
        // console.log('mockData', mockData);
        // if you're working with mock data you can also use http.get('assets/mock-data/mock-data.json')
        this.asyncDataWithWebpack();
    };
    AboutComponent.prototype.asyncDataWithWebpack = function () {
        var _this = this;
        // you can also async load mock data with 'es6-promise-loader'
        // you would do this if you don't want the mock-data bundled
        // remember that 'es6-promise-loader' is a promise
        setTimeout(function () {
            __webpack_require__.e/* System.import */(0).then(__webpack_require__.bind(null, "./src/assets/mock-data/mock-data.json"))
                .then(function (json) {
                console.log('async mockData', json);
                _this.localState = json;
            });
        });
    };
    AboutComponent = __decorate([
        core_1.Component({
            selector: 'about',
            styles: ["\n  "],
            template: "\n    <h1>About</h1>\n    <div>\n      For hot module reloading run\n      <pre>npm run start:hmr</pre>\n    </div>\n    <div>\n      <h3>\n        patrick@AngularClass.com\n      </h3>\n    </div>\n    <pre>this.localState = {{ localState | json }}</pre>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _a) || Object])
    ], AboutComponent);
    return AboutComponent;
    var _a;
}());
exports.AboutComponent = AboutComponent;


/***/ },

/***/ "./src/app/about/index.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__("./src/app/about/about.component.ts"));


/***/ },

/***/ "./src/app/app.component.css":
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__("./node_modules/css-loader/index.js!./src/app/app.component.css");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ "./src/app/app.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
/*
 * Angular 2 decorators and services
 */
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var app_service_1 = __webpack_require__("./src/app/app.service.ts");
/*
 * App Component
 * Top Level Component
 */
var AppComponent = (function () {
    function AppComponent(appState) {
        this.appState = appState;
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app',
            encapsulation: core_1.ViewEncapsulation.None,
            styles: [
                __webpack_require__("./src/app/app.component.css")
            ],
            template: "\n    <main>\n      <router-outlet></router-outlet>\n    </main>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof app_service_1.AppState !== 'undefined' && app_service_1.AppState) === 'function' && _a) || Object])
    ], AppComponent);
    return AppComponent;
    var _a;
}());
exports.AppComponent = AppComponent;


/***/ },

/***/ "./src/app/app.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/index.js");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var http_1 = __webpack_require__("./node_modules/@angular/http/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var angular_2_local_storage_1 = __webpack_require__("./node_modules/angular-2-local-storage/dist/angular-2-local-storage.js");
var hmr_1 = __webpack_require__("./node_modules/@angularclass/hmr/dist/index.js");
/*
 * Platform and Environment providers/directives/pipes
 */
var environment_1 = __webpack_require__("./src/app/environment.ts");
var app_routes_1 = __webpack_require__("./src/app/app.routes.ts");
// App is our top level component
var app_component_1 = __webpack_require__("./src/app/app.component.ts");
var app_resolver_1 = __webpack_require__("./src/app/app.resolver.ts");
var app_service_1 = __webpack_require__("./src/app/app.service.ts");
var home_1 = __webpack_require__("./src/app/home/index.ts");
var game_1 = __webpack_require__("./src/app/game/index.ts");
var about_1 = __webpack_require__("./src/app/about/index.ts");
var no_content_1 = __webpack_require__("./src/app/no-content/index.ts");
// Application wide providers
var APP_PROVIDERS = app_resolver_1.APP_RESOLVER_PROVIDERS.concat([
    app_service_1.AppState
]);
var localStorageServiceConfig = {
    prefix: 'my-game',
    storageType: 'localStorage'
};
/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
var AppModule = (function () {
    function AppModule(appRef, appState) {
        this.appRef = appRef;
        this.appState = appState;
    }
    AppModule.prototype.hmrOnInit = function (store) {
        if (!store || !store.state)
            return;
        console.log('HMR store', JSON.stringify(store, null, 2));
        // set state
        this.appState._state = store.state;
        // set input values
        if ('restoreInputValues' in store) {
            var restoreInputValues = store.restoreInputValues;
            setTimeout(restoreInputValues);
        }
        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    };
    AppModule.prototype.hmrOnDestroy = function (store) {
        var cmpLocation = this.appRef.components.map(function (cmp) { return cmp.location.nativeElement; });
        // save state
        var state = this.appState._state;
        store.state = state;
        // recreate root elements
        store.disposeOldHosts = hmr_1.createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues = hmr_1.createInputTransfer();
        // remove styles
        hmr_1.removeNgStyles();
    };
    AppModule.prototype.hmrAfterDestroy = function (store) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    };
    AppModule = __decorate([
        core_1.NgModule({
            bootstrap: [app_component_1.AppComponent],
            declarations: [
                app_component_1.AppComponent,
                about_1.AboutComponent,
                home_1.HomeComponent,
                game_1.GameComponent,
                no_content_1.NoContentComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                router_1.RouterModule.forRoot(app_routes_1.ROUTES, { useHash: false })
            ],
            providers: [
                angular_2_local_storage_1.LocalStorageService,
                {
                    provide: angular_2_local_storage_1.LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
                },
                environment_1.ENV_PROVIDERS,
                APP_PROVIDERS
            ]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ApplicationRef !== 'undefined' && core_1.ApplicationRef) === 'function' && _a) || Object, (typeof (_b = typeof app_service_1.AppState !== 'undefined' && app_service_1.AppState) === 'function' && _b) || Object])
    ], AppModule);
    return AppModule;
    var _a, _b;
}());
exports.AppModule = AppModule;


/***/ },

/***/ "./src/app/app.resolver.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
__webpack_require__("./node_modules/rxjs/add/observable/of.js");
var DataResolver = (function () {
    function DataResolver() {
    }
    DataResolver.prototype.resolve = function (route, state) {
        return Observable_1.Observable.of({ res: 'I am data' });
    };
    DataResolver = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DataResolver);
    return DataResolver;
}());
exports.DataResolver = DataResolver;
// an array of services to resolve routes with data
exports.APP_RESOLVER_PROVIDERS = [
    DataResolver
];


/***/ },

/***/ "./src/app/app.routes.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var home_1 = __webpack_require__("./src/app/home/index.ts");
var about_1 = __webpack_require__("./src/app/about/index.ts");
var game_1 = __webpack_require__("./src/app/game/index.ts");
var no_content_1 = __webpack_require__("./src/app/no-content/index.ts");
exports.ROUTES = [
    { path: '', component: home_1.HomeComponent },
    { path: 'game', component: game_1.GameComponent },
    { path: 'about', component: about_1.AboutComponent },
    { path: '**', component: no_content_1.NoContentComponent },
];


/***/ },

/***/ "./src/app/app.service.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var AppState = (function () {
    function AppState() {
        this._state = {};
    }
    Object.defineProperty(AppState.prototype, "state", {
        // already return a clone of the current state
        get: function () {
            return this._state = this._clone(this._state);
        },
        // never allow mutation
        set: function (value) {
            throw new Error('do not mutate the `.state` directly');
        },
        enumerable: true,
        configurable: true
    });
    AppState.prototype.get = function (prop) {
        // use our state getter for the clone
        var state = this.state;
        return state.hasOwnProperty(prop) ? state[prop] : state;
    };
    AppState.prototype.set = function (prop, value) {
        // internally mutate our state
        return this._state[prop] = value;
    };
    AppState.prototype._clone = function (object) {
        // simple object clone
        return JSON.parse(JSON.stringify(object));
    };
    AppState = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], AppState);
    return AppState;
}());
exports.AppState = AppState;


/***/ },

/***/ "./src/app/environment.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
// Angular 2
// rc2 workaround
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/index.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
// Environment Providers
var PROVIDERS = [];
// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
var _decorateModuleRef = function identity(value) { return value; };
if (false) {
    // Production
    platform_browser_1.disableDebugTools();
    core_1.enableProdMode();
    PROVIDERS = PROVIDERS.slice();
}
else {
    _decorateModuleRef = function (modRef) {
        var appRef = modRef.injector.get(core_1.ApplicationRef);
        var cmpRef = appRef.components[0];
        var _ng = window.ng;
        platform_browser_1.enableDebugTools(cmpRef);
        window.ng.probe = _ng.probe;
        window.ng.coreTokens = _ng.coreTokens;
        return modRef;
    };
    // Development
    PROVIDERS = PROVIDERS.slice();
}
exports.decorateModuleRef = _decorateModuleRef;
exports.ENV_PROVIDERS = PROVIDERS.slice();


/***/ },

/***/ "./src/app/game/game.component.css":
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__("./node_modules/css-loader/index.js!./src/app/game/game.component.css");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ "./src/app/game/game.component.html":
/***/ function(module, exports) {

module.exports = "<div>\n  <div class=\"questionCard\" *ngIf=\"currentQuestion\">\n    <div class=\"question\">\n      {{currentQuestion.question}}<br>\n      за<br>\n      {{currentQuestion.price}}<br>\n      <button *ngIf=\"currentQuestion.state != 2\" (click)=\"currentQuestion.state = 3\">Показать ответ</button>\n      <div *ngIf=\"currentQuestion.state == 3\">\n        {{currentQuestion.answer}}<br>\n        Ответ: <button (click)=\"closeQuestion(currentQuestion, true)\">Верный</button> / <button (click)=\"closeQuestion(currentQuestion, false)\">Ошибочный</button>\n      </div>\n    </div>\n  </div>\n  <div class=\"game\">\n    <div class=\"row\" *ngFor=\"let theme of themes\">\n      <div class=\"col\">{{theme.name}}</div>\n      <div class=\"col click\" *ngFor=\"let price of prices\" (click)=\"openQuestion(theme, price)\">\n        {{questionForPrice(theme, price)}}\n      </div>\n    </div>\n  </div>\n  <div class=\"users\">\n    <div class=\"user\" *ngFor=\"let user of users\" (click)=\"currentUser = user\" [ngClass]=\"{'currentUser': currentUser && user.name == currentUser.name}\">{{user.name}}<br>{{user.money}}</div>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/game/game.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var angular_2_local_storage_1 = __webpack_require__("./node_modules/angular-2-local-storage/dist/angular-2-local-storage.js");
var app_service_1 = __webpack_require__("./src/app/app.service.ts");
var questions_1 = __webpack_require__("./src/app/game/questions.ts");
var themeQuestionsState;
(function (themeQuestionsState) {
    themeQuestionsState[themeQuestionsState["ready"] = 0] = "ready";
    themeQuestionsState[themeQuestionsState["show"] = 1] = "show";
    themeQuestionsState[themeQuestionsState["answer"] = 2] = "answer";
    themeQuestionsState[themeQuestionsState["close"] = 3] = "close";
})(themeQuestionsState || (themeQuestionsState = {}));
;
var GameComponent = (function () {
    function GameComponent(appState, storage) {
        var _this = this;
        this.appState = appState;
        this.storage = storage;
        this.users = [];
        this.prices = [
            100,
            200,
            300,
            400,
            500,
            600,
            700,
            800,
            900,
            1000,
            1000000
        ];
        this.currentQuestion = null;
        this.currentUser = null;
        this.themes = questions_1.questions;
        // for (let i = 0; i < 5; i++) {
        //   const theme: theme = {
        //     name: `Test ${i}`,
        //     questions: []
        //   }
        //   for (let q = 0; q < 12; q++) {
        //     let price = 100 * q;
        //     if (q == 11) {
        //       price = 1000000;
        //     }
        //     theme.questions.push({
        //       price,
        //       question: `Question ${q}`,
        //       answer: `Answer ${q}`,
        //       state: themeQuestionsState.ready
        //     })
        //   }
        //   this.themes.push(theme);
        // }
        var users = this.storage.get('users');
        if (users && users.users) {
            users.users.forEach(function (v) {
                _this.users.push({
                    name: v,
                    money: 0
                });
            });
        }
        this.currentUser = this.users[0];
    }
    GameComponent.prototype.closeQuestion = function (currentQuestion, state) {
        var _this = this;
        currentQuestion.state = themeQuestionsState.close;
        if (state) {
            this.currentUser.money += currentQuestion.price;
        }
        else {
            var gi_1 = 0;
            this.users.forEach(function (v, i) {
                if (v.name == _this.currentUser.name) {
                    gi_1 = i;
                }
            });
            if ((gi_1 + 1) > this.users.length - 1) {
                this.currentUser = this.users[0];
            }
            else {
                this.currentUser = this.users[gi_1 + 1];
            }
        }
        this.currentQuestion = null;
    };
    GameComponent.prototype.openQuestion = function (theme, price) {
        if (!this.currentUser) {
            return;
        }
        var data = theme.questions.find(function (v) { return (v.price == price); });
        if (data && data.state == themeQuestionsState.ready) {
            data.state = themeQuestionsState.show;
            this.currentQuestion = data;
        }
    };
    GameComponent.prototype.questionForPrice = function (theme, price) {
        var data = theme.questions.find(function (v) { return (v.price == price); });
        if (data && data.state == themeQuestionsState.ready) {
            return data.price.toString();
        }
        return '';
    };
    GameComponent = __decorate([
        core_1.Component({
            selector: 'game',
            styles: [__webpack_require__("./src/app/game/game.component.css")],
            template: __webpack_require__("./src/app/game/game.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof app_service_1.AppState !== 'undefined' && app_service_1.AppState) === 'function' && _a) || Object, (typeof (_b = typeof angular_2_local_storage_1.LocalStorageService !== 'undefined' && angular_2_local_storage_1.LocalStorageService) === 'function' && _b) || Object])
    ], GameComponent);
    return GameComponent;
    var _a, _b;
}());
exports.GameComponent = GameComponent;


/***/ },

/***/ "./src/app/game/index.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__("./src/app/game/game.component.ts"));


/***/ },

/***/ "./src/app/game/questions.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
exports.questions = [
    {
        "name": "SPb Python Interest Group",
        "questions": [
            {
                "price": 100,
                "question": "Кто автор ЯП Python?",
                "answer": "Guido van Rossum",
                "state": 0
            },
            {
                "price": 200,
                "question": "Сколько раз в месяц проходят митапы SPb Python Interest Group?",
                "answer": "2 раза",
                "state": 0
            },
            {
                "price": 300,
                "question": "Начиная с какой версии Python для исходного кода по умолчанию используется кодировка UTF-8?",
                "answer": "Python 3",
                "state": 0
            },
            {
                "price": 400,
                "question": "Сколько пробелов принято использовать для отступа в Python?",
                "answer": "4 (четыре)",
                "state": 0
            },
            {
                "price": 500,
                "question": "Назовите аналог null в Python.",
                "answer": "None",
                "state": 0
            },
            {
                "price": 600,
                "question": "Что выведет этот код: \"print(2 ^ 2)\"?",
                "answer": "0 (ноль)",
                "state": 0
            },
            {
                "price": 700,
                "question": "Что в CPython обеспечивает синхронизацию потоков?",
                "answer": "GIL - Global Interpretator Lock",
                "state": 0
            },
            {
                "price": 800,
                "question": "Как называются документы описывающие развитие ЯП Python?",
                "answer": "PEP - Python Enhancement Proposal",
                "state": 0
            },
            {
                "price": 900,
                "question": "В честь чего Python получил своё название?",
                "answer": "Группа комедиантов \"Monty Python\"",
                "state": 0
            },
            {
                "price": 1000,
                "question": "Кто владеет логотипом ЯП Python?",
                "answer": "Python Software Foundation",
                "state": 0
            },
            {
                "price": 1000000,
                "question": "Когда в Python появятся нормальные лямбды?",
                "answer": "На данный вопрос нет ответа",
                "state": 0
            }
        ]
    },
    {
        "name": "FPROG",
        "questions": [
            {
                "price": 100,
                "question": "Кто автор языка Common Lisp?",
                "answer": "комитет ANSI X3J13",
                "state": 0
            },
            {
                "price": 200,
                "question": "",
                "answer": "",
                "state": 3
            },
            {
                "price": 300,
                "question": "Назовите три диалекта лиспа",
                "answer": "Common Lisp, Clojure, Scheme/Racket, Emacs Lisp, New Lisp, Lisp Flavoured Erlang",
                "state": 0
            },
            {
                "price": 400,
                "question": "Назовите известного лиспера",
                "answer": "Брендан Эйх (автор JavaScript) Джо Армстронг (автор Erlang) Йокихиро Мацумото (автор Ruby) Ларри Уол (автор Perl) Алан Кей (автор Smalltalk) Джон МакКарти (автор лиспа)",
                "state": 0
            },
            {
                "price": 500,
                "question": "В чем состоит главная идея лиспа?",
                "answer": "Код = данные",
                "state": 0
            },
            {
                "price": 600,
                "question": "На чём был написан первый интерпретатор Erlang?",
                "answer": "Пролог",
                "state": 0
            },
            {
                "price": 700,
                "question": "Что в Common Lisp не позволяет иметь продолжения?",
                "answer": "Специальная форма unwind-protect",
                "state": 0
            },
            {
                "price": 800,
                "question": "",
                "answer": "",
                "state": 3
            },
            {
                "price": 900,
                "question": "В честь чего названа фунция cdr в лиспе?",
                "answer": "Команда процессоров IBM: Copy Decrement Register",
                "state": 0
            },
            {
                "price": 1000,
                "question": "",
                "answer": "",
                "state": 3
            },
            {
                "price": 1000000,
                "question": "Когда на Common Lisp можно будет найти работу за деньги?",
                "answer": "Уже сейчас (crossover.com нанимает)",
                "state": 0
            }
        ]
    },
    {
        "name": "PiterJS",
        "questions": [
            {
                "price": 100,
                "question": "Кто автор ECMAScript",
                "answer": "Брендан Эйх",
                "state": 0
            },
            {
                "price": 200,
                "question": "Какая последняя версия ECMAScript",
                "answer": "ES2016",
                "state": 0
            },
            {
                "price": 300,
                "question": "В каком году был придуман JavaScript",
                "answer": "1995",
                "state": 0
            },
            {
                "price": 400,
                "question": "Что получится, если сложить true + false?",
                "answer": "1 (один)",
                "state": 0
            },
            {
                "price": 500,
                "question": "Что делает оператор ===?",
                "answer": "Сравнивает без приведения типа",
                "state": 0
            },
            {
                "price": 600,
                "question": "Есть ли разница между вызовами i++ и ++i?",
                "answer": "Операция пост-инкремента(i++) возвращает значение переменной i до выполнения этого инкремента. Операция префикс-инкремента (++i) возвращает значение уже измененной переменной.",
                "state": 0
            },
            {
                "price": 700,
                "question": "Чему равно i в конце кода? for(var i=0; i<10; i++) { console.log(i); }",
                "answer": "10 (десять)",
                "state": 0
            },
            {
                "price": 800,
                "question": "Верно ли что null == undefined",
                "answer": "Да",
                "state": 0
            },
            {
                "price": 900,
                "question": "Верно ли сравнение: \"ёжик\" > \"яблоко\"?",
                "answer": "да",
                "state": 0
            },
            {
                "price": 1000,
                "question": "Чему равна сумма [] + 1 + 2",
                "answer": "12",
                "state": 0
            },
            {
                "price": 1000000,
                "question": "Каков будет результат? null + {0:1}[0] + [,[1],][1][0]",
                "answer": "2",
                "state": 0
            }
        ]
    },
    {
        "name": "SPb .Net Community",
        "questions": [
            {
                "price": 100,
                "question": "Как называется C# и VB компилятор написаный на C#",
                "answer": "Roslyn",
                "state": 0
            },
            {
                "price": 200,
                "question": "В каком году вышла первая версия .NET Framework?",
                "answer": "2002",
                "state": 0
            },
            {
                "price": 300,
                "question": "Где была собрана первая встреча сообщества SpbDotNet",
                "answer": "На ITGM",
                "state": 0
            },
            {
                "price": 400,
                "question": "В каком году Microsoft купил Xamarin",
                "answer": "2016",
                "state": 0
            },
            {
                "price": 500,
                "question": "Как, с точки зрения музыкально-образованного читателя, произнисится надпись \"C#\"?",
                "answer": "До-Диез",
                "state": 0
            },
            {
                "price": 600,
                "question": "В какой версии языка появился LINQ?",
                "answer": "3.0 (2008 год)",
                "state": 0
            },
            {
                "price": 700,
                "question": "Назовите человека в красном поло",
                "answer": "Скотт Гатри",
                "state": 0
            },
            {
                "price": 800,
                "question": "Назовите автора языка C#, а так же Turbo Pascal, Delphi, TypeScript.",
                "answer": "Аннерс Хейлсберг",
                "state": 0
            },
            {
                "price": 900,
                "question": "Назовите хоть один язык, основанный на DLR, но не IronPython и не IronRuby",
                "answer": "PowerShell, Clojure CLR, IronScheme, IronLisp, IronJS, Boo",
                "state": 0
            },
            {
                "price": 1000,
                "question": "Из какого языка черпает свою идеология F#",
                "answer": "OCaml",
                "state": 0
            },
            {
                "price": 1000000,
                "question": "Как называлась Питерская .NET группа до SpbDotNet, которую вёл Дмитрий Нестерук",
                "answer": "SpbAlt.Net",
                "state": 0
            }
        ]
    },
    {
        "name": "SPb GO Community",
        "questions": [
            {
                "price": 100,
                "question": "Табы или пробелы?",
                "answer": "Табы",
                "state": 0
            },
            {
                "price": 200,
                "question": "Ошибки это?",
                "answer": "Значения",
                "state": 0
            },
            {
                "price": 300,
                "question": "Последняя версия Go?",
                "answer": "1.7.3",
                "state": 0
            },
            {
                "price": 400,
                "question": "Сколько лет языку Go?",
                "answer": "7",
                "state": 0
            },
            {
                "price": 500,
                "question": "Назовите трех авторов и проектировщиков первых версий языка Go?",
                "answer": "Роберт Гризмер, Роб Пайк и Кен Томпсон",
                "state": 0
            },
            {
                "price": 600,
                "question": "На каком порту по умаолчанию запускается pprof?",
                "answer": "6060",
                "state": 0
            },
            {
                "price": 700,
                "question": "Какой самый известный инструмент для контейнеризации написан на Go?",
                "answer": "Docker",
                "state": 0
            },
            {
                "price": 800,
                "question": "С помощью какого инструмента можно использовать C в Go программах?",
                "answer": "cgo",
                "state": 0
            },
            {
                "price": 900,
                "question": "Что делает код<br>a := 1<br>_ = a",
                "answer": "Присваивает значение пустому идентификатору",
                "state": 0
            },
            {
                "price": 1000,
                "question": "Как зовут автора логотипа Go?",
                "answer": "Renee French",
                "state": 0
            },
            {
                "price": 1000000,
                "question": "",
                "answer": "",
                "state": 3
            }
        ]
    },
    {
        "name": "SPb Community of Analysts",
        "questions": [
            {
                "price": 100,
                "question": "Нормальные люди приходят к другим за ответами, а аналитики...",
                "answer": "За требованиями",
                "state": 0
            },
            {
                "price": 200,
                "question": "У каких аналитиков есть свой профессиональный стандарт в РФ? ",
                "answer": "У системных",
                "state": 0
            },
            {
                "price": 300,
                "question": "Какой ГОСТ определяет стандарт на техническое задание?",
                "answer": "ГОСТ 34.602-89 «Техническое задание на создание автоматизированной системы»",
                "state": 0
            },
            {
                "price": 400,
                "question": "Аналог Кнута и Страуструпа для российских аналитиков?",
                "answer": "Карл Вигерс",
                "state": 0
            },
            {
                "price": 500,
                "question": "SWEBоK и SEBoK - в чем разница? ",
                "answer": "SWEBoK (Software Engineering Body of Knowledge) - Свод знаний по разработке ПО. SEBoK (Guide to the Systems Engineering Body of Knowledge) - Свод знаний по системной инженерии.",
                "state": 0
            },
            {
                "price": 600,
                "question": "Чем отличается таксономия от глоссария?",
                "answer": "Иерархией",
                "state": 0
            },
            {
                "price": 700,
                "question": "Сколько почему?",
                "answer": "5 WHY",
                "state": 0
            },
            {
                "price": 800,
                "question": "RACI матрица, эта аббревиатура разбивается на четыре конкретных роли. Назовите каждую из них.",
                "answer": "Responsible (на матрице отмечается буквой R) – ответственный непосредственно за выполнение работы. Accountable (A) – подотчетный, такую роль может занимать только один человек на одной задаче. Consulted (C) – один сотрудник или группа, с которыми проводятся консультации касательно задачи и мнения которых должно учитываться. Informed (I) – сотрудники, уведомляемые о выполнении конкретной задачи",
                "state": 0
            },
            {
                "price": 900,
                "question": "Сколько аналитиков нужно, чтобы написать Hello world?",
                "answer": "Ни одного. аналитики не пишут код",
                "state": 0
            },
            {
                "price": 1000,
                "question": "Мама старше своего сына на 21 год. Через шесть лет она будет старше его в пять раз. Вопрос: ГДЕ ПАПА?????",
                "answer": "решая 2 простых уравнения получаем что сыну -3/4 года, т.е -9 месяцев! вывод: папа сейчас с будущей мамой занимаются зачатием будущего сына!!!",
                "state": 0
            },
            {
                "price": 1000000,
                "question": "Человек прошел 1 км на юг, 1 км на восток и 1 км на север, после чего оказался в том же месте, откуда вышел. Где может быть это место?",
                "answer": "1. На северном полюсе. 2. на таком расстоянии от южного полюса, что километром южнее длина окружности соответствующего меридиана составляет 1 км. 3. На таком расстоянии от южного полюса, что километром южнее длина окружности соответствующего меридиана укладывается в в километр целое число раз",
                "state": 3
            }
        ]
    },
    {
        "name": "UX SPb",
        "questions": [
            {
                "price": 100,
                "question": "Кто написал книгу про проектирование, ориентированное на пользователей, и назвал ее в честь невполне здоровых людей?",
                "answer": "(Алан) Купер",
                "state": 0
            },
            {
                "price": 200,
                "question": "\"Коридорное тестирование\" это?",
                "answer": "Быстрая демонстрация прототипа решения случайно встреченному (в коридоре) человеку и оценка его реакции",
                "state": 0
            },
            {
                "price": 300,
                "question": "Чем научное наблюдение в ходе исследования пользователей отличается от простого рассматривания?",
                "answer": "Ведением протокола наблюдений",
                "state": 0
            },
            {
                "price": 400,
                "question": "Чьим именем назван закон, связывающий время перемещения с требуемой точностью и дальностью движения?",
                "answer": "Закон Фиттса (Пол Фиттс)",
                "state": 0
            },
            {
                "price": 500,
                "question": "",
                "answer": "",
                "state": 3
            },
            {
                "price": 600,
                "question": "",
                "answer": "",
                "state": 3
            },
            {
                "price": 700,
                "question": "Что описывается в \"гайдлайнах\" интерфейсов операционных систем, кроме требований по визуальному оформлению?",
                "answer": "Назначение элементов интерфейса, правила их применения и, иногда, процесс проектирования",
                "state": 0
            },
            {
                "price": 800,
                "question": "В каком году введен в действие ГОСТ, описывающий процесс человеко-ориентированного проектирования интерактивных систем?",
                "answer": "2012",
                "state": 0
            },
            {
                "price": 900,
                "question": "К какой области психологии стоит обратиться, рассматривая вопросы взаимного расположения и понятной группировки элементов интерфейса?",
                "answer": "Гештальтпсихология",
                "state": 0
            },
            {
                "price": 1000,
                "question": "Концепция современных графических интерфейсов была представлена Дугласом Энгельбартом в видеопрезентации, получившей собственное имя \"Мать всех демонстраций\". Случилось это до появления MacOS или Windows. В каком году?",
                "answer": "1968",
                "state": 0
            },
            {
                "price": 1000000,
                "question": "",
                "answer": "",
                "state": 3
            }
        ]
    },
    {
        "name": "SPb IT HR",
        "questions": [
            {
                "price": 100,
                "question": "Кто, по мнению wikipedia, ошибочно перевел термин Employer branding?  После этого ошибочного перевода в России это явление получило название HR branding",
                "answer": "Компания HeadHanter",
                "state": 0
            },
            {
                "price": 200,
                "question": "эта международная IT HR конференция в Петербурге проводилась уже в 10 раз",
                "answer": "«нАйТи ответ!»",
                "state": 0
            },
            {
                "price": 300,
                "question": "этот сайт многие годы традиционно считается самым популярным ресурсом для поиска IT работы в США",
                "answer": "Monster.com",
                "state": 0
            },
            {
                "price": 400,
                "question": "В англоязычной шутке один линукс-программист зашел в бар, заказал еду и попросил ЕЕ. После чего уже два линукс-программиста наслаждались едой. Назовите ЕЕ.",
                "answer": "Вилка (fork)",
                "state": 0
            },
            {
                "price": 500,
                "question": "в наиболее уважаемых бизнес-школах мира этот тест используется как один из критериев отбора заявлений",
                "answer": "GMAT",
                "state": 0
            },
            {
                "price": 600,
                "question": "как правило IT старт-апы относятся именно к этому уровню по Спиральной динамике ",
                "answer": "оранжевый",
                "state": 0
            },
            {
                "price": 700,
                "question": "один из самых влиятельных теоретиков менеджмента XX века сказал \"The best way to predict the future is to create it\"",
                "answer": "Питер Дрюкер",
                "state": 0
            },
            {
                "price": 800,
                "question": "Автор вопроса назвал город Менло-Парк в районе Силиконовой долины — Дамас. Какие два слова мы заменили словом \"Дамас\"?",
                "answer": "Столица Siri./Комментарий: В Менло-Парк находится Стэнфордский исследовательский институт (SRI International), разработавший технологии, которые легли в основу помощника Siri. Дамаск — столица Сирии.",
                "state": 0
            },
            {
                "price": 900,
                "question": "на этом ресурсе одной из задач службы персонала называется \"Принятие решений о судьбе менеджеров, не справляющихся со своими задачами.\"",
                "answer": "Wikipedia https://ru.wikipedia.org/wiki/%D0%A3%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%D0%BE%D0%BC",
                "state": 0
            },
            {
                "price": 1000,
                "question": "Если температура воздуха в помещении вышего чем это значение, то  работу следует прекратить.",
                "answer": "33. Если температура воздуха выше всего на полградуса, то есть равна 28,5 градуса, можно работать 7 часов, 29 градусов - 6 часов и так далее. Если в помещении 32,5 градуса, рабочий день сокращается до 1 часа. Если температура равна 33 градусам, работу следует прекратить",
                "state": 0
            },
            {
                "price": 1000000,
                "question": "руководителям платят именно за эти 4 базовые функции",
                "answer": "планирование, организация, мотивация, контроль",
                "state": 0
            }
        ]
    },
    {
        "name": "SPb SQA Group",
        "questions": [
            {
                "price": 100,
                "question": "Что такое баг?",
                "answer": "Расхождение между ожидаемый результатам и действительным",
                "state": 0
            },
            {
                "price": 200,
                "question": "К кому идут тестировщик и разработчик если у них возник спор \"Это баг или фича\"?",
                "answer": "К аналитику или владельцу продукта",
                "state": 0
            },
            {
                "price": 300,
                "question": "Сколько уровеней в сертификации ISTQB?",
                "answer": "Три",
                "state": 0
            },
            {
                "price": 400,
                "question": "Какой фреймворк для тестирования на основе Selenium Web Driver разрабатывают ребята из Codeborn?",
                "answer": "Selenide",
                "state": 0
            },
            {
                "price": 500,
                "question": "Что означает абривиатура SDET?",
                "answer": "Software Development Engineer in Test",
                "state": 0
            },
            {
                "price": 600,
                "question": "В каком стандарте описаны характеристики качества ПО?",
                "answer": "ISO 25010 (пришёл на замену ISO 9126)",
                "state": 0
            },
            {
                "price": 700,
                "question": "Зачем проводят объёмное тестирование (Volume Testing)?",
                "answer": "Задачей объемного тестирования является получение оценки производительности при увеличении объемов данных в базе данных приложения",
                "state": 0
            },
            {
                "price": 800,
                "question": "Какой самым полулярный инструмент для ведения тест-кейсов на территории СНГ?",
                "answer": "Excel, Google таблицы",
                "state": 0
            },
            {
                "price": 900,
                "question": "Какой вопрос нужно задать первым при создании тестовой статегии?",
                "answer": "Что наиболее важное в продукте?",
                "state": 0
            },
            {
                "price": 1000,
                "question": "Почему люки круглой формы?",
                "answer": "Люки бывают любой формы, не обязательно круглой.",
                "state": 0
            },
            {
                "price": 1000000,
                "question": "Кто был официально первым тестировщиком?",
                "answer": "Jerry Wainberg",
                "state": 0
            }
        ]
    },
    {
        "name": "SPb Open Data",
        "questions": [
            {
                "price": 100,
                "question": "По какому адресу можно найти российский федеральный портал открытых данных?",
                "answer": "data.gov.ru",
                "state": 0
            },
            {
                "price": 200,
                "question": "Как называется организация, создавшая мировую экспертную сеть по открытыми данным?",
                "answer": "Open Data Institute",
                "state": 0
            },
            {
                "price": 300,
                "question": "Как называется самая популярная платформа управления открытыми данными?",
                "answer": "CKAN",
                "state": 0
            },
            {
                "price": 400,
                "question": "Кто стал знаковой фигурой в Open Data Movement в 2009 году?",
                "answer": "Сэр Тим Бернерс-Ли",
                "state": 0
            },
            {
                "price": 500,
                "question": "Порталы открытых данных каких двух стран занимают лидирующее положение с начала их открытия?",
                "answer": "Порталы США и Великобритании",
                "state": 0
            },
            {
                "price": 600,
                "question": "Какой формат представления данных ненавидят почти все, кто работает с открытыми данными? ",
                "answer": "PDF",
                "state": 0
            },
            {
                "price": 700,
                "question": "Какой формат представления данных является самым технически продвинутым в соответствии с моделью открытости данных?",
                "answer": "RDF",
                "state": 0
            },
            {
                "price": 800,
                "question": "Какое российское министерство разработало Концепцию открытых данных?",
                "answer": "Минэкономразвития РФ",
                "state": 0
            },
            {
                "price": 900,
                "question": "Какой формат данных известный активист открытых данных Фридрих Линденберг назвал \"автоматом Калашникова\"?",
                "answer": "CSV",
                "state": 0
            },
            {
                "price": 1000,
                "question": "В какой организации были разработаны (и разрабатываются) основные спецификации на открытые данные?",
                "answer": "W3C",
                "state": 0
            },
            {
                "price": 1000000,
                "question": "Когда откроют все данные?",
                "answer": "На данный вопрос нет ответа",
                "state": 0
            }
        ]
    },
    {
        "name": "Embedded Systems",
        "questions": [
            {
                "price": 100,
                "question": "Закон Ома",
                "answer": "I=U/R",
                "state": 0
            },
            {
                "price": 200,
                "question": "В чем измеряется индукция, а в чем индуктивность. (Единицы СИ)",
                "answer": "Тесла (Тл), Генри (Гн)",
                "state": 0
            },
            {
                "price": 300,
                "question": "Сколько диодов используется в диодном мосте",
                "answer": "4",
                "state": 0
            },
            {
                "price": 400,
                "question": "Расшифруйте аббревиатуру MISRA",
                "answer": "Motor Industry Software Reliability Association",
                "state": 0
            },
            {
                "price": 500,
                "question": "положительная обратная связь используется в генераторах или усилителях",
                "answer": "генераторах",
                "state": 0
            },
            {
                "price": 600,
                "question": "Примерное количество транзисторов в известном контроллере Intel 8051",
                "answer": "60 000",
                "state": 0
            },
            {
                "price": 700,
                "question": "Максимальный размер Flash памяти в микроконтроллерах AtMega",
                "answer": "256 KB",
                "state": 0
            },
            {
                "price": 800,
                "question": "Кто купил mentor graphics в 2016 году",
                "answer": "Siemens",
                "state": 0
            },
            {
                "price": 900,
                "question": "Кто купил ARM в 2016 году",
                "answer": "SoftBank",
                "state": 0
            },
            {
                "price": 1000,
                "question": "Изменением какого параметра обеспечивается стабилизация выходного напряжения в резонансных преобразователях",
                "answer": "изменение частоты коммутации",
                "state": 0
            },
            {
                "price": 1000000,
                "question": "При условии, что задан один источник тактирования. Какие проблемы с временными задержками нельзя решить, уменьшив тактовую частоту?",
                "answer": "невыполнение ограничений по времени удержания (оно же hold time или hold slack слэк, слак)",
                "state": 0
            }
        ]
    },
    {
        "name": "SPb R user group",
        "questions": [
            {
                "price": 100,
                "question": "Какой из этих языков программирования используется в основном для анализа данных и статистического моделирования? C, F, R, T",
                "answer": "R",
                "state": 0
            },
            {
                "price": 200,
                "question": "Язык R компилируемый или интерпретируемый?",
                "answer": "Интерпретируемый",
                "state": 0
            },
            {
                "price": 300,
                "question": "В языке R для векторов и списков индекс первого элемента -- это ...?",
                "answer": "Единица (не ноль!)",
                "state": 0
            },
            {
                "price": 400,
                "question": "Какого из операторов присваивания нет в языке R? Знак равенства, стрелка вверх, стрелка влево, стрелка вправо.",
                "answer": "Стрелка вверх",
                "state": 0
            },
            {
                "price": 500,
                "question": "Как называется самая популярная IDE для языка R?",
                "answer": "Rstudio",
                "state": 0
            },
            {
                "price": 600,
                "question": "Под какой свободной лицензией распространяется язык R?",
                "answer": "GNU GPL v2 (достаточно назвать GPL2)",
                "state": 0
            },
            {
                "price": 700,
                "question": "Как называются модули-расширения для языка R, доступные из центрального репозитория или гитхаба?",
                "answer": "Пакеты (не библиотеки!)",
                "state": 0
            },
            {
                "price": 800,
                "question": "Что делает в языке R функция lm?",
                "answer": "Считает линейную регрессию",
                "state": 0
            },
            {
                "price": 900,
                "question": "Каков результат вызова функции length(\"ITGM9\")?",
                "answer": "1",
                "state": 0
            },
            {
                "price": 1000,
                "question": "Если переменная l -- это непустой список, то в чём разница между вызовами l[1] и l[[1]]?",
                "answer": "l[1] -- это подсписок из одного элемента, а l[[1]] -- собственно первый элемент.  ",
                "state": 0
            },
            {
                "price": 1000000,
                "question": "Название языка R имеет двоякое происхождение. С одной стороны, это первая буква имён создателей -- Росса Ихаки и Роберта Джентльмена. В то же время это отсылка к другому языку программирования, основная область применения которого, как и у R, -- статистический анализ данных. Как называется этот язык-прародитель?",
                "answer": "S",
                "state": 0
            }
        ]
    }
];


/***/ },

/***/ "./src/app/home/home.component.css":
/***/ function(module, exports, __webpack_require__) {


        var result = __webpack_require__("./node_modules/css-loader/index.js!./src/app/home/home.component.css");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ },

/***/ "./src/app/home/home.component.html":
/***/ function(module, exports) {

module.exports = "<div class=\"newGame\">\n  <h1>Своя игра</h1>\n  <div *ngIf=\"!users || users.length < 6\">\n    <h4>Новый игрок</h4>\n    <form (ngSubmit)=\"submitState(newUser)\" autocomplete=\"off\">\n      <input\n        [value]=\"newUser\"\n        (input)=\"newUser = $event.target.value\"\n        placeholder=\"Имя игрока\"\n        autofocus>\n      <button md-raised-button color=\"primary\">Добавить</button>\n    </form>\n  </div>\n  <div>\n    <h3>Список игроков</h3>\n    <ul *ngIf=\"users && users.length > 0\">\n      <li *ngFor=\"let user of users; let i = index\">{{user}} <a href=\"#\" (click)=\"remove($event, i)\">X</a></li>\n    </ul>\n    <button *ngIf=\"users && users.length > 1\" (click)=\"startGame()\">Начать игру</button>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/home/home.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var angular_2_local_storage_1 = __webpack_require__("./node_modules/angular-2-local-storage/dist/angular-2-local-storage.js");
var app_service_1 = __webpack_require__("./src/app/app.service.ts");
var HomeComponent = (function () {
    function HomeComponent(appState, storage, router) {
        this.appState = appState;
        this.storage = storage;
        this.router = router;
        this.users = [];
        this.newUser = '';
        var users = this.storage.get('users');
        this.users = (users && users.users) ? users.users : [];
    }
    HomeComponent.prototype.startGame = function () {
        this.router.navigate(['game']);
    };
    HomeComponent.prototype.remove = function (event, index) {
        event.preventDefault();
        this.users.splice(index, 1);
        this.storage.set('users', { users: this.users });
    };
    HomeComponent.prototype.submitState = function (value) {
        if (this.users.indexOf(value) == -1) {
            this.users.push(value);
        }
        this.storage.set('users', { users: this.users });
        this.newUser = '';
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'home',
            styles: [__webpack_require__("./src/app/home/home.component.css")],
            template: __webpack_require__("./src/app/home/home.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof app_service_1.AppState !== 'undefined' && app_service_1.AppState) === 'function' && _a) || Object, (typeof (_b = typeof angular_2_local_storage_1.LocalStorageService !== 'undefined' && angular_2_local_storage_1.LocalStorageService) === 'function' && _b) || Object, (typeof (_c = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _c) || Object])
    ], HomeComponent);
    return HomeComponent;
    var _a, _b, _c;
}());
exports.HomeComponent = HomeComponent;


/***/ },

/***/ "./src/app/home/index.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__("./src/app/home/home.component.ts"));


/***/ },

/***/ "./src/app/index.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
// App
__export(__webpack_require__("./src/app/app.module.ts"));


/***/ },

/***/ "./src/app/no-content/index.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__("./src/app/no-content/no-content.component.ts"));


/***/ },

/***/ "./src/app/no-content/no-content.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var NoContentComponent = (function () {
    function NoContentComponent() {
    }
    NoContentComponent = __decorate([
        core_1.Component({
            selector: 'no-content',
            template: "\n    <div>\n      <h1>404: page missing</h1>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], NoContentComponent);
    return NoContentComponent;
}());
exports.NoContentComponent = NoContentComponent;


/***/ },

/***/ "./src/main.browser.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
/*
 * Angular bootstraping
 */
var platform_browser_dynamic_1 = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/index.js");
var environment_1 = __webpack_require__("./src/app/environment.ts");
var hmr_1 = __webpack_require__("./node_modules/@angularclass/hmr/dist/index.js");
/*
 * App Module
 * our top level module that holds all of our components
 */
var app_1 = __webpack_require__("./src/app/index.ts");
/*
 * Bootstrap our Angular app with a top level NgModule
 */
function main() {
    return platform_browser_dynamic_1.platformBrowserDynamic()
        .bootstrapModule(app_1.AppModule).then(function(MODULE_REF) {
  if (false) {
    module["hot"]["accept"]();
    
    if (MODULE_REF.instance["hmrOnInit"]) {
      module["hot"]["data"] && MODULE_REF.instance["hmrOnInit"](module["hot"]["data"]);
    }
    if (MODULE_REF.instance["hmrOnStatus"]) {
      module["hot"]["apply"](function(status) {
        MODULE_REF.instance["hmrOnStatus"](status);
      });
    }
    if (MODULE_REF.instance["hmrOnCheck"]) {
      module["hot"]["check"](function(err, outdatedModules) {
        MODULE_REF.instance["hmrOnCheck"](err, outdatedModules);
      });
    }
    if (MODULE_REF.instance["hmrOnDecline"]) {
      module["hot"]["decline"](function(dependencies) {
        MODULE_REF.instance["hmrOnDecline"](dependencies);
      });
    }
    module["hot"]["dispose"](function(store) {
      MODULE_REF.instance["hmrOnDestroy"] && MODULE_REF.instance["hmrOnDestroy"](store);
      MODULE_REF.destroy();
      MODULE_REF.instance["hmrAfterDestroy"] && MODULE_REF.instance["hmrAfterDestroy"](store);
    });
  }
  return MODULE_REF;
})
        .then(environment_1.decorateModuleRef)
        .catch(function (err) { return console.error(err); });
}
exports.main = main;
// needed for hmr
// in prod this is replace for document ready
hmr_1.bootloader(main);


/***/ }

},["./src/main.browser.ts"]);
//# sourceMappingURL=main.map