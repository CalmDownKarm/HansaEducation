(function(teads) { var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
if (!Function.prototype.bind) {
    Function.prototype.bind = function (context) {
        if (typeof this !== 'function') {
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }
        var args = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () { }, fBound = function () {
            return fToBind.apply(this instanceof fNOP ? this : context, args.concat(Array.prototype.slice.call(arguments)));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var Utils;
    (function (Utils) {
        var objectToString = Object.prototype.toString;
        var functionToString = Function.prototype.toString;
        var reHostCtor = /^\[object .+?Constructor\]$/;
        var reNative = RegExp('^' +
            String(toString)
                .replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
                .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
        function isNative(value) {
            var type = typeof value;
            return type === 'function'
                ? reNative.test(functionToString.call(value))
                : !!(value && type === 'object' && reHostCtor.test(objectToString.call(value)));
        }
        Utils.isNative = isNative;
    })(Utils = teads.Utils || (teads.Utils = {}));
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var date;
    (function (date) {
        var isNative = teads.Utils.isNative;
        var Date = window.Date;
        var getTime = Date.prototype.getTime;
        date.now = isNative(Date.now)
            ? Date.now
            : isNative(getTime)
                ? function () { return getTime.call(new Date()); }
                : function () { return +new Date(); };
        if (!Date.now) {
            Date.now = date.now;
        }
    })(date = teads.date || (teads.date = {}));
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var Option = (function () {
        function Option(value) {
            this.value = value;
            this._isEmpty = value === null || value === undefined;
        }
        Option.of = function (value) {
            return (value === null || value === undefined) ? teads.None : Some(value);
        };
        Option.ofNested = function (obj, path) {
            return this.of(path.split('.').reduce(function (curr, acc) { return (curr === null || curr === undefined) ? curr : curr[acc]; }, obj));
        };
        Option.empty = function () {
            return teads.None;
        };
        Option.prototype.isEmpty = function () {
            return this._isEmpty;
        };
        Option.prototype.nonEmpty = function () {
            return !this._isEmpty;
        };
        Option.prototype.getOrElse = function (or) {
            return (!this._isEmpty) ? this.value : or();
        };
        Option.prototype.orElse = function (or) {
            return (!this._isEmpty) ? this : or();
        };
        Option.prototype.map = function (func) {
            return (this._isEmpty) ? teads.None : Option.of(func(this.value));
        };
        Option.prototype.flatMap = function (func) {
            return (this._isEmpty) ? teads.None : func(this.value);
        };
        Option.prototype.filter = function (p) {
            return (this._isEmpty || !p(this.value)) ? teads.None : this;
        };
        Option.prototype.existsIf = function (p) {
            return !this._isEmpty && p(this.value);
        };
        Option.prototype.forEach = function (func) {
            if (!this._isEmpty) {
                func(this.value);
            }
        };
        Option.prototype.match = function (matcher) {
            return (this._isEmpty) ? matcher.none() : matcher.some(this.value);
        };
        return Option;
    }());
    teads.Option = Option;
    function Some(value) {
        return new Option(value);
    }
    teads.Some = Some;
    teads.None = new Option(null);
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var Try = (function () {
        function Try(_success, _failure, _isSuccess) {
            this._isSuccess = _isSuccess;
            _isSuccess
                ? this._successValue = _success
                : this._failureValue = _failure;
        }
        Try.of = function (func) {
            try {
                return Success(func());
            }
            catch (e) {
                return Failure(e);
            }
        };
        Try.prototype.isSuccess = function () {
            return this._isSuccess;
        };
        Try.prototype.isFailure = function () {
            return !this._isSuccess;
        };
        Try.prototype.getOrElse = function (func) {
            return (this._isSuccess) ? this._successValue : func();
        };
        Try.prototype.orElse = function (func) {
            return (this._isSuccess) ? this : func();
        };
        Try.prototype.filter = function (p) {
            if (!this._isSuccess) {
                return this;
            }
            try {
                return (p(this._successValue))
                    ? this
                    : Failure(new Error("Predicate does not hold for " + this._successValue));
            }
            catch (e) {
                return Failure(e);
            }
        };
        Try.prototype.flatMap = function (f) {
            if (!this._isSuccess) {
                return this;
            }
            try {
                return f(this._successValue);
            }
            catch (e) {
                return Failure(e);
            }
        };
        Try.prototype.map = function (f) {
            var _this = this;
            return (this._isSuccess)
                ? Try.of(function () { return f(_this._successValue); })
                : this;
        };
        Try.prototype.forEach = function (func) {
            if (this._isSuccess) {
                func(this._successValue);
            }
        };
        Try.prototype.recover = function (f) {
            var _this = this;
            return (this._isSuccess) ? this : Try.of(function () { return f(_this._failureValue); });
        };
        Try.prototype.recoverWith = function (f) {
            try {
                return (this._isSuccess) ? this : f(this._failureValue);
            }
            catch (e) {
                return Failure(e);
            }
        };
        Try.prototype.match = function (matcher) {
            return (this._isSuccess) ? matcher.success(this._successValue) : matcher.failure(this._failureValue);
        };
        Try.prototype.toOption = function () {
            return (this._isSuccess) ? teads.Option.of(this._successValue) : teads.None;
        };
        return Try;
    }());
    teads.Try = Try;
    function Success(value) {
        return new Try(value, null, true);
    }
    teads.Success = Success;
    function Failure(e) {
        return new Try(null, e, false);
    }
    teads.Failure = Failure;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var Cookie = (function () {
        function Cookie() {
        }
        Cookie.get = function (name) {
            return Cookie.getDocumentCookie().map(function (cookie) {
                return decodeURIComponent(cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, '\\$&') + "\\s*\\=\\s*([^;]*).*$)|^.*$"), '$1')) || null;
            }).toOption();
        };
        Cookie.set = function (name, value, expiry) {
            var expiryStr = '; expires=';
            var oneYearFromNow = new Date(teads.date.now() + 365 * 24 * 60 * 60 * 1000);
            if (expiry && expiry.toUTCString && expiry < oneYearFromNow) {
                expiryStr += expiry.toUTCString();
            }
            else {
                expiryStr += oneYearFromNow.toUTCString();
            }
            Cookie.setDocumentCookie(encodeURIComponent(name) + '=' + encodeURIComponent(value) + expiryStr + '; path=/');
        };
        Cookie.getDocumentCookie = function () {
            return teads.Try.of(function () { return document.cookie; });
        };
        Cookie.setDocumentCookie = function (newValue) {
            try {
                document.cookie = newValue;
            }
            catch (err) { }
        };
        return Cookie;
    }());
    teads.Cookie = Cookie;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var ArrayHelper = (function () {
        function ArrayHelper() {
        }
        ArrayHelper.find = function (arr, predicate, context) {
            if (arr === null) {
                throw new TypeError('array is null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(arr);
            var length = list.length >>> 0;
            var value;
            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(context, value, i, list)) {
                    return value;
                }
            }
        };
        ArrayHelper.forEach = function (arr, callback, context) {
            if (arr === null) {
                throw new TypeError('array is null or undefined');
            }
            if (typeof callback !== 'function') {
                throw new TypeError('callback must be a function');
            }
            var list = Object(arr);
            var length = list.length >>> 0;
            var key = 0;
            var value;
            while (key < length) {
                if (key in list) {
                    value = list[key];
                    callback.call(context, value, key, list);
                }
                key++;
            }
        };
        ArrayHelper.filter = function (arr, callback, context) {
            if (arr === null) {
                throw new TypeError('array is null or undefined');
            }
            if (typeof callback !== 'function') {
                throw new TypeError('callback must be a function');
            }
            var list = Object(arr);
            var length = list.length >>> 0;
            if (length > list.length) {
                throw new TypeError('negative length');
            }
            var res = [];
            for (var i = 0; i < length; i++) {
                if (i in list) {
                    var val = list[i];
                    if (callback.call(context, val, i, list)) {
                        res.push(val);
                    }
                }
            }
            return res;
        };
        ArrayHelper.some = function (arr, callback, context) {
            if (arr === null) {
                throw new TypeError('array is null or undefined');
            }
            if (typeof callback !== 'function') {
                throw new TypeError('callback must be a function');
            }
            var list = Object(arr);
            var length = list.length >>> 0;
            if (length > list.length) {
                throw new TypeError('negative length');
            }
            for (var i = 0; i < length; i++) {
                if (i in list && callback.call(context, list[i], i, list)) {
                    return true;
                }
            }
            return false;
        };
        ArrayHelper.indexOf = function (arr, searchElement, fromIndex) {
            if (arr === null) {
                throw new TypeError('array is null or undefined');
            }
            var list = Object(arr);
            var length = list.length >>> 0;
            if (length === 0) {
                return -1;
            }
            var start = +fromIndex || 0;
            if (Math.abs(start) === Infinity) {
                start = 0;
            }
            if (start >= length) {
                return -1;
            }
            var key = Math.max(start >= 0 ? start : length - Math.abs(start), 0);
            try {
                while (key < length) {
                    if (key in list && list[key] === searchElement) {
                        return key;
                    }
                    key++;
                }
            }
            catch (e) {
            }
            return -1;
        };
        ArrayHelper.includes = function (arr, searchElement) {
            return ArrayHelper.indexOf(arr, searchElement) > -1;
        };
        ArrayHelper.fromNodeList = function (nodeList) {
            return Array.prototype.slice.call(nodeList);
        };
        ArrayHelper.map = function (arr, callback, context) {
            if (arr === null) {
                throw new TypeError('array is null or undefined');
            }
            if (typeof callback !== 'function') {
                throw new TypeError('callback must be a function');
            }
            var list = Object(arr);
            var length = list.length >>> 0;
            var res = new Array(length);
            var key = 0;
            var value, mappedValue;
            while (key < length) {
                if (key in list) {
                    value = list[key];
                    mappedValue = callback.call(context, value, key, list);
                    res[key] = mappedValue;
                }
                key++;
            }
            return res;
        };
        ArrayHelper.unique = function (arr) {
            if (arr === null) {
                throw new TypeError('array is null or undefined');
            }
            var found = {};
            return this.filter(arr, function (val) {
                return !(found[val] = ++found[val] || 0);
            });
        };
        ArrayHelper.reduce = function (arr, callback, initialValue) {
            if (arr === null) {
                throw new TypeError('array is null or undefined');
            }
            if (typeof callback !== 'function') {
                throw new TypeError('callback must be a function');
            }
            var length = arr.length >>> 0;
            if (length === 0 && initialValue === undefined) {
                throw new TypeError('reduce of empty array with no initial value');
            }
            var i = 0;
            var result;
            if (initialValue !== undefined) {
                result = initialValue;
            }
            else {
                do {
                    if (i in arr) {
                        result = arr[i++];
                        break;
                    }
                    if (++i >= length) {
                        throw new TypeError('reduce of empty array with no initial value');
                    }
                } while (true);
            }
            for (; i < length; i++) {
                if (i in arr) {
                    result = callback(result, arr[i], i, arr);
                }
            }
            return result;
        };
        ArrayHelper.removeElement = function (arr, elementToRemove) {
            if (ArrayHelper.indexOf(arr, elementToRemove) > -1) {
                arr.splice(ArrayHelper.indexOf(arr, elementToRemove), 1);
            }
        };
        return ArrayHelper;
    }());
    teads.ArrayHelper = ArrayHelper;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var JSON = (function () {
        function JSON() {
        }
        JSON.stringify = function (value, decycle) {
            if (decycle === void 0) { decycle = false; }
            var arrayToJson = Array.prototype.toJSON;
            delete Array.prototype.toJSON;
            var r = teads.JSON.jsonStringify(decycle ? teads.JSON.decycle(value) : value);
            if (arrayToJson) {
                Array.prototype.toJSON = arrayToJson;
            }
            return r;
        };
        JSON.parse = function (sJSON) {
            if (!window.JSON.parse) {
                return eval('(' + sJSON + ')');
            }
            return window.JSON.parse(sJSON);
        };
        JSON.decycle = function (object, replacer) {
            var objects = [];
            var paths = [];
            return (function derez(value, path) {
                var i;
                var nu;
                if (replacer !== undefined) {
                    value = replacer(value);
                }
                if (typeof value === 'object' && value !== null &&
                    !(value instanceof Boolean) &&
                    !(value instanceof Date) &&
                    !(value instanceof Number) &&
                    !(value instanceof RegExp) &&
                    !(value instanceof String)) {
                    i = objects.indexOf(value);
                    if (i >= 0) {
                        return { $ref: paths[i] };
                    }
                    objects.push(value);
                    paths.push(path);
                    if (Array.isArray(value)) {
                        nu = [];
                        value.forEach(function (element, i) {
                            nu[i] = derez(element, path + '[' + i + ']');
                        });
                    }
                    else {
                        nu = {};
                        Object.keys(value).forEach(function (name) {
                            nu[name] = derez(value[name], path + '[' + JSON.stringify(name) + ']');
                        });
                    }
                    return nu;
                }
                return value;
            }(object, '$'));
        };
        JSON.jsonStringify = function (value) {
            if (!window.JSON.stringify) {
                return teads.JSON.polyfillStringify(value);
            }
            return window.JSON.stringify(value);
        };
        JSON.polyfillStringify = function (value) {
            if (value === null) {
                return 'null';
            }
            else if (typeof value === 'number') {
                return isFinite(Number(value)) ? value.toString() : 'null';
            }
            else if (typeof value === 'boolean') {
                return value.toString();
            }
            else if (typeof value === 'object') {
                if (typeof value.toJSON === 'function') {
                    return teads.JSON.polyfillStringify(value.toJSON());
                }
                else if (Array.isArray(value)) {
                    var res = '[';
                    for (var i = 0; i < value.length; i++) {
                        res += (i ? ', ' : '') + teads.JSON.polyfillStringify(value[i]);
                    }
                    return res + ']';
                }
                else if (Object.prototype.toString.call(value) === '[object Object]') {
                    var tmp = [];
                    for (var k in value) {
                        if (value.hasOwnProperty(k)) {
                            tmp.push(teads.JSON.polyfillStringify(k) + ': ' + teads.JSON.polyfillStringify(value[k]));
                        }
                    }
                    return '{' + tmp.join(', ') + '}';
                }
            }
            return '"' + value.toString().replace(teads.JSON.escRE, teads.JSON.escFunc) + '"';
        };
        return JSON;
    }());
    JSON.escMap = { '"': '\\"', '\\': '\\\\', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t' };
    JSON.escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
    JSON.escFunc = function (m) { return teads.JSON.escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1); };
    teads.JSON = JSON;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    teads.START_TIME = teads.START_TIME || teads.date.now();
    teads.FULL_LOGS = teads.FULL_LOGS || [];
    var isIE = false;
    try {
        var ua = navigator.userAgent;
        isIE = /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i.test(ua)
            || /(?:ms|\()(ie)\s([\w\.]+)/i.test(ua)
            || /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i.test(ua);
    }
    catch (err) {
    }
    var shownLevels = [];
    var shownNamespaces = [];
    var showAllNamespaces = false;
    var teadsConsole;
    var MockConsole = (function () {
        function MockConsole() {
        }
        MockConsole.prototype.log = function () {
        };
        return MockConsole;
    }());
    if (window.console && console.log) {
        teadsConsole = window.console;
    }
    else {
        teadsConsole = new MockConsole;
    }
    function init() {
        teads.Cookie.get('teadsDebugLevel')
            .map(function (cookie) { return cookie.split(','); })
            .filter(function (levels) { return teads.ArrayHelper.indexOf(levels, 'all') >= 0; })
            .forEach(function () { return shownLevels = ['debug', 'info', 'warn', 'error']; });
        teads.Cookie.get('teadsDebugNamespace')
            .forEach(function (cookie) {
            shownNamespaces = cookie.split(',');
            showAllNamespaces = String(cookie).toLocaleLowerCase() === 'all';
        });
        if (shownLevels.length && !teads.Logger) {
            if (isIE) {
                teadsConsole.log('Teads Media Framework > Debug mode');
                teadsConsole.log('Package: web-formats v2.16.127');
            }
            else {
                teadsConsole.log('%cTeads Media Framework %c> Debug mode', 'color:#7ebde5;font-family:Helvetica,sans-serif;font-size:2em;', 'color:#aaa;font-family:Helvetica,sans-serif;font-size:2em;');
                teadsConsole.log('%cPackage: web-formats v2.16.127', 'color:#7ebde5;font-style:italic;');
            }
        }
    }
    init();
    var Logger = (function () {
        function Logger(namespace) {
            this.namespace = namespace;
            this.console = teadsConsole;
        }
        Logger.clear = function () {
            Logger.logs = [];
            teads.FULL_LOGS = [];
        };
        Logger.getFullLogs = function () {
            return teads.FULL_LOGS;
        };
        Logger.prototype.debug = function () {
            var objs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                objs[_i] = arguments[_i];
            }
            this._log('debug', objs);
        };
        Logger.prototype.info = function () {
            var objs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                objs[_i] = arguments[_i];
            }
            this._log('info', objs);
        };
        Logger.prototype.warn = function () {
            var objs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                objs[_i] = arguments[_i];
            }
            this._log('warn', objs);
        };
        Logger.prototype.error = function () {
            var objs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                objs[_i] = arguments[_i];
            }
            this._log('error', objs);
        };
        Logger.prototype.table = function (obj) {
            var columns = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                columns[_i - 1] = arguments[_i];
            }
            if (teadsConsole.table) {
                teadsConsole.table(obj, columns.length > 0 ? columns : null);
            }
        };
        Logger.prototype._log = function (level, args) {
            var _this = this;
            init();
            if (!args.length) {
                return;
            }
            var now = teads.date.now() - teads.START_TIME;
            var time = (now / 1000).toFixed(3) + 's';
            var msg = '';
            for (var i = 0; i < args.length; i++) {
                if (i > 0) {
                    msg += ' + ';
                }
                if (typeof args[i] === 'object') {
                    try {
                        msg += teads.JSON.stringify(args[i]);
                    }
                    catch (err) {
                        msg += args[i];
                    }
                }
                else {
                    msg += args[i];
                }
            }
            teads.FULL_LOGS.push({
                level: level,
                message: time + ' [' + this.namespace + '] ' + msg
            });
            if (teads.ArrayHelper.indexOf(shownLevels, level) < 0) {
                return;
            }
            if (!showAllNamespaces && shownNamespaces.length) {
                var show = teads.ArrayHelper.some(shownNamespaces, function (namespace) {
                    return (_this.namespace.indexOf(namespace) === 0);
                });
                if (!show) {
                    return;
                }
            }
            Logger.logs.push({
                level: level,
                message: time + ' [' + this.namespace + '] ' + args.join(' ')
            });
            if (isIE) {
                args = ['Teads ' + time + ' [' + this.namespace + '] ' + args.join(' ')];
            }
            else {
                args.unshift('Teads %c' + time + ' ' + this.namespace, 'color:#7ebde5;');
            }
            var func = teadsConsole[level] || teadsConsole.log;
            try {
                func.apply(teadsConsole, args);
            }
            catch (e) {
                Function.prototype.apply.apply(func, [teadsConsole, args]);
            }
        };
        return Logger;
    }());
    Logger.logs = [];
    teads.Logger = Logger;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var Timing = (function () {
        function Timing() {
        }
        Timing.init = function () {
            try {
                Timing.performance = window.top.performance || window.top.webkitPerformance || window.top.msPerformance || window.top.mozPerformance;
            }
            catch (e) {
            }
        };
        Timing.mark = function (markName) {
            if (!markName || typeof markName !== 'string') {
                return null;
            }
            if (Timing.performance && Timing.performance.mark) {
                Timing.performance.mark(markName);
            }
            else {
                var perfomanceEntry = {
                    name: markName,
                    entryType: 'mark',
                    startTime: Timing.now(),
                    duration: 0
                };
                Timing.performanceEntries[markName] = perfomanceEntry;
            }
        };
        Timing.measure = function (name, startMark, endMark) {
            if (!name || typeof name !== 'string' || !startMark || typeof startMark !== 'string' || !endMark || typeof endMark !== 'string') {
                return null;
            }
            try {
                if (Timing.performance && Timing.performance.measure) {
                    Timing.performance.measure(name, startMark, endMark);
                }
                else {
                    if (Timing.performanceEntries[startMark] && Timing.performanceEntries[endMark]) {
                        var perfomanceEntry = {
                            name: name,
                            entryType: 'measure',
                            startTime: Timing.performanceEntries[startMark].startTime,
                            duration: Timing.performanceEntries[endMark].startTime - Timing.performanceEntries[startMark].startTime
                        };
                        Timing.performanceEntries[name] = perfomanceEntry;
                    }
                }
                return Timing.getLastEntryByName(name);
            }
            catch (err) {
                Timing.logger.warn(err);
                return null;
            }
        };
        Timing.getLastEntryByName = function (entryName) {
            try {
                if (Timing.performance && Timing.performance.getEntriesByName) {
                    var entries = Timing.performance.getEntriesByName(entryName);
                    return entries[entries.length - 1];
                }
                else if (Timing.performanceEntries[entryName]) {
                    return Timing.performanceEntries[entryName];
                }
                else {
                    return null;
                }
            }
            catch (err) {
                Timing.logger.warn(err);
                return null;
            }
        };
        Timing.getTimingByRegex = function (timingRegex) {
            var entryFound = null;
            if (Timing.performance && Timing.performance.getEntries) {
                var entries = Timing.performance.getEntriesByType('resource');
                for (var entry in entries) {
                    if (entries.hasOwnProperty(entry) && timingRegex.test(entries[entry].name)) {
                        entryFound = entries[entry];
                        break;
                    }
                }
            }
            return entryFound;
        };
        Timing.getResourceCount = function () {
            if (Timing.performance && Timing.performance.getEntries) {
                return Timing.performance.getEntriesByType('resource').length;
            }
        };
        Timing.now = function () {
            return Timing && Timing.performance && Timing.performance.now
                ? Timing.performance.now()
                : teads.date.now();
        };
        return Timing;
    }());
    Timing.logger = new teads.Logger('helper.Timing');
    Timing.performanceEntries = {};
    teads.Timing = Timing;
    Timing.init();
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var Utils;
    (function (Utils) {
        var objectToString = Object.prototype.toString;
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        function seconds(offset) {
            if (!offset) {
                return NaN;
            }
            var value = offset.split('.');
            var parts = value[0].split(':');
            var seconds = Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
            if (value.length === 2) {
                seconds = Number(seconds + '.' + value[1]);
            }
            return seconds;
        }
        Utils.seconds = seconds;
        function offset(seconds) {
            if (seconds === void 0) { seconds = 0; }
            var hours = seconds ? Math.floor(seconds / 3600) : 0;
            seconds = seconds - (hours * 3600);
            var minutes = seconds ? Math.floor(seconds / 60) : 0;
            seconds = seconds - (minutes * 60);
            var ms = (seconds % 1).toFixed(3).substr(1);
            seconds = Math.floor(seconds);
            return teads.StringHelper.pad(hours) + ':' + teads.StringHelper.pad(minutes) + ':' + teads.StringHelper.pad(seconds) + ms;
        }
        Utils.offset = offset;
        function getAudioContext() {
            return window.AudioContext || window.webkitAudioContext;
        }
        Utils.getAudioContext = getAudioContext;
        function extend() {
            var objects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                objects[_i] = arguments[_i];
            }
            var extended = {};
            for (var i = 0, obj = void 0; i < objects.length; i++) {
                obj = objects[i];
                for (var prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        if (objectToString.call(obj[prop]) === '[object Object]') {
                            extended[prop] = extend(extended[prop], obj[prop]);
                        }
                        else if (obj[prop] !== undefined) {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            }
            return extended;
        }
        Utils.extend = extend;
        function throttle(callback, threshold, context) {
            var suppress = false;
            threshold = threshold || 250;
            context = context || this;
            return function () {
                if (!suppress) {
                    callback.apply(context, arguments);
                    window.setTimeout(function () {
                        suppress = false;
                    }, threshold);
                    suppress = true;
                }
            };
        }
        Utils.throttle = throttle;
        function safeUrl(url) {
            var link = document.createElement('a');
            link.href = url;
            if (window.swInstalled && /(teads|ebu?z)/.test(link.hostname)) {
                return '/' + btoa(url).replace(/=/g, '_');
            }
            return url;
        }
        Utils.safeUrl = safeUrl;
        function getProtocol() {
            return location && location.protocol && location.protocol.indexOf('http:') === 0 ? location.protocol : 'https:';
        }
        Utils.getProtocol = getProtocol;
        function containsKeys(objBase, objTested) {
            var isValidValue = false;
            if (!objTested) {
                return false;
            }
            for (var prop in objBase) {
                if (hasOwnProperty.call(objBase, prop)) {
                    if (typeof objTested[prop] !== undefined) {
                        isValidValue = true;
                    }
                    else {
                        return false;
                    }
                }
            }
            return isValidValue;
        }
        Utils.containsKeys = containsKeys;
        function isBoolean(value) {
            return typeof value === 'boolean';
        }
        Utils.isBoolean = isBoolean;
        function isNumber(value) {
            return typeof value === 'number';
        }
        Utils.isNumber = isNumber;
        function isArray(value) {
            return value instanceof Array;
        }
        Utils.isArray = isArray;
        function isString(value) {
            return typeof value === 'string';
        }
        Utils.isString = isString;
        function isUndefined(value) {
            return typeof value === 'undefined';
        }
        Utils.isUndefined = isUndefined;
        function isObject(value) {
            var type = typeof value;
            return !!value && type === 'object';
        }
        Utils.isObject = isObject;
        function isFunction(value) {
            var type = typeof value;
            return !!value && type === 'function' && objectToString.call(value) === '[object Function]';
        }
        Utils.isFunction = isFunction;
        function isStudioCreative() {
            return !!(window.teads
                && window.teads.api
                && window.teads.api.getStudioData
                && isObject(window.teads.api.getStudioData()));
        }
        Utils.isStudioCreative = isStudioCreative;
    })(Utils = teads.Utils || (teads.Utils = {}));
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var Ua = (function () {
        function Ua() {
        }
        return Ua;
    }());
    Ua.MODEL = 'model';
    Ua.NAME = 'name';
    Ua.TYPE = 'type';
    Ua.VENDOR = 'vendor';
    Ua.VERSION = 'version';
    Ua.CONSOLE = 'console';
    Ua.MOBILE = 'mobile';
    Ua.TABLET = 'tablet';
    Ua.SMARTTV = 'smarttv';
    Ua.WEARABLE = 'wearable';
    Ua.DESKTOP = 'desktop';
    Ua.util = {
        extend: function (regexes, extensions) {
            var margedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    margedRegexes[i] = extensions[i].concat(regexes[i]);
                }
                else {
                    margedRegexes[i] = regexes[i];
                }
            }
            return margedRegexes;
        },
        has: function (str1, str2) {
            if (typeof str1 === 'string') {
                return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
            }
            else {
                return false;
            }
        },
        lowerize: function (str) {
            return str.toLowerCase();
        },
        trim: function (str) {
            return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    };
    Ua.mapper = {
        rgx: function () {
            var result, i = 0, j, k, p, q, matches, match, args = arguments;
            while (i < args.length && !matches) {
                var regex = args[i], props = args[i + 1];
                if (typeof result === 'undefined') {
                    result = {};
                    for (p in props) {
                        q = props[p];
                        if (typeof q === 'object') {
                            result[q[0]] = undefined;
                        }
                        else {
                            result[q] = undefined;
                        }
                    }
                }
                j = k = 0;
                while (j < regex.length && !matches) {
                    matches = regex[j++].exec(teads.Context.getUA());
                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            if (typeof q === 'object' && q.length > 0) {
                                if (q.length === 2) {
                                    if (typeof q[1] === 'function') {
                                        result[q[0]] = q[1].call(this, match);
                                    }
                                    else {
                                        result[q[0]] = q[1];
                                    }
                                }
                                else if (q.length === 3) {
                                    if (typeof q[1] === 'function' && !(q[1].exec && q[1].test)) {
                                        result[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    }
                                    else {
                                        result[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                }
                                else if (q.length === 4) {
                                    result[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            }
                            else {
                                result[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
            return result;
        },
        str: function (str, map) {
            for (var i in map) {
                if (typeof map[i] === 'object' && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (Ua.util.has(map[i][j], str)) {
                            return (i === '?') ? undefined : i;
                        }
                    }
                }
                else if (Ua.util.has(map[i], str)) {
                    return (i === '?') ? undefined : i;
                }
            }
            return str;
        }
    };
    Ua.maps = {
        browser: {
            oldsafari: {
                version: {
                    '1.0': '/8',
                    '1.2': '/1',
                    '1.3': '/3',
                    '2.0': '/412',
                    '2.0.2': '/416',
                    '2.0.3': '/417',
                    '2.0.4': '/419',
                    '?': '/'
                }
            }
        },
        device: {
            amazon: {
                model: {
                    'Fire Phone': ['SD', 'KF']
                }
            },
            sprint: {
                model: {
                    'Evo Shift 4G': '7373KT'
                },
                vendor: {
                    'HTC': 'APA',
                    'Sprint': 'Sprint'
                }
            }
        },
        os: {
            windows: {
                version: {
                    'ME': '4.90',
                    'NT 3.11': 'NT3.51',
                    'NT 4.0': 'NT4.0',
                    '2000': 'NT 5.0',
                    'XP': ['NT 5.1', 'NT 5.2'],
                    'Vista': 'NT 6.0',
                    '7': 'NT 6.1',
                    '8': 'NT 6.2',
                    '8.1': 'NT 6.3',
                    '10': ['NT 6.4', 'NT 10.0'],
                    'RT': 'ARM'
                }
            }
        }
    };
    Ua.regexes = {
        browser: [[
                /(opera\smini)\/([\w\.-]+)/i,
                /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,
                /(opera).+version\/([\w\.]+)/i,
                /(opera)[\/\s]+([\w\.]+)/i
            ], [Ua.NAME, Ua.VERSION], [
                /(opios)[\/\s]+([\w\.]+)/i
            ], [[Ua.NAME, 'Opera Mini'], Ua.VERSION], [
                /\s(opr)\/([\w\.]+)/i
            ], [[Ua.NAME, 'Opera'], Ua.VERSION], [
                /(kindle)\/([\w\.]+)/i,
                /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
                /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
                /(?:ms|\()(ie)\s([\w\.]+)/i,
                /(rekonq)\/([\w\.]+)*/i,
                /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i
            ], [Ua.NAME, Ua.VERSION], [
                /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i
            ], [[Ua.NAME, 'IE'], Ua.VERSION], [
                /(edge)\/((\d+)?[\w\.]+)/i
            ], [Ua.NAME, Ua.VERSION], [
                /(yabrowser)\/([\w\.]+)/i
            ], [[Ua.NAME, 'Yandex'], Ua.VERSION], [
                /(comodo_dragon)\/([\w\.]+)/i
            ], [[Ua.NAME, /_/g, ' '], Ua.VERSION], [
                /(micromessenger)\/([\w\.]+)/i
            ], [[Ua.NAME, 'WeChat'], Ua.VERSION], [
                /xiaomi\/miuibrowser\/([\w\.]+)/i,
            ], [Ua.VERSION, [Ua.NAME, 'MIUI Browser']], [
                /\swv\).+(chrome)\/([\w\.]+)/i
            ], [[Ua.NAME, /(.+)/, '$1 WebView'], Ua.VERSION], [
                /android.+samsungbrowser\/([\w\.]+)/i,
                /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i
            ], [Ua.VERSION, [Ua.NAME, 'Android Browser']], [
                /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,
                /(qqbrowser)[\/\s]?([\w\.]+)/i
            ], [Ua.NAME, Ua.VERSION], [
                /(dolfin)\/([\w\.]+)/i
            ], [[Ua.NAME, 'Dolphin'], Ua.VERSION], [
                /((?:android.+)crmo|crios)\/([\w\.]+)/i
            ], [[Ua.NAME, 'Chrome'], Ua.VERSION], [
                /;fbav\/([\w\.]+);/i
            ], [Ua.VERSION, [Ua.NAME, 'Facebook']], [
                /fxios\/([\w\.-]+)/i
            ], [Ua.VERSION, [Ua.NAME, 'Firefox']], [
                /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i
            ], [Ua.VERSION, [Ua.NAME, 'Mobile Safari']], [
                /version\/([\w\.]+).+?(mobile\s?safari|safari)/i
            ], [Ua.VERSION, Ua.NAME], [
                /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i
            ], [Ua.NAME, [Ua.VERSION, Ua.mapper.str, Ua.maps.browser.oldsafari.version]], [
                /(konqueror)\/([\w\.]+)/i,
                /(webkit|khtml)\/([\w\.]+)/i
            ], [Ua.NAME, Ua.VERSION], [
                /(navigator|netscape)\/([\w\.-]+)/i
            ], [[Ua.NAME, 'Netscape'], Ua.VERSION], [
                /(swiftfox)/i,
                /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
                /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,
                /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf)[\/\s]?([\w\.]+)/i,
                /(links)\s\(([\w\.]+)/i,
                /(gobrowser)\/?([\w\.]+)*/i,
                /(ice\s?browser)\/v?([\w\._]+)/i,
                /(mosaic)[\/\s]([\w\.]+)/i
            ], [Ua.NAME, Ua.VERSION]
        ],
        device: [[
                /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i
            ], [Ua.MODEL, Ua.VENDOR, [Ua.TYPE, Ua.TABLET]], [
                /applecoremedia\/[\w\.]+ \((ipad)/
            ], [Ua.MODEL, [Ua.VENDOR, 'Apple'], [Ua.TYPE, Ua.TABLET]], [
                /(apple\s{0,1}tv)/i
            ], [[Ua.MODEL, 'Apple TV'], [Ua.VENDOR, 'Apple']], [
                /(archos)\s(gamepad2?)/i,
                /(hp).+(touchpad)/i,
                /(hp).+(tablet)/i,
                /(kindle)\/([\w\.]+)/i,
                /\s(nook)[\w\s]+build\/(\w+)/i,
                /(dell)\s(strea[kpr\s\d]*[\dko])/i
            ], [Ua.VENDOR, Ua.MODEL, [Ua.TYPE, Ua.TABLET]], [
                /(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i
            ], [Ua.MODEL, [Ua.VENDOR, 'Amazon'], [Ua.TYPE, Ua.TABLET]], [
                /(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i
            ], [[Ua.MODEL, Ua.mapper.str, Ua.maps.device.amazon.model], [Ua.VENDOR, 'Amazon'], [Ua.TYPE, Ua.MOBILE]], [
                /\((ip[honed|\s\w*]+);.+(apple)/i
            ], [Ua.MODEL, Ua.VENDOR, [Ua.TYPE, Ua.MOBILE]], [
                /\((ip[honed|\s\w*]+);/i
            ], [Ua.MODEL, [Ua.VENDOR, 'Apple'], [Ua.TYPE, Ua.MOBILE]], [
                /(blackberry)[\s-]?(\w+)/i,
                /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
                /(hp)\s([\w\s]+\w)/i,
                /(asus)-?(\w+)/i
            ], [Ua.VENDOR, Ua.MODEL, [Ua.TYPE, Ua.MOBILE]], [
                /\(bb10;\s(\w+)/i
            ], [Ua.MODEL, [Ua.VENDOR, 'BlackBerry'], [Ua.TYPE, Ua.MOBILE]], [
                /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i
            ], [Ua.MODEL, [Ua.VENDOR, 'Asus'], [Ua.TYPE, Ua.TABLET]], [
                /(sony)\s(tablet\s[ps])\sbuild\//i,
                /(sony)?(?:sgp.+)\sbuild\//i
            ], [[Ua.VENDOR, 'Sony'], [Ua.MODEL, 'Xperia Tablet'], [Ua.TYPE, Ua.TABLET]], [
                /(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i
            ], [[Ua.VENDOR, 'Sony'], [Ua.MODEL, 'Xperia Phone'], [Ua.TYPE, Ua.MOBILE]], [
                /\s(ouya)\s/i,
                /(nintendo)\s([wids3u]+)/i
            ], [Ua.VENDOR, Ua.MODEL, [Ua.TYPE, Ua.CONSOLE]], [
                /android.+;\s(shield)\sbuild/i
            ], [Ua.MODEL, [Ua.VENDOR, 'Nvidia'], [Ua.TYPE, Ua.CONSOLE]], [
                /(playstation\s[3portablevi]+)/i
            ], [Ua.MODEL, [Ua.VENDOR, 'Sony'], [Ua.TYPE, Ua.CONSOLE]], [
                /(sprint\s(\w+))/i
            ], [[Ua.VENDOR, Ua.mapper.str, Ua.maps.device.sprint.vendor], [Ua.MODEL, Ua.mapper.str, Ua.maps.device.sprint.model], [Ua.TYPE, Ua.MOBILE]], [
                /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i
            ], [Ua.VENDOR, Ua.MODEL, [Ua.TYPE, Ua.TABLET]], [
                /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,
                /(zte)-(\w+)*/i,
                /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
            ], [Ua.VENDOR, [Ua.MODEL, /_/g, ' '], [Ua.TYPE, Ua.MOBILE]], [
                /(nexus\s9)/i
            ], [Ua.MODEL, [Ua.VENDOR, 'HTC'], [Ua.TYPE, Ua.TABLET]], [
                /(nexus\s6p)/i
            ], [Ua.MODEL, [Ua.VENDOR, 'Huawei'], [Ua.TYPE, Ua.MOBILE]], [
                /(microsoft);\s(lumia[\s\w]+)/i
            ], [Ua.VENDOR, Ua.MODEL, [Ua.TYPE, Ua.MOBILE]], [
                /[\s\(;](xbox(?:\sone)?)[\s\);]/i
            ], [Ua.MODEL, [Ua.VENDOR, 'Microsoft'], [Ua.TYPE, Ua.CONSOLE]], [
                /(kin\.[onetw]{3})/i
            ], [[Ua.MODEL, /\./g, ' '], [Ua.VENDOR, 'Microsoft'], [Ua.TYPE, Ua.MOBILE]], [
                /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,
                /mot[\s-]?(\w+)*/i,
                /(XT\d{3,4}) build\//i,
                /(nexus\s6)/i
            ], [Ua.MODEL, [Ua.VENDOR, 'Motorola'], [Ua.TYPE, Ua.MOBILE]], [
                /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
            ], [Ua.MODEL, [Ua.VENDOR, 'Motorola'], [Ua.TYPE, Ua.TABLET]], [
                /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i
            ], [[Ua.VENDOR, Ua.util.trim], [Ua.MODEL, Ua.util.trim], [Ua.TYPE, Ua.SMARTTV]], [
                /hbbtv.+maple;(\d+)/i
            ], [[Ua.MODEL, /^/, 'SmartTV'], [Ua.VENDOR, 'Samsung'], [Ua.TYPE, Ua.SMARTTV]], [
                /\(dtv[\);].+(aquos)/i
            ], [Ua.MODEL, [Ua.VENDOR, 'Sharp'], [Ua.TYPE, Ua.SMARTTV]], [
                /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
                /((SM-T\w+))/i
            ], [[Ua.VENDOR, 'Samsung'], Ua.MODEL, [Ua.TYPE, Ua.TABLET]], [
                /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
                /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,
                /sec-((sgh\w+))/i
            ], [[Ua.VENDOR, 'Samsung'], Ua.MODEL, [Ua.TYPE, Ua.MOBILE]], [
                /smart-tv.+(samsung)/i
            ], [Ua.VENDOR, Ua.MODEL, [Ua.TYPE, Ua.SMARTTV]], [
                /sie-(\w+)*/i
            ], [Ua.MODEL, [Ua.VENDOR, 'Siemens'], [Ua.TYPE, Ua.MOBILE]], [
                /(maemo|nokia).*(n900|lumia\s\d+)/i,
                /(nokia)[\s_-]?([\w-]+)*/i
            ], [[Ua.VENDOR, 'Nokia'], Ua.MODEL, [Ua.TYPE, Ua.MOBILE]], [
                /android\s3\.[\s\w;-]{10}(a\d{3})/i
            ], [Ua.MODEL, [Ua.VENDOR, 'Acer'], [Ua.TYPE, Ua.TABLET]], [
                /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i
            ], [[Ua.VENDOR, 'LG'], Ua.MODEL, [Ua.TYPE, Ua.TABLET]], [
                /(lg) netcast\.tv/i
            ], [Ua.VENDOR, Ua.MODEL, [Ua.TYPE, Ua.SMARTTV]], [
                /(nexus\s[45])/i,
                /lg[e;\s\/-]+(\w+)*/i
            ], [Ua.MODEL, [Ua.VENDOR, 'LG'], [Ua.TYPE, Ua.MOBILE]], [
                /android.+(ideatab[a-z0-9\-\s]+)/i
            ], [Ua.MODEL, [Ua.VENDOR, 'Lenovo'], [Ua.TYPE, Ua.TABLET]], [
                /linux;.+((jolla));/i
            ], [Ua.VENDOR, Ua.MODEL, [Ua.TYPE, Ua.MOBILE]], [
                /((pebble))app\/[\d\.]+\s/i
            ], [Ua.VENDOR, Ua.MODEL, [Ua.TYPE, Ua.WEARABLE]], [
                /android.+;\s(glass)\s\d/i
            ], [Ua.MODEL, [Ua.VENDOR, 'Google'], [Ua.TYPE, Ua.WEARABLE]], [
                /android.+;\s(pixel c)\s/i
            ], [Ua.MODEL, [Ua.VENDOR, 'Google'], [Ua.TYPE, Ua.TABLET]], [
                /android.+;\s(pixel xl|pixel)\s/i
            ], [Ua.MODEL, [Ua.VENDOR, 'Google'], [Ua.TYPE, Ua.MOBILE]], [
                /android.+(\w+)\s+build\/hm\1/i,
                /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,
                /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d\w)?)\s+build/i
            ], [[Ua.MODEL, /_/g, ' '], [Ua.VENDOR, 'Xiaomi'], [Ua.TYPE, Ua.MOBILE]], [
                /android.+a000(1)\s+build/i
            ], [Ua.MODEL, [Ua.VENDOR, 'OnePlus'], [Ua.TYPE, Ua.MOBILE]], [
                /\s(tablet)[;\/]/i,
                /\s(mobile)(?:[;\/]|\ssafari)/i
            ], [[Ua.TYPE, Ua.util.lowerize], Ua.VENDOR, Ua.MODEL]
        ],
        os: [[
                /microsoft\s(windows)\s(vista|xp)/i
            ], [Ua.NAME, Ua.VERSION], [
                /(windows)\snt\s6\.2;\s(arm)/i,
                /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s]+\w)*/i,
                /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
            ], [Ua.NAME, [Ua.VERSION, Ua.mapper.str, Ua.maps.os.windows.version]], [
                /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
            ], [[Ua.NAME, 'Windows'], [Ua.VERSION, Ua.mapper.str, Ua.maps.os.windows.version]], [
                /\((bb)(10);/i
            ], [[Ua.NAME, 'BlackBerry'], Ua.VERSION], [
                /(blackberry)\w*\/?([\w\.]+)*/i,
                /(tizen)[\/\s]([\w\.]+)/i,
                /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
                /linux;.+(sailfish);/i
            ], [Ua.NAME, Ua.VERSION], [
                /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i
            ], [[Ua.NAME, 'Symbian'], Ua.VERSION], [
                /\((series40);/i
            ], [Ua.NAME], [
                /mozilla.+\(mobile;.+gecko.+firefox/i
            ], [[Ua.NAME, 'Firefox OS'], Ua.VERSION], [
                /(nintendo|playstation)\s([wids34portablevu]+)/i,
                /(mint)[\/\s\(]?(\w+)*/i,
                /(mageia|vectorlinux)[;\s]/i,
                /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]+)*/i,
                /(hurd|linux)\s?([\w\.]+)*/i,
                /(gnu)\s?([\w\.]+)*/i
            ], [Ua.NAME, Ua.VERSION], [
                /(cros)\s[\w]+\s([\w\.]+\w)/i
            ], [[Ua.NAME, 'Chromium OS'], Ua.VERSION], [
                /(sunos)\s?([\w\.]+\d)*/i
            ], [[Ua.NAME, 'Solaris'], Ua.VERSION], [
                /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i
            ], [Ua.NAME, Ua.VERSION], [
                /(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i
            ], [[Ua.NAME, 'iOS'], [Ua.VERSION, /_/g, '.']], [
                /(mac\sos\sx)\s?([\w\s\.]+\w)*/i,
                /(macintosh|mac(?=_powerpc)\s)/i
            ], [[Ua.NAME, 'Mac OS'], [Ua.VERSION, /_/g, '.']], [
                /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,
                /(haiku)\s(\w+)/i,
                /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,
                /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
                /(unix)\s?([\w\.]+)*/i
            ], [Ua.NAME, Ua.VERSION]
        ]
    };
    teads.Ua = Ua;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var StringHelper = (function () {
        function StringHelper() {
        }
        StringHelper.isURL = function (val) {
            var pattern = /^\(?((?:(http|https|ftp):\/\/)|\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#]*))?([\#][^\s\n]*)?\)?$/i;
            return (typeof val === 'string') && pattern.test(val);
        };
        StringHelper.pad = function (input, pad) {
            if (pad === void 0) { pad = '00'; }
            var str = String(input);
            return pad.substring(0, pad.length - str.length) + str;
        };
        StringHelper.ucfirst = function (str) {
            return str.charAt(0).toUpperCase() + str.substr(1);
        };
        StringHelper.rand = function (length, digitsOnly) {
            if (digitsOnly === void 0) { digitsOnly = true; }
            var chars = digitsOnly ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var str = '';
            for (var i = 0; i < length; i++) {
                str += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return str;
        };
        StringHelper.trim = function (str) {
            return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
        StringHelper.separate = function (separator) {
            if (separator === void 0) { separator = '|'; }
            var str = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                str[_i - 1] = arguments[_i];
            }
            var allUndefined = true;
            var i = 0;
            while (allUndefined && i < str.length) {
                allUndefined = allUndefined && !str[i];
                i++;
            }
            if (allUndefined) {
                return '';
            }
            return str.join(separator);
        };
        StringHelper.endsWith = function (str, suffix) {
            return str.slice(-suffix.length) === suffix;
        };
        StringHelper.match = function (str, regxp) {
            return str.match(regxp) || [];
        };
        return StringHelper;
    }());
    teads.StringHelper = StringHelper;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var Version = (function () {
        function Version(version) {
            this.isValid = true;
            if (typeof version !== 'string') {
                version = "" + version;
            }
            if (version.length > Semver.MAX_LENGTH) {
                this.isValid = false;
                return;
            }
            var m = version.trim().match(Semver.FULL);
            if (!m) {
                var n = version.split('.').length;
                if (n < 3) {
                    return new Version(version + ".0");
                }
                this.isValid = false;
                return;
            }
            this.raw = version;
            this.major = +m[1];
            this.minor = +m[2];
            this.patch = +m[3];
            if (this.major > Semver.MAX_SAFE_INTEGER || this.major < 0) {
                this.isValid = false;
                return;
            }
            if (this.minor > Semver.MAX_SAFE_INTEGER || this.minor < 0) {
                this.isValid = false;
                return;
            }
            if (this.patch > Semver.MAX_SAFE_INTEGER || this.patch < 0) {
                this.isValid = false;
                return;
            }
            this.version = this.major + '.' + this.minor + '.' + this.patch;
        }
        Version.prototype.toString = function () {
            return this.version;
        };
        return Version;
    }());
    var Semver = (function () {
        function Semver() {
        }
        Semver.isGreaterThan = function (a, b) {
            var comparison = Semver.compare(a, b);
            return comparison === null ? false : comparison > 0;
        };
        Semver.isLowerThan = function (a, b) {
            var comparison = Semver.compare(a, b);
            return comparison === null ? false : comparison < 0;
        };
        Semver.isGreaterOrEqual = function (a, b) {
            var comparison = Semver.compare(a, b);
            return comparison === null ? false : comparison >= 0;
        };
        Semver.isLowerOrEqual = function (a, b) {
            var comparison = Semver.compare(a, b);
            return comparison === null ? false : comparison <= 0;
        };
        Semver.compareIdentifiers = function (a, b) {
            return a < b ? -1 :
                a > b ? 1 :
                    0;
        };
        Semver.compareMain = function (a, b) {
            return Semver.compareIdentifiers(a.major, b.major) ||
                Semver.compareIdentifiers(a.minor, b.minor) ||
                Semver.compareIdentifiers(a.patch, b.patch);
        };
        Semver.compare = function (a, b) {
            var va = new Version(a);
            var vb = new Version(b);
            if (!va.isValid || !vb.isValid) {
                return null;
            }
            return Semver.compareMain(va, vb);
        };
        return Semver;
    }());
    Semver.MAX_LENGTH = 256;
    Semver.MAX_SAFE_INTEGER = 9007199254740991;
    Semver.NUMERICIDENTIFIER = '0|[1-9]\\d*';
    Semver.MAINVERSION = '(' + Semver.NUMERICIDENTIFIER + ')\\.' + '(' + Semver.NUMERICIDENTIFIER + ')\\.' + '(' + Semver.NUMERICIDENTIFIER + ')';
    Semver.FULL = new RegExp('^v?' + Semver.MAINVERSION + '.*?$');
    teads.Semver = Semver;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var BlobHelper = (function () {
        function BlobHelper() {
        }
        BlobHelper.createBlob = function (content, type) {
            if (type === void 0) { type = 'application/javascript'; }
            if (window.Blob) {
                try {
                    return new Blob([content], { type: type });
                }
                catch (err) {
                }
            }
            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
            var blobBuilder = new window.BlobBuilder();
            blobBuilder.append(content);
            return blobBuilder.getBlob();
        };
        BlobHelper.getUrl = function () {
            return window.URL || window.webkitURL;
        };
        return BlobHelper;
    }());
    teads.BlobHelper = BlobHelper;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var TIMER_MODE;
    (function (TIMER_MODE) {
        TIMER_MODE[TIMER_MODE["Standard"] = 0] = "Standard";
        TIMER_MODE[TIMER_MODE["Worker"] = 1] = "Worker";
        TIMER_MODE[TIMER_MODE["Precise"] = 2] = "Precise";
    })(TIMER_MODE = teads.TIMER_MODE || (teads.TIMER_MODE = {}));
    var Timer = (function () {
        function Timer() {
        }
        Timer.setTimeout = function (callback, duration, mode) {
            if (mode === void 0) { mode = TIMER_MODE.Standard; }
            if (mode === TIMER_MODE.Worker && Timer.canUseWorker()) {
                var worker_1 = Timer.createWorker(callback, 'self.setTimeout(function(){self.postMessage("tick")}, ' + duration + ')');
                return {
                    clear: function () { worker_1.terminate(); }
                };
            }
            else if (mode === TIMER_MODE.Precise) {
                var initTime_1 = teads.Timing.now();
                var timer_1;
                var nbTimer_1 = 0;
                var preciseTimeout = function () {
                    var elapsedTime = teads.Timing.now() - initTime_1;
                    var timerAvgDuration = nbTimer_1 === 0 ? nbTimer_1 : elapsedTime / nbTimer_1;
                    if (elapsedTime < duration - timerAvgDuration) {
                        nbTimer_1 += 1;
                        timer_1 = Timer.requestAnimationFrame(preciseTimeout, Timer.tick);
                    }
                    else {
                        callback();
                    }
                };
                preciseTimeout();
                return {
                    clear: function () { Timer.cancelAnimationFrame(timer_1); }
                };
            }
            else {
                var timer_2 = setTimeout(function () { callback(); }, duration);
                return {
                    clear: function () { clearTimeout(timer_2); }
                };
            }
        };
        Timer.setInterval = function (callback, duration, useWorker) {
            if (useWorker === void 0) { useWorker = false; }
            if (useWorker && Timer.canUseWorker()) {
                var worker_2 = Timer.createWorker(callback, 'self.setInterval(function(){self.postMessage("tick")}, ' + duration + ')');
                return {
                    clear: function () { worker_2.terminate(); }
                };
            }
            else {
                var timer_3 = setInterval(function () { callback(); }, duration);
                return {
                    clear: function () { clearInterval(timer_3); }
                };
            }
        };
        Timer.requestAnimationFrame = function (callback, refreshRate) {
            var raf = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame;
            if (raf) {
                return raf(callback);
            }
            else {
                return setTimeout(callback, refreshRate);
            }
        };
        Timer.cancelAnimationFrame = function (timerId) {
            var caf = window.cancelAnimationFrame || window.mozCancelAnimationFrame || clearTimeout;
            caf(timerId);
        };
        Timer.createWorker = function (callback, blobString) {
            var wBlob = teads.BlobHelper.createBlob(blobString);
            var worker = new Worker(teads.BlobHelper.getUrl().createObjectURL(wBlob));
            worker.onmessage = function (msg) { return callback(); };
            return worker;
        };
        Timer.canUseWorker = function () {
            var url = teads.BlobHelper.getUrl();
            return !!window.Worker && !!url && !!url.createObjectURL;
        };
        return Timer;
    }());
    Timer.tick = 1000 / 60;
    teads.Timer = Timer;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    teads.CONTEXT_IS_INITIALIZED = false;
    var UABrowser = (function () {
        function UABrowser(browser) {
            this.name = browser.name || '';
            this.version = browser.version || '';
        }
        UABrowser.prototype.toString = function () {
            return teads.StringHelper.separate('|', this.name, this.version).toLowerCase();
        };
        return UABrowser;
    }());
    teads.UABrowser = UABrowser;
    var UAOs = (function () {
        function UAOs(os) {
            this.name = os.name || '';
            this.version = os.version || '';
        }
        UAOs.prototype.toString = function () {
            return teads.StringHelper.separate('|', this.name, this.version).toLowerCase();
        };
        return UAOs;
    }());
    teads.UAOs = UAOs;
    var UADevice = (function () {
        function UADevice(device) {
            this.model = device.model || '';
            this.type = device.type || (UADevice.typeRegExp.test(Context.getOS().name) ? teads.Ua.DESKTOP : '');
            this.vendor = device.vendor || '';
        }
        UADevice.prototype.toString = function () {
            return teads.StringHelper.separate('|', this.model, this.type, this.vendor).toLowerCase();
        };
        return UADevice;
    }());
    UADevice.typeRegExp = /^windows|mac\s+os|linux|bsd|dragonfly|chromium\s+os|haiku|ubuntu|slackware|gentoo|solaris|debian|fedora|arch|beos|mint|gnu|os|suse\/2$/i;
    teads.UADevice = UADevice;
    var Context = (function () {
        function Context() {
        }
        Context.getContextSummary = function () {
            var device = Context.isMobile() && !Context.isTablet() ? 'mob' :
                Context.isTablet() ? 'tab' : 'desk';
            var plateform = Context.isAndroid() ? 'android' :
                Context.isIos() ? 'ios' :
                    Context.isIE() ? 'ie' :
                        Context.isChrome() ? 'ch' :
                            Context.isFirefox() ? 'ff' : 'ot';
            return [device, plateform].join(' ');
        };
        Context.getFullContext = function () {
            return [
                Context.getDevice().type,
                Context.getOS().name,
                Context.getOS().version,
                Context.getBrowser().name,
                Context.getBrowser().version.split('.')[0],
                Context.getShortContext()
            ].join('|');
        };
        Context.init = function () {
            if (!teads.CONTEXT_IS_INITIALIZED) {
                Context.checkUserAgent();
                Context.checkLanguage();
                Context.os = new UAOs(teads.Ua.mapper.rgx.apply(this, teads.Ua.regexes.os));
                Context.browser = new UABrowser(teads.Ua.mapper.rgx.apply(this, teads.Ua.regexes.browser));
                Context.device = new UADevice(teads.Ua.mapper.rgx.apply(this, teads.Ua.regexes.device));
                Context.checkAmp();
                Context.checkFacebookIA();
                Context.checkIabSF();
                Context.checkEdgeTouchScreen();
                Context.checkUiWebview();
                Context.checkObserveIntersection();
                Context.cacheBrowserValues();
                Context.cacheOsValues();
                Context.cacheDeviceValues();
                Context.cacheVersionValues();
                Context.cacheCustomValues();
                Context.startAutoplayTest();
                teads.CONTEXT_IS_INITIALIZED = true;
            }
        };
        Context.setIsSDK = function (isSDK) {
            Context.cache.isSDK = isSDK;
        };
        Context.isDesktop = function () {
            return Context.cache.isDesktop;
        };
        Context.isIpad = function () {
            return Context.cache.isIpad;
        };
        Context.isTablet = function () {
            return Context.cache.isTablet;
        };
        Context.isMobile = function () {
            return Context.cache.isMobile;
        };
        Context.isChromeIos = function () {
            return Context.cache.isChromeIos;
        };
        Context.isFacebookWebview = function () {
            return Context.cache.isFacebookWebview;
        };
        Context.isAndroidNative = function () {
            return Context.cache.isAndroidNative;
        };
        Context.isAndroid = function () {
            return Context.cache.isAndroid;
        };
        Context.isIos = function () {
            return Context.cache.isIos;
        };
        Context.isIphone = function () {
            return Context.cache.isIphone;
        };
        Context.isAndroidMobile = function () {
            return Context.cache.isAndroidMobile;
        };
        Context.isIE = function () {
            return Context.cache.isIE;
        };
        Context.isChrome = function () {
            return Context.cache.isChrome;
        };
        Context.isChromeWebView = function () {
            return Context.cache.isChromeWebView;
        };
        Context.isFirefox = function () {
            return Context.cache.isFirefox;
        };
        Context.isEdge = function () {
            return Context.cache.isEdge;
        };
        Context.isAmp = function () {
            return Context.cache.amp;
        };
        Context.isFacebookIA = function () {
            return Context.cache.fbia;
        };
        Context.isAmpObserveIntersection = function () {
            return Context.cache.isAmpObserveIntersection;
        };
        Context.isIABSafeFrame = function () {
            return Context.cache.iabsf;
        };
        Context.isEdgeTouchScreen = function () {
            return Context.cache.isEdgeTouchScreen;
        };
        Context.isSDK = function () {
            return Context.cache.isSDK;
        };
        Context.getIEVersion = function () {
            return Context.cache.ieVersion;
        };
        Context.getAndroidVersion = function () {
            return Context.cache.androidVersion;
        };
        Context.getChromeVersion = function () {
            return Context.cache.chromeVersion;
        };
        Context.getIosVersion = function () {
            return Context.cache.iOsVersion;
        };
        Context.getFacebookWebviewVersion = function () {
            return Context.cache.FacebookWebviewVersion;
        };
        Context.getSafariVersion = function () {
            return Context.cache.safariVersion;
        };
        Context.isUIWebview = function () {
            return Context.cache.isUIWebview;
        };
        Context.isSafari = function () {
            return Context.cache.isSafari;
        };
        Context.isSafari11Plus = function () {
            return teads.Semver.isGreaterOrEqual(Context.getSafariVersion(), '11');
        };
        Context.isGoogleSearchApp = function () {
            return Context.cache.isGoogleSearchApp;
        };
        Context.isIos10Safari = function () {
            return Context.cache.isIos10Safari;
        };
        Context.isIos10OtherBrowser = function () {
            return Context.cache.isIos10OtherBrowser;
        };
        Context.isWhiteListedIos10Safari = function (pid) {
            if (pid === void 0) { pid = null; }
            return Context.isIos10Safari() && !Context.blackListRealHtml5Player.test(pid);
        };
        Context.isFacebookWebviewIOS10 = function () {
            return teads.Semver.isGreaterOrEqual(Context.getFacebookWebviewVersion(), '87') && teads.Semver.isGreaterOrEqual(Context.getIosVersion(), '10.2');
        };
        Context.isCanvasUsed = function () {
            return Context.cache.isCanvasUsed;
        };
        Context.videoSupport = function (context) {
            return !!context.createElement('video').canPlayType;
        };
        Context.getLanguage = function () {
            return Context.language;
        };
        Context.getUA = function () {
            return Context.userAgent;
        };
        Context.setUA = function (ua) {
            Context.userAgent = ua;
        };
        Context.getDevice = function () {
            return Context.device;
        };
        Context.getOS = function () {
            return Context.os;
        };
        Context.getBrowser = function () {
            return Context.browser;
        };
        Context.canAutoplay = function () {
            if (Context.isAutoplayEnabled === null && (teads.Timing.now() - Context.autoplayStartTime) > 100) {
                Context.endAutoplayTest(true);
            }
            return Context.isAutoplayEnabled;
        };
        Context.isCanvasNeeded = function (isCustomContext) {
            var fromChromeVersion = isCustomContext ? '53' : '56';
            return Context.doNeedAutoplayCheck(fromChromeVersion) && !Context.canAutoplay();
        };
        Context.getShortContext = function () {
            var shortContext;
            if (Context.isAmp()) {
                shortContext = 'amp';
            }
            else if (Context.isFacebookIA()) {
                shortContext = 'fia';
            }
            else if (Context.isIABSafeFrame()) {
                shortContext = 'sf';
            }
            else if (Context.isFacebookWebview()) {
                shortContext = 'fbwv';
            }
            else if (Context.isChromeWebView() || Context.isUIWebview()) {
                shortContext = 'wv';
            }
            else {
                shortContext = 'web';
            }
            return Context.isCanvasUsed() ? shortContext + "-canvas" : shortContext;
        };
        Context.cacheCanvasUsed = function (isCanvasUsed) {
            Context.cache.isCanvasUsed = isCanvasUsed;
        };
        Context.checkUserAgent = function () {
            try {
                Context.userAgent = navigator.userAgent;
            }
            catch (err) {
                Context.logger.error('Could not get `navigator.userAgent`', err);
                Context.userAgent = '';
            }
        };
        Context.checkLanguage = function () {
            try {
                Context.language = (window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage || 'en');
            }
            catch (err) {
                Context.logger.error('Could not get navigator language', err);
                Context.language = 'en';
            }
        };
        Context.checkAmp = function () {
            try {
                Context.cache.amp = !!window._teads_amp;
            }
            catch (err) {
                Context.logger.error('Could not check if `!!window._teads_amp`', err);
                Context.cache.amp = false;
            }
        };
        Context.checkFacebookIA = function () {
            try {
                Context.cache.fbia = !!window._teads_fbia;
            }
            catch (err) {
                Context.logger.error('Could not check if `!!window._teads_fbia`', err);
                Context.cache.fbia = false;
            }
        };
        Context.checkIabSF = function () {
            try {
                Context.cache.iabsf = !!window.$sf && !!window.$sf.ext;
            }
            catch (err) {
                Context.logger.error('Could not check if `!!window.$sf.ext`', err);
                Context.cache.iabsf = false;
            }
        };
        Context.checkEdgeTouchScreen = function () {
            try {
                Context.cache.edgeTouchScreen = navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
            }
            catch (err) {
                Context.logger.error('Could not check if `navigator.maxTouchPoints > 0`', err);
                Context.cache.edgeTouchScreen = false;
            }
        };
        Context.checkUiWebview = function () {
            try {
                Context.cache.uiWebview = window.navigator.standalone;
            }
            catch (err) {
                Context.logger.error('Could not check navigator.standalone', err);
                Context.cache.uiWebview = false;
            }
        };
        Context.checkObserveIntersection = function () {
            try {
                Context.cache.observeIntersection = !!(window.context && window.context.observeIntersection);
            }
            catch (err) {
                Context.logger.error('Could not check if `!!window.context.observeIntersection`', err);
                Context.cache.observeIntersection = false;
            }
        };
        Context.cacheBrowserValues = function () {
            Context.cache.isIE = Context.browser.name === 'IE' || /MSIE|Trident/.test(Context.userAgent);
            Context.cache.isFirefox = Context.browser.name === 'Firefox' || /Firefox/i.test(Context.userAgent);
            Context.cache.isEdge = Context.browser.name === 'Edge' || /Edge/i.test(Context.userAgent);
            Context.cache.isGoogleSearchApp = /GSA\//i.test(Context.userAgent);
            Context.cache.isSafari = (Context.browser.name === 'Safari' || Context.browser.name === 'Mobile Safari') && !Context.isGoogleSearchApp();
            Context.cache.isChromeWebView = Context.browser.name === 'Chrome WebView';
            Context.cache.isChrome = Context.browser.name === 'Chrome' || Context.isChromeWebView();
            Context.cache.isEdgeTouchScreen = Context.isEdge() && Context.cache.edgeTouchScreen;
            Context.cache.isChromeIos = /CriOS/i.test(Context.userAgent);
            Context.cache.isAndroidNative = Context.browser.name === 'Android Browser';
            Context.cache.isFacebookWebview = Context.browser.name === 'Facebook' || /FBAN|FBIOS|FBAV|FBBV|FBDV|FBMD|FBSN|FBSV|FBSS|FBCR|FBID|FBLC|FBOP/i.test(Context.userAgent);
        };
        Context.cacheOsValues = function () {
            Context.cache.isIpad = Context.device.model === 'iPad' || /iPad/i.test(Context.userAgent);
            Context.cache.isIphone = Context.device.model === 'iPhone' || /iPhone/i.test(Context.userAgent);
            Context.cache.isIos = Context.os.name === 'iOS' || Context.isIpad() || Context.isIphone();
            Context.cache.isAndroid = Context.os.name === 'Android' || /Android/i.test(Context.userAgent);
        };
        Context.cacheDeviceValues = function () {
            var mobile = /(m|M)obile/.test(Context.userAgent);
            Context.cache.isTablet = Context.device.type === 'tablet' || Context.isIpad() || (Context.isAndroid() && !mobile);
            Context.cache.isMobile = Context.device.type === 'mobile' || (Context.isIos() && !Context.isIpad()) || (Context.isAndroid() && mobile);
            Context.cache.isDesktop = !Context.isMobile() && !Context.isTablet();
        };
        Context.cacheVersionValues = function () {
            Context.cache.ieVersion = Context.isIE() ? Context.browser.version : null;
            Context.cache.iOsVersion = Context.isIos() ? Context.os.version : null;
            Context.cache.androidVersion = Context.isAndroid() ? Context.os.version : null;
            Context.cache.chromeVersion = Context.isChrome() ? Context.browser.version : null;
            Context.cache.FacebookWebviewVersion = Context.isFacebookWebview() ? Context.browser.version : null;
            Context.cache.safariVersion = Context.isSafari() ? Context.browser.version : null;
        };
        Context.cacheCustomValues = function () {
            Context.cache.isAndroidMobile = Context.isAndroid() && Context.isMobile();
            Context.cache.isAmpObserveIntersection = Context.cache.amp && Context.cache.observeIntersection;
            Context.cache.isUIWebview = (Context.isIphone() || Context.isIpad()) && !Context.isSafari() && !Context.isChrome() && !Context.cache.uiWebview;
            Context.cache.isIos10Safari = teads.Semver.isGreaterOrEqual(Context.getIosVersion(), '10') && !Context.isUIWebview() && !Context.isChromeIos();
            Context.cache.isIos10OtherBrowser = teads.Semver.isGreaterOrEqual(Context.getIosVersion(), '10') && teads.Semver.isLowerThan(Context.getIosVersion(), '11') && Context.isUIWebview() && Context.isChromeIos();
        };
        Context.doNeedAutoplayCheck = function (fromChromeVersion) {
            if (fromChromeVersion === void 0) { fromChromeVersion = '53'; }
            return (Context.isAndroid() && teads.Semver.isGreaterOrEqual(Context.getChromeVersion(), fromChromeVersion))
                || (Context.isIos10OtherBrowser()
                    || teads.Semver.isGreaterOrEqual(Context.getIosVersion(), '11'));
        };
        Context.startAutoplayTest = function () {
            if (Context.isAutoplayEnabled === null) {
                if (Context.doNeedAutoplayCheck()) {
                    if (!Context.autoplayHtmlVideoElement && !Context.autoplayStartTime) {
                        Context.autoplayHtmlVideoElement = document.createElement('video');
                        Context.autoplayHtmlVideoElement.src = Context.autoplayVideoUrl;
                        Context.autoplayHtmlVideoElement.style.display = 'none';
                        Context.autoplayHtmlVideoElement.setAttribute('webkit-playsinline', 'true');
                        Context.autoplayHtmlVideoElement.setAttribute('playsinline', 'true');
                        Context.autoplayHtmlVideoElement.muted = true;
                        document.body.appendChild(Context.autoplayHtmlVideoElement);
                        Context.autoplayStartTime = teads.Timing.now();
                        teads.Timing.mark('markAutoplayStartTime');
                        Context.autoplayHtmlVideoElement.play().then(function () {
                            Context.endAutoplayTest(true);
                        }).catch(function (e) {
                            Context.endAutoplayTest(false);
                        });
                    }
                }
                else {
                    Context.isAutoplayEnabled = false;
                }
            }
        };
        Context.endAutoplayTest = function (isAutoplayAllowed) {
            if (Context.isAutoplayEnabled === null) {
                teads.Timing.mark('markAutoplayEndTime');
                Context.isAutoplayEnabled = isAutoplayAllowed;
            }
            if (Context.autoplayHtmlVideoElement !== null) {
                Context.autoplayHtmlVideoElement.pause();
                document.body.removeChild(Context.autoplayHtmlVideoElement);
                Context.autoplayHtmlVideoElement = null;
            }
        };
        return Context;
    }());
    Context.logger = new teads.Logger('Context');
    Context.cache = {};
    Context.blackListRealHtml5Player = /^(23027|24539|25695|25696|25697|25698|25699|25700|25701|25702|25703|25704|25705|25706|25707|25708|25709|25710|25711|26170|26231|26561|26566|26567|26568|26569|26570|26572|27446|28204|28206|28207|28210|28211|28212|28541|28827|28831|31814|33366|33704|33705|33706|33707|33708|34907|43985|49718|52375|53276|53824|53837|53838|53840|53842|55491|57698|57699|57702|60178|60578|61059|61123|69299)$/;
    Context.autoplayVideoUrl = teads.Utils.getProtocol() + '//cdn.teads.tv/media/format/v3/assets/default/autoplay.mp4';
    Context.isAutoplayEnabled = null;
    teads.Context = Context;
    Context.init();
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var Dom = (function () {
        function Dom() {
        }
        Dom.getBoundingClientRect = function (element) {
            try {
                var rect = element.getBoundingClientRect();
                var realRect = Dom.copyBoundingClientRect(rect);
                var isStrictModeAllowed = !teads.Context.isAmp() && !teads.Context.isIABSafeFrame() && !teads.Context.isFacebookIA();
                if (isStrictModeAllowed && teads.HTMLHelper.getWindow(element) !== window.top) {
                    var parentFrameNode = teads.HTMLHelper.findFirstParentFrameNode(element);
                    if (parentFrameNode !== element) {
                        var parentFrameRect = Dom.getBoundingClientRect(parentFrameNode);
                        if (parentFrameRect.top) {
                            realRect.top = parentFrameRect.top + rect.top;
                            realRect.bottom = parentFrameRect.top + rect.bottom;
                        }
                        if (parentFrameRect.left) {
                            realRect.left = parentFrameRect.left + rect.left;
                            realRect.right = parentFrameRect.left + rect.right;
                        }
                    }
                }
                return realRect;
            }
            catch (err) {
                return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
            }
        };
        Dom.copyBoundingClientRect = function (rect) {
            return {
                top: rect.top || 0,
                right: rect.right || 0,
                bottom: rect.bottom || 0,
                left: rect.left || 0,
                width: rect.width || 0,
                height: rect.height || 0,
            };
        };
        Dom.getSize = function (element) {
            var offsetWidth = element.offsetWidth;
            var offsetHeight = element.offsetHeight;
            var webkitOffsetsZero = teads.Context.getUA().indexOf('WebKit') > -1 && !offsetWidth && !offsetHeight;
            if ((!offsetWidth || webkitOffsetsZero) && element.getBoundingClientRect) {
                var clientRect = Dom.getBoundingClientRect(element);
                return {
                    width: clientRect.right - clientRect.left,
                    height: clientRect.bottom - clientRect.top,
                };
            }
            return {
                width: offsetWidth,
                height: offsetHeight,
            };
        };
        Dom.getTextContent = function (node, buffer) {
            if (teads.ArrayHelper.indexOf(Dom.TAGS_TO_IGNORE, node.nodeName) >= 0) {
            }
            else if (node.nodeType === Dom.NODE_TYPES.TEXT) {
                buffer.push(node.nodeValue);
            }
            else if (node.nodeName in Dom.PREDEFINED_TAG_VALUES) {
                buffer.push(Dom.PREDEFINED_TAG_VALUES[node.nodeName]);
            }
            else {
                var child = node.firstChild;
                while (child) {
                    Dom.getTextContent(child, buffer);
                    child = child.nextSibling;
                }
            }
        };
        Dom.isEmpty = function (element, win) {
            if (win === void 0) { win = window; }
            if (!element) {
                return;
            }
            var elementTagName = element.tagName.toLowerCase();
            var whitelistedTags = ['iframe', 'object', 'img'];
            return !(teads.ArrayHelper.includes(whitelistedTags, elementTagName)) && !(Dom.querySelectorAll(whitelistedTags.join(','), win, element).length > 0) &&
                (element.textContent.trim() === '');
        };
        Dom.querySelectorAll = function (query, win, context) {
            if (context === void 0) { context = null; }
            context = context || win.document;
            return context.querySelectorAll(query);
        };
        Dom.getWindowSize = function (win) {
            if (win === void 0) { win = window; }
            if (teads.Context.isIABSafeFrame()) {
                var geom = window.$sf.ext.geom();
                return { width: geom.win.w, height: geom.win.h };
            }
            else if (typeof win.innerWidth === 'number') {
                return { width: win.innerWidth, height: win.innerHeight };
            }
            else if (win.document.documentElement && (win.document.documentElement.clientWidth || win.document.documentElement.clientHeight)) {
                return { width: win.document.documentElement.clientWidth, height: win.document.documentElement.clientHeight };
            }
            else if (win.document.body && (win.document.body.clientWidth || win.document.body.clientHeight)) {
                return { width: win.document.body.clientWidth, height: win.document.body.clientHeight };
            }
            else {
                return { width: 1000, height: 600 };
            }
        };
        Dom.inject = function (element, win) {
            if (win === void 0) { win = window; }
            var container = win.document.getElementsByTagName('head')[0] || win.document.body;
            container.appendChild(element);
        };
        Dom.addEventListener = function (eventName, node, handler) {
            if (node.addEventListener) {
                node.addEventListener(eventName, handler, true);
            }
            else if (node.attachEvent) {
                node.attachEvent('on' + eventName, handler);
            }
            else {
                Dom.logger.warn('Trying to addEventListener on bad object', node);
            }
        };
        Dom.removeEventListener = function (eventName, node, handler) {
            try {
                if (node.removeEventListener) {
                    node.removeEventListener(eventName, handler, true);
                }
                else if (node.attachEvent) {
                    node.detachEvent('on' + eventName, handler);
                }
                else {
                    Dom.logger.warn('Trying to removeEventListener on bad object', node);
                }
            }
            catch (e) {
            }
        };
        Dom.onDomReady = function (handler, win) {
            if (win === void 0) { win = window; }
            if (win.document && (win.document.readyState === 'complete' || win.document.readyState === 'loaded' || win.document.readyState === 'interactive')) {
                if (win.document.readyState === 'interactive' && win.document.attachEvent) {
                    win.document.attachEvent('onreadystatechange', function () {
                        if (win.document.readyState === 'complete' || win.document.readyState === 'loaded') {
                            handler();
                        }
                    });
                }
                else {
                    handler();
                }
            }
            else if (win.addEventListener) {
                win.addEventListener('DOMContentLoaded', handler, false);
            }
            else if (win.attachEvent && win === win.top) {
                if (Dom.readyQueue.push(handler) === 1) {
                    Dom.readyIEtop(win);
                }
            }
            else if (win.attachEvent) {
                win.attachEvent('onload', handler);
            }
        };
        Dom.onDomComplete = function (handler, win, context) {
            if (win === void 0) { win = window; }
            if (context === void 0) { context = this; }
            if (win.document.readyState === 'complete') {
                handler.call(context);
            }
            else {
                Dom.addEventListener('load', win, function () {
                    handler.call(context);
                });
            }
        };
        Dom.getScrollLeft = function (win) {
            if (win.pageXOffset) {
                return win.pageXOffset;
            }
            else {
                if ((win.document.compatMode || '') === 'CSS1Compat') {
                    return win.document.documentElement.scrollLeft;
                }
                else {
                    return win.document.body.scrollLeft;
                }
            }
        };
        Dom.getScrollTop = function (win) {
            if (win.pageYOffset) {
                return win.pageYOffset;
            }
            else {
                if ((win.document.compatMode || '') === 'CSS1Compat') {
                    return win.document.documentElement.scrollTop;
                }
                else {
                    return win.document.body.scrollTop;
                }
            }
        };
        Dom.getElementsByClassName = function (className, element, win) {
            if (win === void 0) { win = window; }
            element = element || win.document;
            if (element.getElementsByClassName) {
                return element.getElementsByClassName(className);
            }
            else {
                var classNames = className.split(' ');
                var classNameCSS2Query = '';
                for (var i = 0, len = classNames.length; i < len; i++) {
                    classNameCSS2Query += '.' + classNames[i];
                }
                return Dom.querySelectorAll(classNameCSS2Query, win, element);
            }
        };
        Dom.isHTMLElement = function (obj, win) {
            if (!obj || typeof obj !== 'object' || Dom.isNodeList(obj)) {
                return false;
            }
            if (!win) {
                win = teads.HTMLHelper.getWindow(obj) || window;
            }
            if (typeof win.HTMLElement === 'object') {
                return obj instanceof win.HTMLElement;
            }
            else {
                return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
            }
        };
        Dom.isNodeList = function (obj) {
            if (!obj || typeof obj !== 'object') {
                return false;
            }
            return String(obj) === '[object NodeList]' || String(obj) === '[object StaticNodeList]';
        };
        Dom.isSelfClosingTag = function (element) {
            if (Dom.isHTMLElement(element)) {
                return /^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i.test(element.nodeName);
            }
        };
        Dom.htmlDecode = function (html) {
            var txtArea = document.createElement('textarea');
            txtArea.innerHTML = html;
            return txtArea.value;
        };
        Dom.htmlEncode = function (text) {
            var txtArea = document.createElement('textarea');
            txtArea.innerText = text;
            return txtArea.innerHTML;
        };
        Dom.getOuterHTML = function (element) {
            var outerHTML;
            if (Dom.isHTMLElement(element)) {
                outerHTML = Dom.htmlDecode(element.outerHTML);
            }
            return outerHTML;
        };
        Dom.readyIEtop = function (win) {
            try {
                var el = win.document.documentElement;
                el.doScroll('left');
                var fn = void 0;
                while (fn = Dom.readyQueue.shift()) {
                    fn();
                }
            }
            catch (err) {
                setTimeout(Dom.readyIEtop, 50, win);
            }
        };
        return Dom;
    }());
    Dom.readyQueue = [];
    Dom.PREDEFINED_TAG_VALUES = { 'IMG': ' ', 'BR': '\n' };
    Dom.TAGS_TO_IGNORE = ['SCRIPT', 'STYLE', 'HEAD', 'IFRAME', 'OBJECT'];
    Dom.NODE_TYPES = {
        ELEMENT: 1,
        ATTRIBUTE: 2,
        TEXT: 3,
        CDATA_SECTION: 4,
        ENTITY_REFERENCE: 5,
        ENTITY: 6,
        PROCESSING_INSTRUCTION: 7,
        COMMENT: 8,
        DOCUMENT: 9,
        DOCUMENT_TYPE: 10,
        DOCUMENT_FRAGMENT: 11,
        NOTATION: 12,
    };
    Dom.logger = new teads.Logger('Dom');
    teads.Dom = Dom;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var HTMLHelper = (function () {
        function HTMLHelper() {
        }
        HTMLHelper.createIframe = function () {
            var iframe = document.createElement('iframe');
            iframe.style.setProperty('margin', '0', 'important');
            iframe.style.setProperty('padding', '0', 'important');
            iframe.style.setProperty('width', '0', 'important');
            iframe.style.setProperty('height', '0', 'important');
            iframe.style.setProperty('border', '0', 'important');
            iframe.style.setProperty('overflow', 'hidden', 'important');
            iframe.style.setProperty('float', 'none', 'important');
            iframe.setAttribute('scrolling', 'no');
            iframe.frameBorder = '0';
            return iframe;
        };
        HTMLHelper.isFullscreen = function (doc) {
            if (!doc) {
                doc = document;
            }
            return !!(doc.fullscreenElement || doc.mozFullScreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement);
        };
        HTMLHelper.getWindow = function (element) {
            if (!element || teads.Dom.isNodeList(element)) {
                return null;
            }
            var doc = HTMLHelper.getDocument(element);
            if (!doc) {
                return null;
            }
            return doc.defaultView || doc.parentWindow;
        };
        HTMLHelper.getDocument = function (element) {
            if (!element || teads.Dom.isNodeList(element)) {
                return null;
            }
            return element.ownerDocument;
        };
        HTMLHelper.toggleFullscreen = function (element) {
            if (HTMLHelper.isFullscreen()) {
                this.closeFullscreen(element);
            }
            else {
                this.openFullscreen(element);
            }
        };
        HTMLHelper.openFullscreen = function (element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            }
            else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
            else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            }
            else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            }
        };
        HTMLHelper.closeFullscreen = function (element) {
            var document = HTMLHelper.getDocument(element);
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        };
        HTMLHelper.addClass = function (element, className) {
            if (!HTMLHelper.hasClass(element, className)) {
                element.className += ' ' + className;
                element.className = teads.StringHelper.trim(element.className);
            }
        };
        HTMLHelper.removeClass = function (element, className) {
            if (HTMLHelper.hasClass(element, className)) {
                var classes = element.className.split(' ');
                classes.splice(teads.ArrayHelper.indexOf(classes, className), 1);
                element.className = teads.StringHelper.trim(classes.join(' '));
            }
        };
        HTMLHelper.hasClass = function (element, className) {
            return teads.ArrayHelper.indexOf(element.className.split(' '), className) !== -1;
        };
        HTMLHelper.toggleClass = function (element, className) {
            HTMLHelper.hasClass(element, className) ? HTMLHelper.removeClass(element, className) : HTMLHelper.addClass(element, className);
        };
        HTMLHelper.replaceClass = function (element, newClassName, oldClassName) {
            if (!HTMLHelper.hasClass(element, newClassName) && HTMLHelper.hasClass(element, oldClassName)) {
                HTMLHelper.removeClass(element, oldClassName);
                HTMLHelper.addClass(element, newClassName);
            }
        };
        HTMLHelper.findParentWindows = function (element) {
            var windows = [];
            if (teads.Dom.isHTMLElement(element)) {
                var closure;
                closure = function (win) {
                    if (win.parent !== win && win.parent.document && win.parent.location && win.parent.window) {
                        windows.push(win.parent);
                        closure(win.parent);
                    }
                };
                var win = HTMLHelper.getWindow(element);
                windows.push(win);
                try {
                    closure(win);
                }
                catch (e) { }
            }
            return windows;
        };
        HTMLHelper.findChildWindows = function (element, recursive) {
            if (recursive === void 0) { recursive = false; }
            var windows = [];
            if (teads.Dom.isHTMLElement(element)) {
                var iframes = element.getElementsByTagName('iframe');
                for (var i = 0; i < iframes.length; i++) {
                    try {
                        if (iframes[i].contentWindow && iframes[i].contentWindow.document && iframes[i].contentWindow.document.body) {
                            windows.push(iframes[i].contentWindow);
                            if (recursive) {
                                teads.ArrayHelper.forEach(HTMLHelper.findChildWindows(iframes[i].contentWindow.document.body, true), function (win) {
                                    windows.concat(win.contentWindow);
                                });
                            }
                        }
                    }
                    catch (e) {
                    }
                }
            }
            return windows;
        };
        HTMLHelper.findParentFrameNode = function (element) {
            var win = HTMLHelper.getWindow(element);
            try {
                if (win.parent !== win && typeof win.parent.Window !== 'undefined' && win.parent instanceof win.parent.Window) {
                    var iframes = win.parent.document.getElementsByTagName('iframe');
                    if (iframes) {
                        for (var i = 0; i < iframes.length; i++) {
                            if (iframes[i].contentWindow === win) {
                                return HTMLHelper.findParentFrameNode(iframes[i]);
                            }
                        }
                    }
                }
            }
            catch (e) {
            }
            return element;
        };
        HTMLHelper.findFirstParentFrameNode = function (element) {
            var win = HTMLHelper.getWindow(element);
            try {
                if (win.parent !== win && typeof win.parent.Window !== 'undefined' && win.parent instanceof win.parent.Window) {
                    var iframes = win.parent.document.getElementsByTagName('iframe');
                    if (iframes) {
                        for (var i = 0; i < iframes.length; i++) {
                            if (iframes[i].contentWindow === win && !HTMLHelper.isKarmaFrame(iframes[i])) {
                                return iframes[i];
                            }
                        }
                    }
                }
            }
            catch (e) {
            }
            return element;
        };
        HTMLHelper.isKarmaFrame = function (iframe) {
            return iframe.id === 'context' && iframe.src === 'http://localhost:5555/context.html' && iframe.width === '100%' && iframe.height === '100%';
        };
        HTMLHelper.findParentElements = function (element) {
            var parentElements = [];
            if (teads.Dom.isHTMLElement(element)) {
                var document_1 = HTMLHelper.getDocument(element);
                var currentParent = element;
                var isHtmlTag = currentParent.tagName && currentParent.tagName.toUpperCase && currentParent.tagName.toUpperCase() === 'HTML';
                while (!isHtmlTag && currentParent !== document_1.body && teads.Dom.isHTMLElement(currentParent)) {
                    currentParent = currentParent.parentElement;
                    parentElements.push(currentParent);
                }
            }
            return parentElements;
        };
        HTMLHelper.isInView = function (element, mainWindow, thresholdCoefficient, elementHeight) {
            if (!elementHeight) {
                elementHeight = element.offsetHeight;
            }
            var percentageInView = HTMLHelper.getPercentageInView(element, mainWindow, elementHeight);
            if ((teads.Context.isAmp() || teads.Context.isIABSafeFrame()) && percentageInView === 0) {
                return false;
            }
            return percentageInView >= thresholdCoefficient;
        };
        HTMLHelper.getPercentageInView = function (element, mainWindow, elementHeight, allowNegative) {
            if (elementHeight === void 0) { elementHeight = element.offsetHeight; }
            if (allowNegative === void 0) { allowNegative = false; }
            if (teads.Context.isAmp()) {
                return mainWindow._teads_amp.change ? mainWindow._teads_amp.change.intersectionRect.height / mainWindow._teads_amp.change.boundingClientRect.height : 0;
            }
            if (teads.Context.isIABSafeFrame()) {
                var geom = mainWindow.$sf.ext.geom();
                return geom && geom.self ? geom.self.yiv : 0;
            }
            if (!elementHeight) {
                return -1;
            }
            var windowSize = teads.Dom.getWindowSize(mainWindow);
            var rect = teads.Dom.getBoundingClientRect(element);
            var size = rect.top > 0 ? windowSize.height - rect.top : rect.top + elementHeight;
            var percent = size / elementHeight;
            if (!allowNegative) {
                percent = percent > 0 ? percent : 0;
                percent = percent < 1 ? percent : 1;
            }
            return percent;
        };
        HTMLHelper.findFloatingHeaders = function (win, excludeElements) {
            if (win === void 0) { win = window; }
            if (excludeElements === void 0) { excludeElements = []; }
            var floatingHeaders = [];
            var windowSize = teads.Dom.getWindowSize(win);
            var x = windowSize.width / 2;
            var maxHeight = windowSize.height * HTMLHelper.MAX_FLOATING_TOP;
            var step = maxHeight * HTMLHelper.MAX_FLOATING_TOP;
            var element;
            var floatingParents;
            var style;
            for (var y = 1; y < maxHeight; y += step) {
                element = win.document.elementFromPoint(x, y);
                floatingParents = teads.ArrayHelper.filter(HTMLHelper.findParentElements(element), function (el) {
                    style = win.getComputedStyle(el);
                    return style.position === 'fixed' && (style.bottom === 'auto' || style.bottom === 'inherit');
                });
                floatingHeaders = floatingHeaders.concat(floatingParents);
            }
            var result = [];
            teads.ArrayHelper.forEach(floatingHeaders, function (el) {
                if (teads.ArrayHelper.indexOf(result, el) < 0 && teads.ArrayHelper.indexOf(excludeElements, el) < 0) {
                    result.push(el);
                }
            });
            return result;
        };
        HTMLHelper.getRealVisibilityState = function (element) {
            var realVisibilityState = true;
            if (!teads.Dom.isHTMLElement(element)) {
                realVisibilityState = false;
            }
            var win = HTMLHelper.getWindow(element) || window;
            var computedStyle = win.getComputedStyle(element);
            if (realVisibilityState && computedStyle.display === 'none') {
                realVisibilityState = false;
            }
            if (realVisibilityState) {
                var clientRect = teads.Dom.getBoundingClientRect(element);
                var overflowHidden = computedStyle.overflowX === 'hidden' || computedStyle.overflowY === 'hidden';
                if (clientRect.height < 4 && clientRect.width < 4 && overflowHidden) {
                    realVisibilityState = false;
                }
            }
            var parentElement = HTMLHelper.getParentElement(element);
            if (realVisibilityState && !!parentElement) {
                realVisibilityState = HTMLHelper.getRealVisibilityState(parentElement);
            }
            return realVisibilityState;
        };
        HTMLHelper.getCSSRules = function (element) {
            var sheets = HTMLHelper.getWindow(element).document.styleSheets;
            var cssRules = [];
            element.matches = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector;
            if (teads.Utils.isFunction(element.matches)) {
                for (var sheet in sheets) {
                    var styleSheet = sheets[sheet];
                    var rules = styleSheet.rules || styleSheet.cssRules;
                    for (var rule in rules) {
                        var styleRule = rules[rule];
                        if (element.matches(styleRule.selectorText)) {
                            cssRules.push(styleRule);
                        }
                    }
                }
            }
            return cssRules;
        };
        HTMLHelper.copyCSSRules = function (from, to, rulesToCopy) {
            var cssRules = HTMLHelper.getCSSRules(from);
            teads.ArrayHelper.forEach(cssRules, function (cssRule) {
                teads.ArrayHelper.forEach(rulesToCopy, function (wantedRule) {
                    var value = cssRule.style.getPropertyValue(wantedRule);
                    if (value && !to.style[wantedRule] && !to.getAttribute(wantedRule)) {
                        to.style[wantedRule] = value;
                    }
                });
            });
        };
        HTMLHelper.getParentElement = function (element) {
            var parentElement = null;
            if (teads.Dom.isHTMLElement(element)) {
                parentElement = element.parentElement;
            }
            return parentElement;
        };
        return HTMLHelper;
    }());
    HTMLHelper.MAX_FLOATING_TOP = teads.Context.isDesktop() ? 0.1 : 0.15;
    teads.HTMLHelper = HTMLHelper;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var Request = (function () {
        function Request() {
        }
        Request.createXmlHttpRequest = function () {
            var req = null;
            if (window.XMLHttpRequest) {
                req = new XMLHttpRequest();
            }
            if (req && !('withCredentials' in req)) {
                req = window.XDomainRequest ? new window.XDomainRequest() : null;
            }
            if (!req) {
                try {
                    req = new window.ActiveXObject('MSXML2.XMLHTTP.6.0');
                }
                catch (err) {
                    try {
                        req = new window.ActiveXObject('MSXML2.XMLHTTP.3.0');
                    }
                    catch (err) {
                        throw new Error('could not create XMLHttpRequest nor ActiveXObject');
                    }
                }
                req.responseType = 'msxml-document';
            }
            return req;
        };
        Request.isXMLHttpRequest = function (req) {
            return req instanceof XMLHttpRequest;
        };
        return Request;
    }());
    teads.Request = Request;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads_1) {
    teads_1.WIGO_DEBUG_KEY = teads_1.WIGO_DEBUG_KEY || null;
    var Wigo = (function () {
        function Wigo() {
            var _this = this;
            this.domain = /teads\.(tv|net:\d+|tech:\d+)$/;
            this.color = 'blue';
            this.statusDetails = '';
            this.bottomPxPosition = 10;
            this.position = 1;
            this.buttonHeight = 0;
            this.elapsedTime = 0;
            this.logfile = {
                context: (teads_1.Context.getDevice().toString() + '-' + teads_1.Context.getOS().toString() + '-' + teads_1.Context.getBrowser().toString()).replace(/\|/g, ' '),
                url: location.href,
                steps: [],
                logs: [],
                timeline: []
            };
            var windows = teads_1.HTMLHelper.findParentWindows(document.body);
            this.topWindow = windows.pop() || window;
            if (!teads_1.WIGO_DEBUG_KEY) {
                var onMessageListener = function (e) {
                    var wld = e.data.wigoLiveDebug;
                    if (e.origin.match(_this.domain)) {
                        if (wld && wld.length && wld.length > 1) {
                            teads_1.WIGO_DEBUG_KEY = wld[1];
                            _this.createDebugButton(_this.color);
                            _this.recordUserActions();
                        }
                    }
                };
                try {
                    this.topWindow.addEventListener('message', onMessageListener);
                }
                catch (e) {
                    this.topWindow = window;
                    this.topWindow.addEventListener('message', onMessageListener);
                }
            }
            else {
                this.createDebugButton(this.color);
                this.recordUserActions();
            }
        }
        Wigo.setTotalInstances = function (totalInstances) {
            Wigo.totalInstances = totalInstances;
        };
        Wigo.prototype.setPlayerContainer = function (playerContainer) {
            this.playerContainer = playerContainer;
        };
        Wigo.prototype.valid = function (step, substep, info, infoType) {
            this.addValidEvent(step, substep, {
                store: info,
                type: infoType
            });
            if (infoType === Wigo.infoType.ERROR) {
                var msg = '';
                if (typeof info === 'string') {
                    msg = info;
                }
                else if (info.message) {
                    if (info.id) {
                        msg = info.id + ' - ';
                    }
                    msg += info.message;
                }
                else if (info.length) {
                    msg = info;
                }
                else {
                    msg = teads_1.JSON.stringify(info);
                }
                this.setStatus(false, msg);
            }
            else if (step === 3 && substep === 2) {
                this.setStatus(true, 'AdLoaded');
            }
            else if (step === 3 && substep === 3) {
                this.setStatus(true, 'AdStarted');
            }
        };
        Wigo.prototype.vastEvent = function (name, time, percent, pixels) {
            this.addValidEvent(0, 0, {
                store: {
                    name: name,
                    time: time,
                    percent: percent,
                    pixels: pixels
                },
                type: Wigo.infoType.VAST_EVENT
            });
            if (name === 'complete') {
                this.setStatus(true, 'AdComplete');
            }
            else if (name === 'pause') {
                this.setStatus(true, 'AdPaused');
                this.lastTracking = 'pause';
            }
            else if (this.lastTracking === 'pause') {
                this.lastTracking = null;
            }
            else if (name === 'progress') {
                var currentTime = time === 'undefined' ? '' : time.split('.')[0] + 's';
                this.setStatus(true, 'AdPlaying: ' + currentTime);
            }
        };
        Wigo.prototype.setStatus = function (valid, details) {
            if (details === void 0) { details = ''; }
            var color = valid ? 'green' : 'red';
            if (this.button) {
                this.status.style.backgroundColor = color;
                this.status.style.display = 'block';
                this.loader.style.display = 'none';
                this.status.innerHTML = details;
            }
            else {
                this.color = color;
                this.statusDetails = details;
            }
        };
        Wigo.prototype.moveButton = function (position) {
            this.bottomPxPosition = Wigo.initialBottomPosition + (position - 1) * Wigo.bottomPxInterval;
            this.position = position;
            if (this.button) {
                this.button.style.setProperty('bottom', this.bottomPxPosition + 'px');
            }
        };
        Wigo.prototype.followPlayer = function () {
            var playerContainerRect = teads_1.Dom.getBoundingClientRect(this.playerContainer);
            var maxTop = this.topWindow.innerHeight - this.buttonHeight - (Wigo.initialBottomPosition + (Wigo.totalInstances - this.position) * Wigo.bottomPxInterval);
            var toBottom = this.topWindow.innerHeight - playerContainerRect.bottom + playerContainerRect.height / 2 - this.buttonHeight / 2;
            var toRight = 10;
            if (toBottom < this.bottomPxPosition) {
                toBottom = this.bottomPxPosition;
            }
            else if (toBottom > maxTop) {
                toBottom = maxTop;
            }
            else {
                toRight = 50;
            }
            this.button.style.setProperty('bottom', toBottom + 'px');
            this.button.style.setProperty('right', toRight + 'px');
        };
        Wigo.prototype.recordUserActions = function () {
            var _this = this;
            if (this.elapsedTime < 300000) {
                setTimeout(function () {
                    var lastTimeEvent = _this.logfile.timeline[_this.logfile.timeline.length - 1];
                    var windowSize = teads_1.Dom.getWindowSize(_this.topWindow);
                    var scrollLeft = teads_1.Dom.getScrollLeft(_this.topWindow);
                    var scrollTop = teads_1.Dom.getScrollTop(_this.topWindow);
                    if (!lastTimeEvent || _this.hasInteracted(lastTimeEvent, windowSize, scrollLeft, scrollTop)) {
                        var newTimeEvent = {
                            time: _this.elapsedTime,
                            scrollX: scrollLeft,
                            scrollY: scrollTop,
                            screenWidth: windowSize.width,
                            screenHeight: windowSize.height,
                            player: {
                                top: 0,
                                height: 0,
                                left: 0,
                                width: 0
                            }
                        };
                        if (_this.playerContainer) {
                            var playerRect = teads_1.Dom.getBoundingClientRect(_this.playerContainer);
                            newTimeEvent.player = {
                                top: playerRect.top,
                                height: playerRect.height,
                                left: playerRect.left,
                                width: playerRect.width
                            };
                        }
                        _this.logfile.timeline.push(newTimeEvent);
                    }
                    _this.elapsedTime += Wigo.recordUserActionsTiming;
                    _this.recordUserActions();
                }, Wigo.recordUserActionsTiming);
            }
        };
        Wigo.prototype.addValidEvent = function (step, substep, info) {
            var ve = {
                step: step,
                substep: substep,
                info: info
            };
            this.logfile.steps.push(ve);
        };
        Wigo.prototype.createDebugButton = function (color) {
            var _this = this;
            if (teads_1.WIGO_DEBUG_KEY && !this.button) {
                var container = this.topWindow.document.createElement('div');
                container.innerHTML = '<div class="teads-wigo-btn"><div style="position: absolute; left:0;top:0;padding: 0 4%; border: 1px solid white; color: white; font-size: 10px; text-align: center; font-family: Arial; line-height:16px;"></div><div style="border: 6px solid #f3f3f3; border-top: 6px solid #3498db; border-radius: 50%; position: absolute; left: 60%; width: 32%; height: 32%; -webkit-animation: wigospin 2s linear infinite; animation: wigospin 2s linear infinite"></div>\n' +
'  <style type="text/css">\n' +
'    .teads-wigo-btn {\n' +
'      position: fixed;\n' +
'      bottom: 10px;\n' +
'      right: 10px;\n' +
'      z-index: 2147483647;\n' +
'      width: 75px;\n' +
'      height: 75px;\n' +
'      cursor: pointer;\n' +
'      background-image: url(\'https://cdn.teads.tv/media/format/v3/assets/default/img/wigo.png?v2\');\n' +
'      transition: right ease 0.2s;\n' +
'    }\n' +
'    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {\n' +
'        /* Retina */\n' +
'        .teads-wigo-btn {\n' +
'          background-size: 75px 75px;\n' +
'          background-image: url(\'https://cdn.teads.tv/media/format/v3/assets/default/img/wigo-2x.png\');\n' +
'        }\n' +
'    }\n' +
'    @-webkit-keyframes wigospin {\n' +
'      0% { -webkit-transform: rotate(0deg);}\n' +
'      100% { -webkit-transform: rotate(360deg);}\n' +
'    }\n' +
'    @keyframes wigospin {\n' +
'      0% { transform: rotate(0deg); }\n' +
'      100% { transform: rotate(360deg); }\n' +
'    }\n' +
'  </style>\n' +
'</div>\n' +
'';
                this.button = container.firstChild;
                this.button.onclick = function (e) {
                    _this.saveFile();
                    e.stopPropagation();
                };
                this.button.style.setProperty('bottom', this.bottomPxPosition + 'px');
                this.topWindow.document.body.appendChild(this.button);
                this.status = this.button.firstChild;
                this.status.style.backgroundColor = color;
                this.status.innerHTML = this.statusDetails;
                this.loader = this.status.nextSibling;
                if (this.color !== 'blue') {
                    this.status.style.display = 'block';
                    this.loader.style.display = 'none';
                }
                else {
                    this.status.style.display = 'none';
                    this.loader.style.display = 'block';
                }
                this.buttonHeight = teads_1.Dom.getBoundingClientRect(this.button).height;
                if (teads_1.Context.isAmp() && teads.helper.AmpResize) {
                    if (color === 'red') {
                        teads.helper.AmpResize.ratio = 4;
                    }
                    setTimeout(function () { return _this.forceAmpOpen(); }, 1000);
                }
            }
        };
        Wigo.prototype.forceAmpOpen = function () {
            var _this = this;
            if (!teads.helper.AmpResize.isVisible()) {
                var ampTimer = setTimeout(function () { return _this.forceAmpOpen(); }, 1000);
                teads.helper.AmpResize.open(function () {
                    _this.button.style.display = 'none';
                    setTimeout(function () { return _this.button.style.display = 'block'; }, 100);
                    clearTimeout(ampTimer);
                });
            }
        };
        Wigo.prototype.saveFile = function () {
            var _this = this;
            if (teads_1.WIGO_DEBUG_KEY) {
                this.button.onclick = function (e) {
                    e.stopPropagation();
                };
                this.logfile.logs = teads_1.Logger.getFullLogs();
                var name_1 = teads_1.WIGO_DEBUG_KEY + '_' + teads_1.date.now() + '.json';
                var resp_1 = function () {
                    setTimeout(function () {
                        _this.button.onclick = function (e) {
                            _this.saveFile();
                            e.stopPropagation();
                        };
                    }, 500);
                };
                var req = teads_1.Request.createXmlHttpRequest();
                req.open('PUT', Wigo.serviceUrl + '/livedebug/upload/' + name_1, true);
                req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                req.onload = function () { resp_1(); };
                req.send(teads_1.JSON.stringify(this.logfile, true));
                req.onerror = function () { resp_1(); };
                window.open(Wigo.serviceUrl + '/livedebug?file=' + name_1);
            }
        };
        Wigo.prototype.hasInteracted = function (timeEvent, windowSize, scrollLeft, scrollTop) {
            if (timeEvent.scrollY !== scrollTop || timeEvent.scrollX !== scrollLeft || timeEvent.screenHeight !== windowSize.height || timeEvent.screenWidth !== windowSize.width) {
                return true;
            }
            else {
                return false;
            }
        };
        return Wigo;
    }());
    Wigo.infoType = {
        MODAL: 'modal',
        STRING: 'string',
        VAST_EVENT: 'vastEvent',
        ERROR: 'error'
    };
    Wigo.bottomPxInterval = 80;
    Wigo.recordUserActionsTiming = 1000;
    Wigo.serviceUrl = teads_1.Utils.getProtocol() + (location.hostname.match(/(sandbox\.teads\.net|par2\.teads\.tech)$/) ? '//' + location.hostname + ':18091' : '//wigo.teads.tv');
    Wigo.totalInstances = 0;
    Wigo.initialBottomPosition = 10;
    teads_1.Wigo = Wigo;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var LogSender = (function () {
        function LogSender(collectorUrl, formattingType) {
            this.collectorUrl = collectorUrl;
            this.collectorUrl += this.collectorUrl.indexOf('?') < 0 ? '?' : '&';
            if (formattingType === LogSender.FORMATTING_TYPES.PIPE_SEPARATE) {
                this.format = LogSender.pipeSeparateData;
            }
            else {
                this.format = LogSender.stringifyData;
            }
        }
        LogSender.stringify = function (obj) {
            var str;
            try {
                str = teads.JSON.stringify(obj);
            }
            catch (e) {
                if (obj.toString) {
                    str = obj.toString();
                }
            }
            return str;
        };
        LogSender.stringifyData = function (data) {
            if (data.length) {
                for (var i in data) {
                    if (typeof data[i] === 'function') {
                        data[i] = data[i].toString();
                    }
                    else if (typeof data[i] === 'object') {
                        data[i] = LogSender.stringify(data[i]);
                    }
                }
            }
            else {
                data = LogSender.stringify(data);
            }
            return data.toString ? data.toString() : data;
        };
        LogSender.pipeSeparateData = function (data) {
            var arr = [];
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    arr.push(data[key].toString());
                }
            }
            return arr.join('|');
        };
        LogSender.prototype.track = function (data, prefix) {
            if (prefix === void 0) { prefix = ''; }
            try {
                var url = this.collectorUrl + encodeURIComponent(prefix) + encodeURIComponent(data);
                var img = new Image();
                img.src = url;
            }
            catch (e) { }
        };
        return LogSender;
    }());
    LogSender.FORMATTING_TYPES = {
        JSON: 'JSON',
        PIPE_SEPARATE: 'PIPE_SEPARATE'
    };
    teads.LogSender = LogSender;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var Sumologic = (function () {
        function Sumologic() {
            this.logger = new teads.Logger('Sumologic');
            this.logStorage = [];
            this.initialized = false;
        }
        Sumologic.prototype.init = function (config, sessionId, version, sampling) {
            if (version === void 0) { version = null; }
            if (sampling === void 0) { sampling = null; }
            if (this.initialized) {
                this.logger.warn('Sumologic instance already initialized, aborting.');
                return;
            }
            this.config = config;
            this.sessionId = sessionId.getOrElse(function () { return teads.StringHelper.rand(10, false); });
            Sumologic.version = version || Sumologic.version;
            this.sampling = sampling || Sumologic.SAMPLING_RATE;
            this.logSender = new teads.LogSender(this.config.collector, this.config.formattingType);
            this.logger.debug("Sumologic init with sessionId=" + this.sessionId + ", sampling=" + this.sampling);
            this.initialized = true;
            this.unstackLogStorage();
        };
        Sumologic.prototype.isInitialized = function () {
            return this.initialized;
        };
        Sumologic.prototype.getSessionId = function () {
            return this.initialized ? this.sessionId : null;
        };
        Sumologic.prototype.sendMetadata = function (log, macros, specificSampling) {
            if (macros === void 0) { macros = {}; }
            if (this.initialized) {
                this.send(this.config.logLevels.METADATA, log, macros, specificSampling);
            }
            else {
                this.logStorage.push(['sendMetadata', arguments]);
            }
        };
        Sumologic.prototype.sendError = function (log, macros, specificSampling) {
            if (macros === void 0) { macros = {}; }
            if (this.initialized) {
                this.send(this.config.logLevels.ERROR, log, macros, specificSampling);
            }
            else {
                this.logStorage.push(['sendError', arguments]);
            }
        };
        Sumologic.prototype.sendWarning = function (log, macros, specificSampling) {
            if (macros === void 0) { macros = {}; }
            if (this.initialized) {
                this.send(this.config.logLevels.WARNING, log, macros, specificSampling);
            }
            else {
                this.logStorage.push(['sendWarning', arguments]);
            }
        };
        Sumologic.prototype.sendInfo = function (log, macros, specificSampling) {
            if (macros === void 0) { macros = {}; }
            if (this.initialized) {
                this.send(this.config.logLevels.INFO, log, macros, specificSampling);
            }
            else {
                this.logStorage.push(['sendInfo', arguments]);
            }
        };
        Sumologic.prototype.send = function (level, log, macros, specificSampling) {
            if (macros === void 0) { macros = {}; }
            if (this.initialized) {
                var sampling = specificSampling || this.sampling;
                var canSend = Sumologic.RANDOM <= sampling;
                var logPrefix = this.getLogPrefix(this.config.prefixPattern, level, this.sessionId, macros);
                var formattedLog = this.logSender.format(log);
                if (canSend) {
                    this.logger.debug('Sent to collector', logPrefix, log);
                    this.logSender.track(formattedLog, logPrefix);
                }
                else {
                    this.logger.debug('Did not send to collector (sampling)', logPrefix, log);
                }
            }
            else {
                this.logger.warn('Could not send logs, Sumologic instance not initialized.');
                this.logStorage.push(['send', arguments]);
            }
        };
        Sumologic.prototype.sendRaw = function (log, specificSampling) {
            if (this.initialized) {
                var sampling = specificSampling || this.sampling;
                var canSend = Sumologic.RANDOM <= sampling;
                if (canSend) {
                    this.logger.debug('Sent to collector', log);
                    this.logSender.track(log);
                }
                else {
                    this.logger.debug('Did not send to collector (sampling)', log);
                }
            }
            else {
                this.logger.warn('Could not send logs, Sumologic instance not initialized.');
                this.logStorage.push(['sendRaw', arguments]);
            }
        };
        Sumologic.prototype.setAdType = function (adType) {
            Sumologic.adType = adType;
        };
        Sumologic.prototype.unstackLogStorage = function () {
            var _this = this;
            teads.ArrayHelper.forEach(this.logStorage, function (args) { return _this[args[0]].apply(_this, args[1]); });
            this.logStorage = [];
        };
        Sumologic.prototype.getLogPrefix = function (pattern, level, sessionId, macros) {
            var defaultMacros = {
                level: level,
                timestamp: Sumologic.version + "|" + teads.Context.getFullContext() + "|" + Sumologic.adType,
                sessionId: sessionId
            };
            macros = teads.Utils.extend(defaultMacros, macros);
            var logPrefix = pattern;
            for (var key in macros) {
                if (macros.hasOwnProperty(key)) {
                    logPrefix = logPrefix.replace(key, macros[key]);
                }
            }
            return logPrefix;
        };
        return Sumologic;
    }());
    Sumologic.SAMPLING_RATE = 0.05;
    Sumologic.RANDOM = Math.random();
    Sumologic.COLLECTORS = {
        FORMAT: 'https://endpoint2.collection.sumologic.com/receiver/v1/http/ZaVnC4dhaV3tMuL-jxvu514sKTR1JLPJH0zZLzvxn3qMwWPdO_mBRbSGTyZgi2P4CqAJ4tfCX6IriPgecDkMFRxDm1GAGUben7xo9S92iY-h9z-o4eCwqg==',
        PLAYER: 'https://endpoint2.collection.sumologic.com/receiver/v1/http/ZaVnC4dhaV2OstA92K8Xbj_kskBs5tjvp3fnz5Kd87xTE6v-AevmCgsG9SX_kqjlNgr2zKEpTQZWkuy61qzMee2njNfpDU2z7EIYjtXb-wRLLbHhGRVIOg==',
        ROUTER: 'https://endpoint2.collection.sumologic.com/receiver/v1/http/ZaVnC4dhaV0yoMPXbPr1DHlBdbxeDuo3K5k3sGyLYmTOy4VGTwjLazFajGH6fqEKM4WlaPVtnZSCp4oebZS2mDiHAfUyzLxdRx_1JbayoNzbvQ26FTVmqQ==',
    };
    Sumologic.PREFIX_PATTERNS = {
        CLASSIC: '[timestamp][sessionId][level] ',
        LIGHT: 'sessionId>type>subtype>level>pid ',
    };
    Sumologic.LOG_LEVELS = {
        CLASSIC: {
            INFO: 'info',
            METADATA: 'metadata',
            WARNING: 'warning',
            ERROR: 'error',
        },
        LIGHT: {
            INFO: 'info',
            METADATA: 'meta',
            WARNING: 'warn',
            ERROR: 'err',
        },
    };
    Sumologic.CONFIGS = {
        FORMAT: {
            collector: Sumologic.COLLECTORS.FORMAT,
            prefixPattern: Sumologic.PREFIX_PATTERNS.CLASSIC,
            logLevels: Sumologic.LOG_LEVELS.CLASSIC,
            formattingType: teads.LogSender.FORMATTING_TYPES.JSON,
        },
        PLAYER: {
            collector: Sumologic.COLLECTORS.PLAYER,
            prefixPattern: Sumologic.PREFIX_PATTERNS.CLASSIC,
            logLevels: Sumologic.LOG_LEVELS.CLASSIC,
            formattingType: teads.LogSender.FORMATTING_TYPES.JSON,
        },
        ROUTER: {
            collector: Sumologic.COLLECTORS.ROUTER,
            prefixPattern: Sumologic.PREFIX_PATTERNS.CLASSIC,
            logLevels: Sumologic.LOG_LEVELS.CLASSIC,
            formattingType: teads.LogSender.FORMATTING_TYPES.JSON,
        }
    };
    Sumologic.version = '';
    Sumologic.adType = '';
    teads.Sumologic = Sumologic;
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var vpaid;
    (function (vpaid) {
        var VPAIDEvent = (function () {
            function VPAIDEvent(type, data) {
                if (data === void 0) { data = null; }
                this.type = type;
                this.data = data;
            }
            return VPAIDEvent;
        }());
        VPAIDEvent.AdLoaded = 'AdLoaded';
        VPAIDEvent.AdStarted = 'AdStarted';
        VPAIDEvent.AdStopped = 'AdStopped';
        VPAIDEvent.AdSkipped = 'AdSkipped';
        VPAIDEvent.AdLinearChange = 'AdLinearChange';
        VPAIDEvent.AdSizeChange = 'AdSizeChange';
        VPAIDEvent.AdExpandedChange = 'AdExpandedChange';
        VPAIDEvent.AdSkippableStateChange = 'AdSkippableStateChange';
        VPAIDEvent.AdRemainingTimeChange = 'AdRemainingTimeChange';
        VPAIDEvent.AdDurationChange = 'AdDurationChange';
        VPAIDEvent.AdVolumeChange = 'AdVolumeChange';
        VPAIDEvent.AdImpression = 'AdImpression';
        VPAIDEvent.AdVideoStart = 'AdVideoStart';
        VPAIDEvent.AdVideoFirstQuartile = 'AdVideoFirstQuartile';
        VPAIDEvent.AdVideoMidpoint = 'AdVideoMidpoint';
        VPAIDEvent.AdVideoThirdQuartile = 'AdVideoThirdQuartile';
        VPAIDEvent.AdVideoComplete = 'AdVideoComplete';
        VPAIDEvent.AdClickThru = 'AdClickThru';
        VPAIDEvent.AdInteraction = 'AdInteraction';
        VPAIDEvent.AdUserAcceptInvitation = 'AdUserAcceptInvitation';
        VPAIDEvent.AdUserMinimize = 'AdUserMinimize';
        VPAIDEvent.AdUserClose = 'AdUserClose';
        VPAIDEvent.AdPaused = 'AdPaused';
        VPAIDEvent.AdPlaying = 'AdPlaying';
        VPAIDEvent.AdLog = 'AdLog';
        VPAIDEvent.AdError = 'AdError';
        vpaid.VPAIDEvent = VPAIDEvent;
    })(vpaid = teads.vpaid || (teads.vpaid = {}));
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var router;
    (function (router) {
        var CustomDeploy = (function () {
            function CustomDeploy(config) {
                this.config = config;
                this.currentUtcDate = new Date();
                this.isAfterStart = false;
                this.isBeforeEnd = true;
                this.mathRandom = Math.random();
                if (!this.config || !(this.config.startUtcDate instanceof Date) || !(this.config.endUtcDate instanceof Date)) {
                    throw router.ProgressiveDeploy.INIT_DATE_EXCEPTION;
                }
                this.isAfterStart = this.currentUtcDate.getTime() >= this.config.startUtcDate.getTime();
                this.isBeforeEnd = this.currentUtcDate.getTime() <= this.config.endUtcDate.getTime();
            }
            CustomDeploy.prototype.isActive = function () {
                return this.isBeforeEnd && this.isAfterStart;
            };
            CustomDeploy.prototype.getStartUtcDate = function () {
                return this.config.startUtcDate;
            };
            return CustomDeploy;
        }());
        CustomDeploy.INIT_DATE_EXCEPTION = new Error('Start and end dates should be Date objects.');
        router.CustomDeploy = CustomDeploy;
    })(router = teads.router || (teads.router = {}));
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var router;
    (function (router) {
        var ProgressiveDeploy = (function (_super) {
            __extends(ProgressiveDeploy, _super);
            function ProgressiveDeploy(config) {
                var _this = _super.call(this, config) || this;
                _this.config = config;
                if (typeof _this.config.previousVersion !== 'string' || !_this.config.previousVersion) {
                    throw ProgressiveDeploy.INIT_VERSION_EXCEPTION;
                }
                return _this;
            }
            ProgressiveDeploy.prototype.getFormatVersion = function (pid, format) {
                if (pid === void 0) { pid = null; }
                if (format === void 0) { format = null; }
                if (!this.isActive()) {
                    return router.Constant.FORMAT_VERSIONS.V3;
                }
                var previousVersion = router.Constant.FORMAT_VERSIONS[this.config.previousVersion] || router.Constant.FORMAT_VERSIONS.V3;
                return this.mathRandom <= this.getSampling() ? previousVersion : router.Constant.FORMAT_VERSIONS.V3;
            };
            ProgressiveDeploy.prototype.getSampling = function () {
                var timeDiff = this.config.endUtcDate.getTime() - this.config.startUtcDate.getTime();
                if (timeDiff > 0) {
                    return (this.currentUtcDate.getTime() - this.config.startUtcDate.getTime()) / timeDiff;
                }
                return 0;
            };
            return ProgressiveDeploy;
        }(router.CustomDeploy));
        ProgressiveDeploy.INIT_VERSION_EXCEPTION = new Error('Previous version should be a string.');
        router.ProgressiveDeploy = ProgressiveDeploy;
    })(router = teads.router || (teads.router = {}));
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var router;
    (function (router) {
        var AbTestingSession = (function (_super) {
            __extends(AbTestingSession, _super);
            function AbTestingSession(config) {
                var _this = _super.call(this, config) || this;
                _this.config = config;
                _this.isBeforeProgressiveEnd = false;
                if (typeof _this.config.alternateVersion !== 'string' || !_this.config.alternateVersion) {
                    throw AbTestingSession.INIT_VERSION_EXCEPTION;
                }
                _this.isForAllPids = !(_this.config.pid instanceof RegExp);
                _this.isForAllFormats = !(_this.config.format instanceof RegExp);
                _this.isForAllDevices = !(_this.config.device instanceof RegExp);
                _this.isForAllOs = !(_this.config.os instanceof RegExp);
                _this.isForAllBrowsers = !(_this.config.browser instanceof RegExp);
                if (typeof _this.config.sampling !== 'number' || _this.config.sampling <= 0 || _this.config.sampling > 1) {
                    _this.config.sampling = 1;
                }
                if (_this.isForAllPids && _this.isForAllFormats && _this.isForAllDevices && _this.isForAllOs && _this.isForAllBrowsers && _this.config.sampling === 1) {
                    throw AbTestingSession.INIT_TARGET_EXCEPTION;
                }
                if (_this.config.progressiveEndUtcDate instanceof Date) {
                    var isProgressive = _this.config.startUtcDate.getTime() <= _this.config.progressiveEndUtcDate.getTime();
                    _this.isBeforeProgressiveEnd = isProgressive && (_this.currentUtcDate.getTime() <= _this.config.progressiveEndUtcDate.getTime());
                }
                return _this;
            }
            AbTestingSession.prototype.getFormatVersion = function (pid, format) {
                if (!this.isTargeted(pid, format) || !this.isActive()) {
                    return router.Constant.FORMAT_VERSIONS.V3;
                }
                var alternateVersion = router.Constant.FORMAT_VERSIONS[this.config.alternateVersion] || router.Constant.FORMAT_VERSIONS.V3;
                if (this.getSampling() === 1) {
                    return alternateVersion;
                }
                return this.mathRandom <= this.getSampling() ? alternateVersion : router.Constant.FORMAT_VERSIONS.V3;
            };
            AbTestingSession.prototype.getSampling = function () {
                var coeff = 0;
                if (!this.isActive()) {
                    coeff = 0;
                }
                else if (!this.isBeforeProgressiveEnd) {
                    coeff = 1;
                }
                else {
                    var timeDiff = this.config.progressiveEndUtcDate.getTime() - this.config.startUtcDate.getTime();
                    if (timeDiff > 0) {
                        coeff = (this.currentUtcDate.getTime() - this.config.startUtcDate.getTime()) / timeDiff;
                    }
                    else {
                        coeff = 1;
                    }
                }
                return coeff * this.config.sampling;
            };
            AbTestingSession.prototype.isTargeted = function (pid, format) {
                var okPid = this.isForAllPids || this.config.pid.test(pid);
                var okFormat = this.isForAllFormats || this.config.format.test(format);
                var okDevice = this.isForAllDevices || this.config.device.test(teads.Context.getDevice().type);
                var okOs = this.isForAllOs || this.config.os.test(teads.Context.getOS().name);
                var okBrowser = this.isForAllBrowsers || this.config.browser.test(teads.Context.getBrowser().name);
                return okPid && okFormat && okDevice && okOs && okBrowser;
            };
            return AbTestingSession;
        }(router.CustomDeploy));
        AbTestingSession.INIT_VERSION_EXCEPTION = new Error('Previous version should be a string.');
        AbTestingSession.INIT_TARGET_EXCEPTION = new Error('An A/B Testing session cannot target everyone! Please create a Progressive Deploy instead.');
        router.AbTestingSession = AbTestingSession;
    })(router = teads.router || (teads.router = {}));
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var router;
    (function (router) {
        router.V2_PATH = router.V2_PATH;
        router.V3_PATH = router.V3_PATH;
        var Constant = (function () {
            function Constant() {
            }
            return Constant;
        }());
        Constant.ROUTER_DISABLED = false;
        Constant.CDN_PATH = 'cdn.teads.tv/media';
        Constant.FORMAT_VERSIONS = {
            V2: 'V2',
            V3: 'V3',
            V3_FUNNEL: 'V3_FUNNEL',
            V3_TOP_LEVEL_DEPENDENCIES: 'V3_TOP_LEVEL_DEPENDENCIES',
        };
        Constant.FORMAT_PATHS = {
            V2: router.V2_PATH || teads.Utils.getProtocol() + "//" + Constant.CDN_PATH + "/format/v2/all-v2.js",
            V3: router.V3_PATH || teads.Utils.getProtocol() + "//" + Constant.CDN_PATH + "/format/v3/teads-format.min.js",
            V3_FUNNEL: teads.Utils.getProtocol() + "//" + Constant.CDN_PATH + "/format/release/funnel/teads-format.min.js",
            V3_TOP_LEVEL_DEPENDENCIES: teads.Utils.getProtocol() + "//" + Constant.CDN_PATH + "/format/release/top-level-dependencies/teads-format.min.js"
        };
        Constant.RELEASE_PATH_PATTERN = teads.Utils.getProtocol() + "//" + Constant.CDN_PATH + "/format/release/{release}/teads-format.min.js";
        Constant.PLAYER_PATH = teads.Utils.getProtocol() + "//" + Constant.CDN_PATH + "/player";
        Constant.PID_FIX_CSS_LEMONDE_PADDING = /^(32117|32118|32119|32736|32740|32124|32125|32126|32742|32743|32137|32138|32139|32746|32747|32144|32145|32146|32150|32151|32152|32750|32751)$/;
        Constant.PID_FIX_CSS_LEMONDE_WIDTH = /^(32111|32112|32113|32733|32735)$/;
        Constant.PID_FIX_CSS_CI_CH_HU = /^(32144|32145|32146|32150|32151|32152|32750|32751|32137|32138|32139|32746|32747)$/;
        Constant.PID_FIX_CSS_OBS = /^(32124|32125|32126|32742|32743)$/;
        Constant.PID_FIX_CSS_TELERAMA_IB = /^(32117|32118|32119|32736|32740)$/;
        Constant.PID_FIX_CSS_TELERAMA_IR = /^(32114|32115|32693|32116|32694)$/;
        Constant.CALLBACK_VPAID_MAP = {
            skip: teads.vpaid.VPAIDEvent.AdSkipped,
            mute: 'mute',
            unmute: 'unmute',
            ad: teads.vpaid.VPAIDEvent.AdLoaded,
            pause: teads.vpaid.VPAIDEvent.AdPaused,
            play: teads.vpaid.VPAIDEvent.AdPlaying,
            loaded: teads.vpaid.VPAIDEvent.AdLoaded,
            finish: teads.vpaid.VPAIDEvent.AdStopped,
            launch: teads.vpaid.VPAIDEvent.AdStarted,
        };
        Constant.V3_FORMAT_REGEX = /^inread$/;
        Constant.BLACK_LIST_V3 = /^(25088|28361|32677|34805|34806|34807|35204|37669|37950|37951|40075|41910|41911|41912|41913|41914|41915|42268|42269|42270|42271|42272|42273|42274|42275|42780|42781|42838|42839|42840|43106|43107|43112|43113|45892|45897|45963|45964|48233|48578|48579|48581|48582|50382|53865|63116)$/;
        Constant.INBOARD_V3_WHITELIST = /^(22505|22675|22837|22855|22856|22857|22858|22859|23612|23613|23614|23615|23616|23617|23643|23647|23648|23650|23651|23654|23656|23657|23658|23669|23670|23672|23673|23674|23675|23676|23678|23679|23680|23681|23682|23683|23684|23686|23689|23690|23691|23692|23693|23694|23695|23696|23697|23698|23699|23700|23701|23702|23703|23704|23705|23706|23707|23708|23709|23710|23711|23712|23713|23714|23715|23716|23717|23718|23719|23721|23722|23723|23724|23725|23726|23727|23761|23762|23763|23764|23765|23766|23767|23768|23769|23770|23771|23772|23773|23774|23775|23776|23777|23778|23779|23780|23781|23782|23783|23784|23785|23786|23787|23788|23789|23790|23791|23792|23793|23794|23795|23796|23809|23810|23811|23812|23815|23816|23818|23819|23821|23823|23824|23825|23826|23827|23828|23829|23830|23831|23832|23833|23834|23835|23836|23837|23838|23840|23841|23842|23843|23844|23845|23846|23847|23848|23849|23850|23851|23852|23853|23854|23855|23856|23857|23858|23859|23860|23870|23873|23874|23875|23876|23877|23878|23879|23880|23881|23882|23883|23884|23885|23886|23887|23888|23889|23890|23891|23892|23893|23894|23895|23902|23903|23911|23912|23913|23914|23915|23916|23917|23918|23919|23920|23921|23922|23923|23924|23925|23926|23927|23928|23929|23930|23931|23932|23933|23934|23935|23936|23937|23938|23939|23940|23941|23942|23943|23944|23945|23946|23947|23954|23955|23956|23957|23958|23959|23960|23961|23962|23963|23964|23965|23966|23967|23968|23969|23970|23971|23972|23973|23974|23975|23976|23977|23978|23979|23980|23981|23982|23983|23984|23985|23986|23987|23988|23989|23990|23991|23992|23993|23994|23995|23996|23997|23998|23999|24000|24001|24002|24003|24004|24005|24006|24007|24008|24009|24010|24011|24012|24013|24014|24015|24016|24017|24018|24019|24020|24021|24022|24023|24196|24197|24198|24199|24201|24202|24203|24204|24205|24206|24207|24208|24209|24210|24211|24213|24214|24215|24216|24217|24316|24317|24318|24319|24320|24321|24322|24323|24324|24325|24326|24327|24346|24348|24349|24350|24351|24352|24353|24354|24355|24357|24358|24359|24360|24361|24371|24372|24373|24374|24375|24376|24377|24378|24379|24380|24381|24382|24383|24384|24385|24386|24387|24388|24389|24390|24391|24392|24393|24394|24395|24396|24397|24398|24399|24400|24401|24402|24403|24404|24405|24406|24407|24408|24409|24410|24411|24412|24413|24414|24415|24416|24417|24418|24419|24420|24421|24422|24423|24424|24425|24426|24427|24428|24429|24430|24431|24432|24433|24434|24435|24436|24438|24439|24440|24441|24442|24443|24444|24445|24446|24447|24448|24449|24450|24451|24452|24453|24454|24455|24456|24457|24458|24459|24460|24461|24463|24464|24465|24466|24467|24468|24469|24470|24471|24472|24473|24474|24475|24476|24477|24478|24485|25074|25275|25670|25678|25729|25794|25826|25864|25865|25945|26189|26201|26204|26609|27340|27342|27400|27456|27457|27458|27459|27460|27461|27462|27463|27464|27470|27471|27965|28273|28454|28675|28678|29494|29562|29762|29825|29890|30033|30140|30307|30321|30330|30398|30499|30774|30818|30907|30950|30952|30954|30962|31032|31034|31057|31067|31180|31295|31296|31297|31298|31299|31300|31301|31302|31304|31305|31306|31308|31310|31312|31313|31314|31315|31316|31320|31324|31391|31430|31528|31529|31530|31531|31532|31533|31534|31535|31536|31537|31539|31540|31541|31577|31578|31579|31580|31632|31644|31681|31682|31683|31685|31694|31731|31733|31734|31736|31737|31853|32111|32112|32113|32425|32428|32429|32432|32435|32447|32449|32451|32453|32457|32461|32510|32512|32594|32596|32622|32624|32626|32630|32632|32636|32640|32642|32644|32646|32650|32652|32654|32656|32658|32660|32662|32733|32735|32801|32806|32811|32813|32823|32824|32825|32826|32827|32828|32830|32832|32833|32835|32840|32842|32845|32850|32872|32874|32907|32910|32912|32914|32944|32945|33033|33102|33153|33154|33155|33347|33349|33354|33361|33363|33365|33371|33674|33688|33699|33702|33814|33930|33953|34106|34284|34320|34334|34342|34425|34426|34431|34432|34587|34596|34616|34626|34634|34635|34723|34724|34785|34793|34800|34832|34838|34993|35052|35083|35096|35102|35163|35237|35253|35254|35255|35257|35258|35259|35264|35353|35354|35430|35433|35499|35533|35546|35571|35607|35609|35611|35621|35634|35660|35666|35679|35688|35745|35794|35816|35818|35820|35822|35826|36177|36376|36385|36389|36393|36394|36397|36398|36401|36404|36405|36417|36423|36450|36453|36454|36560|36690|36693|36885|36896|36905|36951|36952|36953|36954|36968|36985|37000|37005|37007|37123|37137|37139|37254|37263|37266|37267|37269|37432|37440|37500|37652|37656|37664|37684|37703|37790|37812|37830|37885|37886|37887|37888|37889|37890|37891|37892|37932|38119|38242|38329|38342|38384|38387|38432|38530|38696|38702|39008|39372|39457|39852|39853|39854|39855|39856|39857|39860|39862|39864|39865|39866|39912|39956|39966|40268|40383|40637|40759|40894|40953|40978|41078|41079|41166|41167|41395|41400|41414|41434|41442|41492|41620|41647|41652|41655|41667|41872|41909|41988|42199|42201|42203|42225|42256|42336|42370|42653|42685|42687|42693|42707|42758|42759|42760|42763|42764|42826|42827|42874|42877|42926|43020|43021|43022|43023|43024|43025|43026|43028|43075|43336|43338|43341|43404|43484|43486|43491|43505|43507|43515|43516|43517|43528|43598|43815|43821|43835|43860|43918|43986|43988|43992|44020|44034|44036|44037|44038|44041|44042|44043|44044|44045|44046|44047|44049|44051|44053|44055|44057|44059|44061|44063|44285|44294|44319|44320|44330|44371|44375|44496|44563|44675|44706|44718|44723|44753|44754|44755|44756|44842|45017|45037|45244|45350|45453|45455|45456|45470|45471|45474|45573|45577|45608|45622|45625|45626|45627|45628|45629|45630|45631|45632|45633|45634|45635|45636|45637|45638|45639|45720|45855|45857|45861|45997|46012|46014|46036|46096|46097|46098|46101|46104|46107|46110|46112|46114|46116|46118|46120|46122|46124|46127|46130|46133|46135|46226|46281|46282|46335|46341|46435|46457|46459|46560|46561|46563|46675|46680|46778|46780|46862|46864|46865|46866|46867|46868|46869|46873|46875|46877|46895|47136|47162|47163|47311|47314|47318|47321|47327|47331|47340|47348|47354|47356|47371|47391|47438|47445|47454|47496|47500|47510|47535|47553|47554|47555|47556|47576|47578|47580|47588|47590|47592|47594|47596|47598|47858|47941|48131|48188|48341|48342|48442|48485|48486|48491|48505|48651|48658|48662|48666|48927|48929|48948|48949|48969|48989|49069|49178|49187|49223|49367|49404|49480|49486|49490|49492|49493|49494|49495|49496|49497|49498|49500|49501|49593|49594|49595|49596|49597|49598|49599|49678|49727|49746|49770|49771|49774|49776|49778|49780|49782|49784|49788|49790|49862|49871|49877|49881|49883|49884|49911|49915|49918|49922|49924|50031|50160|50161|50245|50263|50276|50373|50374|50375|50535|50633|50731|50892|50894|50926|50929|50931|50932|51284|51285|51371|51375|51478|51557|51573|51580|51689|51701|51702|51703|51704|51705|51706|51711|51716|51717|51718|51719|51720|51721|51722|51723|51724|51725|51726|51806|51807|51962|51964|51965|51972|52025|52045|52047|52086|52142|52209|52226|52287|52320|52321|52323|52324|52381|52510|52630|52636|52637|52638|52639|52830|52831|52845|52889|52892|52908|52911|52948|53207|53209|53211|53252|53279|53305|53327|53455|53521|53522|53523|53525|53705|53730|53739|53740|53799|53880|53896|53899|54328|54330|54331|54333|54519|54524|54525|54526|54527|54528|54529|54531|54532|54533|54534|54535|54536|54537|54538|54539|54540|54541|54542|54962|55213|55360|55402|55523|55533|55546|55607|55737|56095|56283|56406|56473|56776|57044|57054|57055|57056|57057|57058|57226|57312|57313|57315|57364|57367|57595|57596|57597|57723|57727|58058|58083|58184|58200|58201|58270|58282|58283|58284|58285|58286|58287|58288|58289|58299|58300|58336|58337|58356|58358|58559|59049|59971|59985|59986|59987|59989|59991|60067|60070|60598|60599|60602|60603|60724|60725|60726|60727|60728|60729|60730|60737|60848|60849|60850|60851|60852|60853|60854|60855|60856|60857|60858|60859|60860|60861|60862|60863|60864|60865|60866|60870|60871|60872|61172|61178|61181|61183|61185|61187|61189|61191|61304|61306|61336|61342|61343|61344|61365|61366|61367|61374|61375|61376|61377|61534|61537|61538|61539|61580|61593|61594|61725|62016|62261|62262|62265|62266|62268|62271|62400|62462|62556|62558|62566|62705|62731|62732|62840|63043|63046|63053|63060|63177|63179|63181|63188|63189|63190|63191|63292|63293|63294|63418|63421|63559|63573|63575|63582|63584|63610|63611|63612|63614|63615|63616|63617|63618|63785|63787|63789|63791|63793|63795|63797|63799|63801|63803|63805|64770|64771|64777|64778|64779|64780|64781|64782|64783|64785|64787|64788|64790|64792|64793|64794|64795|64796|64846|65220|67643|67645)$/;
        Constant.AB_TESTING_SESSIONS = [];
        Constant.PROGRESSIVE_DEPLOYS = [];
        router.Constant = Constant;
    })(router = teads.router || (teads.router = {}));
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var router;
    (function (router) {
        var Utils = (function () {
            function Utils() {
            }
            Utils.getWindow = function (logger) {
                var win = window;
                try {
                    if (window.top.document) {
                        win = window.top;
                    }
                }
                catch (err) {
                    if (logger) {
                        logger.warn('window.doc.document is not accessible', err);
                    }
                }
                return win;
            };
            Utils.getCacheBusting = function () {
                var today = new Date();
                var day = today.getDate();
                var month = today.getMonth() + 1;
                var year = today.getFullYear();
                var hours = today.getHours();
                return "" + year + month + day + hours;
            };
            Utils.clone = function (obj) {
                var res = {};
                for (var key in obj) {
                    res[key] = obj[key];
                }
                return res;
            };
            Utils.isV3Enabled = function (win, format, pid) {
                var testV2 = /v2=enabled/.test(win.location.href);
                var testV3 = /v3=enabled/.test(win.location.href);
                var isBlackListed = router.Constant.BLACK_LIST_V3.test(pid);
                var isFormatOk = router.Constant.V3_FORMAT_REGEX.test(format) || (Utils.isInBoard(format) && router.Constant.INBOARD_V3_WHITELIST.test(pid));
                return testV3 || (!testV2 && !isBlackListed && isFormatOk);
            };
            Utils.isInBoard = function (format) {
                return format === 'inboard';
            };
            Utils.injectFormat = function (doc, win, url) {
                win.teads = window.teads = win.teads || {};
                win.teads.CONST_PLAYER_PATH = router.Constant.PLAYER_PATH;
                var js, s = doc.getElementsByTagName('script')[0];
                js = doc.createElement('script');
                js.async = true;
                js.src = url + '?' + Utils.getCacheBusting();
                if (s && s.parentNode) {
                    s.parentNode.insertBefore(js, s);
                }
                else {
                    doc.body.appendChild(js);
                }
            };
            Utils.getFormatVersion = function (version, pid, format) {
                if (version !== router.Constant.FORMAT_VERSIONS.V3) {
                    return router.Constant.FORMAT_VERSIONS[version];
                }
                var activeAbTestingSessions = Utils.getActiveAbTestingSessions();
                var n = activeAbTestingSessions.length;
                var latestProgressiveDeploy = Utils.getLatestProgressiveDeploy();
                if (n === 0 && !latestProgressiveDeploy) {
                    return router.Constant.FORMAT_VERSIONS.V3;
                }
                var formatVersionNumber = router.Constant.FORMAT_VERSIONS.V3;
                for (var i = 0; i < n; i++) {
                    formatVersionNumber = activeAbTestingSessions[i].getFormatVersion(pid, format);
                    if (formatVersionNumber !== router.Constant.FORMAT_VERSIONS.V3) {
                        break;
                    }
                }
                if (latestProgressiveDeploy) {
                    formatVersionNumber = latestProgressiveDeploy.getFormatVersion();
                }
                return router.Constant.FORMAT_VERSIONS[formatVersionNumber] || router.Constant.FORMAT_VERSIONS.V3;
            };
            Utils.getActiveAbTestingSessions = function () {
                return teads.ArrayHelper.filter(router.Constant.AB_TESTING_SESSIONS, function (abTestingSession) {
                    return abTestingSession.isActive();
                }).sort(function (a, b) {
                    return a.getStartUtcDate().getTime() - b.getStartUtcDate().getTime();
                });
            };
            Utils.getLatestProgressiveDeploy = function () {
                var progressiveDeploys = router.Constant.PROGRESSIVE_DEPLOYS.sort(function (a, b) {
                    return b.getStartUtcDate().getTime() - a.getStartUtcDate().getTime();
                });
                var latestProgressiveDeploy = progressiveDeploys[0];
                if (!latestProgressiveDeploy || !latestProgressiveDeploy.isActive()) {
                    return;
                }
                return latestProgressiveDeploy;
            };
            Utils.getFormatUrl = function (location, formatVersion, pid, format) {
                var url;
                var hasReleaseInUrl = location.href.match(/teadsRelease=(.*)/i);
                if (hasReleaseInUrl && !!hasReleaseInUrl[1]) {
                    url = router.Constant.RELEASE_PATH_PATTERN.replace('{release}', hasReleaseInUrl[1]);
                }
                else {
                    var version = Utils.getFormatVersion(formatVersion, pid, format);
                    url = router.Constant.FORMAT_PATHS[version];
                }
                return url;
            };
            return Utils;
        }());
        router.Utils = Utils;
    })(router = teads.router || (teads.router = {}));
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var router;
    (function (router) {
        function _setIfDefined(context, property, value) {
            if (value !== undefined) {
                context[property] = value;
            }
        }
        function _isSoundHoverOrOnceHoverAndMobile(ttf) {
            return (ttf.soundMode === 'hover' || ttf.soundMode === 'onceHover') && teads.Context.isMobile();
        }
        var Converter = (function () {
            function Converter() {
            }
            Converter.convertPlacementOptions = function (ttf) {
                var ttp = {
                    pid: parseInt(ttf.pid, 10),
                    format: ttf.format,
                    slot: Converter.slot(ttf),
                    css: Converter.css(ttf),
                };
                _setIfDefined(ttp, 'capping', Converter.capping(ttf));
                _setIfDefined(ttp, 'fallback', ttf.passBack);
                _setIfDefined(ttp, 'parentWindow', ttf.parentWindow);
                _setIfDefined(ttp, 'mobile', ttf.mobile);
                _setIfDefined(ttp, 'desktop', ttf.desktop);
                _setIfDefined(ttp, 'callbacks', Converter.callbacks(ttf));
                return ttp;
            };
            Converter.convertAdOptions = function (ttf) {
                var ad = {};
                if (ttf.vast && /^(http(s)?:)?\/\//.test(ttf.vast)) {
                    ad.type = 'VastUrl';
                    ad.content = ttf.vast;
                }
                ad.format = ttf.format;
                ad.settings = {};
                ad.settings.values = {
                    placementId: parseInt(ttf.pid, 10),
                    placementFormat: ttf.format,
                    pageId: 0,
                    threshold: ttf.size ? ttf.size.t || 50 : 50,
                    volume: {
                        main: ttf.volume || 0.1,
                        mouseover: ttf.volume || 0.35,
                        fadeDuration: 1000,
                    },
                };
                ad.settings.components = {};
                _setIfDefined(ad.settings.components, 'closeButton', Converter.closeButton(ttf));
                _setIfDefined(ad.settings.components, 'soundButton', Converter.soundButton(ttf));
                _setIfDefined(ad.settings.components, 'label', Converter.label(ttf));
                _setIfDefined(ad.settings.components, 'credits', Converter.credits(ttf));
                _setIfDefined(ad.settings.components, 'endScreen', Converter.endScreen(ttf));
                ad.settings.behaviors = {};
                _setIfDefined(ad.settings.behaviors, 'videoStart', Converter.videoStart(ttf));
                _setIfDefined(ad.settings.behaviors, 'soundStart', Converter.soundStart(ttf));
                _setIfDefined(ad.settings.behaviors, 'videoPause', Converter.videoPause(ttf));
                _setIfDefined(ad.settings.behaviors, 'soundMute', Converter.soundMute(ttf));
                _setIfDefined(ad.settings.behaviors, 'soundOver', Converter.soundOver(ttf));
                _setIfDefined(ad.settings.behaviors, 'end', Converter.end(ttf));
                return ad;
            };
            Converter.slot = function (ttf) {
                var slot = {};
                _setIfDefined(slot, 'insertBefore', ttf.before);
                if (ttf.slotMode !== undefined) {
                    slot.insertInside = ttf.slotMode === 'in';
                }
                if (ttf.avoidSlot) {
                    _setIfDefined(slot, 'avoid', {
                        selector: ttf.avoidSlot.slot,
                        distance: ttf.avoidSlot.dist,
                    });
                }
                _setIfDefined(slot, 'btf', ttf.BTF);
                _setIfDefined(slot, 'filter', ttf.filter);
                _setIfDefined(slot, 'selector', ttf.slot);
                _setIfDefined(slot, 'auto', ttf.slotFinder);
                _setIfDefined(slot, 'minimum', ttf.minSlot);
                _setIfDefined(slot, 'belowSelector', ttf.bSlot);
                _setIfDefined(slot, 'minimumBelow', ttf.bMinSlot);
                _setIfDefined(slot, 'scrollSelector', ttf.scrollSlot);
                return slot;
            };
            Converter.capping = function (ttf) {
                if (ttf.capping === undefined && ttf.capping_vu === undefined) {
                    return;
                }
                var capping;
                if ((ttf.capping && typeof ttf.capping.time_interval === 'number') || ttf.capping_vu) {
                    capping = {
                        unit: 'minute',
                        frequency: Math.floor(Math.max(60 / ttf.capping_vu, 1)),
                    };
                }
                if (ttf.capping) {
                    capping = {
                        unit: String(ttf.capping.time_interval),
                        frequency: ttf.capping.frequency,
                    };
                }
                return capping;
            };
            Converter.callbacks = function (ttf) {
                if (!ttf.callbacks && !ttf.callback) {
                    return;
                }
                var callbacks = {};
                if (ttf.callbacks) {
                    for (var eventName in ttf.callbacks) {
                        if (ttf.callbacks.hasOwnProperty(eventName)) {
                            callbacks[router.Constant.CALLBACK_VPAID_MAP[eventName]] = ttf.callbacks[eventName];
                        }
                    }
                }
                if (ttf.callback && !callbacks[router.Constant.CALLBACK_VPAID_MAP['finish']]) {
                    callbacks[router.Constant.CALLBACK_VPAID_MAP['finish']] = ttf.callback;
                }
                return callbacks;
            };
            Converter.css = function (ttf) {
                var cssRules = [];
                if (ttf.css) {
                    cssRules.push(ttf.css);
                }
                if (ttf.size && ttf.size.w) {
                    var width = String(ttf.size.w);
                    if (/^\d+$/.test(width)) {
                        width += 'px';
                    }
                    cssRules.push("width: " + width);
                }
                return cssRules.join(';').replace(/;;/, ';');
            };
            Converter.closeButton = function (ttf) {
                var noSkip = ttf.skip === undefined;
                var noSkippable = ttf.skippable === undefined;
                var skippableFalse = ttf.skippable !== undefined && ttf.skippable === false;
                var noSkipComponent = ttf.components === undefined || (ttf.components !== undefined && ttf.components.skip === undefined);
                if (noSkip && (noSkippable || skippableFalse) && noSkipComponent) {
                    return;
                }
                var display = !noSkippable ? ttf.skippable : (!noSkipComponent || !noSkip);
                var countdown = 0;
                var skipComponentObject = ttf.components && typeof ttf.components.skip === 'object';
                if (skipComponentObject) {
                    countdown = ttf.components.skip.delay;
                }
                else if (!noSkip) {
                    countdown = ttf.skip.delay;
                }
                return {
                    display: display,
                    countdown: countdown,
                };
            };
            Converter.soundButton = function (ttf) {
                var noMute = ttf.mute === undefined;
                var noMutable = ttf.mutable === undefined;
                var noSoundMode = ttf.soundMode === undefined;
                var noMuteComponent = ttf.components === undefined || (ttf.components !== undefined && ttf.components.mute === undefined);
                if (noMute && noMutable && noMuteComponent && noSoundMode && !teads.Context.isIpad()) {
                    return;
                }
                var display = !noMutable || teads.Context.isIpad() || !noSoundMode || !noMuteComponent || !noMute;
                var countdown = 0;
                var type = 'mute';
                var muteComponentObject = ttf.components && typeof ttf.components.mute === 'object';
                if (muteComponentObject) {
                    countdown = ttf.components.mute.delay;
                }
                else if (!noMute) {
                    countdown = ttf.mute.delay;
                }
                if (ttf.soundMode === 'hover' || ttf.soundMode === 'onceHover') {
                    type = 'equalizer';
                }
                return {
                    display: display,
                    countdown: countdown,
                    type: type,
                };
            };
            Converter.label = function (ttf) {
                var noMention = ttf.mention === undefined;
                if (noMention) {
                    return;
                }
                var display = !!ttf.mention;
                var html;
                if (typeof ttf.mention === 'object') {
                    html = ttf.mention.txt || ttf.mention.html;
                }
                else {
                    html = 'Advertising';
                }
                return {
                    display: display,
                    html: html,
                };
            };
            Converter.credits = function (ttf) {
                var noWhatThis = ttf.whatThis === undefined;
                if (noWhatThis) {
                    return;
                }
                var display = !noWhatThis;
                var formatName;
                var link;
                if (ttf.format === 'inread') {
                    formatName = 'inRead';
                    link = 'http://inread-experience.teads.tv';
                }
                else {
                    formatName = 'inBoard';
                    link = 'http://teads.tv/en/teads-media/';
                }
                var text = '[' + formatName + '] invented by Teads';
                return {
                    display: display,
                    text: text,
                    link: link,
                };
            };
            Converter.endScreen = function (ttf) {
                var noEndMode = ttf.endMode === undefined;
                if (noEndMode) {
                    return;
                }
                var endScreen = {
                    display: false
                };
                if (ttf.endMode === 'replay') {
                    endScreen.display = true;
                    endScreen.replayButton = { text: 'Replay' };
                    endScreen.autoClose = false;
                    endScreen.type = 'simple';
                }
                return endScreen;
            };
            Converter.videoStart = function (ttf) {
                var noStartMode = ttf.startMode === undefined;
                if (noStartMode) {
                    return;
                }
                return (ttf.startMode === 'v2p' || ttf.startMode === 'v2s') ? 'threshold' : 'click';
            };
            Converter.soundStart = function (ttf) {
                var noMutable = ttf.mutable === undefined;
                var noSoundMode = ttf.soundMode === undefined;
                var mutableAnyAndNotMobile = ttf.mutable !== undefined && !teads.Context.isMobile();
                var mutableTrueAndMobile = ttf.mutable === true && teads.Context.isMobile();
                if (!teads.Context.isIpad() && (noMutable || mutableAnyAndNotMobile || mutableTrueAndMobile) && noSoundMode) {
                    return;
                }
                var type;
                var countdown = 0;
                var isNotMutableAndMobile = ttf.mutable === false && teads.Context.isMobile();
                var isAutoOrIpad = ttf.soundMode === 'always' || teads.Context.isIpad();
                var isNotAuto = ttf.soundMode !== 'always';
                if (_isSoundHoverOrOnceHoverAndMobile(ttf) || isNotMutableAndMobile || isNotAuto) {
                    type = 'mute';
                }
                if (noSoundMode || isAutoOrIpad) {
                    type = 'unmute';
                }
                if (ttf.soundMode === 'countdown') {
                    type = 'countdown';
                    countdown = 3;
                }
                return {
                    type: type,
                    countdown: countdown
                };
            };
            Converter.videoPause = function (ttf) {
                var noStartMode = ttf.startMode === undefined;
                if (noStartMode) {
                    return;
                }
                return (!noStartMode && ttf.startMode === 'v2s') ? 'no' : 'threshold';
            };
            Converter.soundMute = function (ttf) {
                var noMutable = ttf.mutable === undefined;
                var noSoundMode = ttf.soundMode === undefined;
                var mutableAnyAndNotMobile = ttf.mutable !== undefined && !teads.Context.isMobile();
                var mutableTrueAndMobile = ttf.mutable === true && teads.Context.isMobile();
                if (!teads.Context.isIpad() && (noMutable || mutableAnyAndNotMobile || mutableTrueAndMobile) && noSoundMode) {
                    return;
                }
                var isNotMutableAndMobile = ttf.mutable === false && teads.Context.isMobile();
                var soundModeIsClickOrCountdown = ttf.soundMode === 'click' || ttf.soundMode === 'countdown';
                var isAutoOrIpad = ttf.soundMode === 'always' || teads.Context.isIpad();
                if (!soundModeIsClickOrCountdown && (!ttf.mutable || !ttf.soundMode || _isSoundHoverOrOnceHoverAndMobile(ttf) || isNotMutableAndMobile || isAutoOrIpad)) {
                    return 'no';
                }
            };
            Converter.end = function (ttf) {
                var noEndMode = ttf.endMode === undefined;
                if (noEndMode) {
                    return;
                }
                return ttf.endMode === 'auto' ? 'collapse' : 'endscreen';
            };
            Converter.soundOver = function (ttf) {
                var noMutable = ttf.mutable === undefined;
                var mutableAndTrue = ttf.mutable === true;
                var noSoundMode = ttf.soundMode === undefined;
                if (!teads.Context.isIpad() && (noMutable || mutableAndTrue) && noSoundMode) {
                    return;
                }
                var isAutoOrIpad = ttf.soundMode === 'always' || teads.Context.isIpad();
                if (ttf.mutable === false || isAutoOrIpad || _isSoundHoverOrOnceHoverAndMobile(ttf)) {
                    return 'off';
                }
                if (ttf.soundMode === 'onceHover') {
                    return 'onceOver';
                }
                else if (ttf.soundMode === 'click') {
                    return 'off';
                }
                else if (ttf.mutable === true || ttf.soundMode === 'hover') {
                    return;
                }
            };
            Converter.convertTrackings = function (ttf) {
                if (!ttf.TrackingEvents && !ttf.ClickTracking && !ttf.ClickThrough && !ttf.Impression) {
                    return [];
                }
                var trackingEvents = ttf.TrackingEvents || [];
                var trackings = teads.ArrayHelper.map(trackingEvents, function (tracking) {
                    var e;
                    for (var evt in tracking) {
                        if (tracking.hasOwnProperty(evt)) {
                            e = evt;
                            break;
                        }
                    }
                    return {
                        event: e,
                        url: tracking[e]
                    };
                });
                if (ttf.Impression) {
                    trackings.push({
                        event: 'impression',
                        url: ttf.Impression,
                    });
                }
                if (ttf.ClickTracking) {
                    trackings.push({
                        event: 'click',
                        url: ttf.ClickTracking,
                    });
                }
                return trackings;
            };
            return Converter;
        }());
        router.Converter = Converter;
    })(router = teads.router || (teads.router = {}));
})(teads || (teads = {}));
try { var teads = teads || window.top.teads; } catch(e) { var teads = teads || window.teads; }
(function (teads) {
    var router;
    (function (router) {
        router.routerSumologic = new teads.Sumologic();
        router.routerSumologic.init(teads.Sumologic.CONFIGS.ROUTER, teads.Option.empty());
        router.routerSumologic.sendRaw('2.16.127');
        var logger = new teads.Logger('Router');
        if (router.Constant.ROUTER_DISABLED) {
            router.routerSumologic.sendRaw('disabled');
            throw 'Teads router is disabled';
        }
        var topWindow = router.Utils.getWindow(logger);
        var ttf = topWindow._ttf = window._ttf;
        var ttp = topWindow._ttp = window._ttp;
        logger.info('Router successfully called');
        try {
            if (!ttf || !ttf.length) {
                if (ttp) {
                    var pageId = '';
                    for (var id in ttp) {
                        if (ttp.hasOwnProperty(id)) {
                            pageId = id;
                            break;
                        }
                    }
                    if (pageId) {
                        var win = topWindow;
                        for (var i = 0, l = ttp[pageId].length; i < l; i++) {
                            if (ttp[pageId][i].parentWindow === false) {
                                win = window;
                            }
                            var pid = String(ttp[pageId][i].pid);
                            var format = String(ttp[pageId][i].format);
                            var url = router.Utils.getFormatUrl(win.location, router.Constant.FORMAT_VERSIONS.V3, pid, format);
                            router.Utils.injectFormat(win.document, win, url);
                        }
                    }
                }
                else {
                    throw 'window._ttp must be defined';
                }
            }
            else {
                var format = void 0;
                var pid = void 0;
                for (var i_1 = 0, len = ttf.length; i_1 < len; i_1++) {
                    var logInfo = [];
                    var win = topWindow;
                    if (ttf[i_1].parentWindow === false) {
                        win = window;
                    }
                    if (!ttf[i_1] || !ttf[i_1].format || !ttf[i_1].pid) {
                        logger.warn('window._ttf objects must have a \'format\' and a \'pid\' attribute', ttf[i_1]);
                    }
                    else if (ttf[i_1].launched) {
                        logger.warn('This format was already launched! ' + ttf[i_1].format + ':' + ttf[i_1].pid);
                    }
                    else if (!/^inread|inboard$/.test(ttf[i_1].format)) {
                        logger.warn('window._ttf objects must have a valid \'format\'');
                    }
                    else {
                        format = ttf[i_1].format;
                        pid = String(ttf[i_1].pid);
                        logInfo.push('f=' + format);
                        logInfo.push('pid=' + pid);
                        var formatNextGenVersion = router.Constant.FORMAT_VERSIONS.V2;
                        if (router.Utils.isV3Enabled(win, format, pid)) {
                            var pageId_1 = 0;
                            win._ttp = win._ttp || {};
                            win._ttp[pageId_1] = win._ttp[pageId_1] || [];
                            win._tta = win._tta || {};
                            win._tta[pageId_1] = win._tta[pageId_1] || [];
                            win._ttc = win._ttc || {};
                            win._ttc[pageId_1] = win._ttc[pageId_1] || {};
                            win._tts = win._tts || {};
                            win._ttf = ttf;
                            win._ttp[pageId_1].push(router.Converter.convertPlacementOptions(ttf[i_1]));
                            win._tta[pageId_1].push(router.Converter.convertAdOptions(ttf[i_1]));
                            win._ttc[pageId_1].trackings = (win._ttc[pageId_1].trackings || []).concat(router.Converter.convertTrackings(ttf[i_1]));
                            ttf[i_1].launched = true;
                            logger.debug('Converted ttf to ttp (v3 placement options) + tta (v3 ad options)', win._ttp, win._tta);
                            formatNextGenVersion = router.Constant.FORMAT_VERSIONS.V3;
                        }
                        var url = router.Utils.getFormatUrl(win.location, formatNextGenVersion, pid, format);
                        logger.warn("Routing detected for " + pid + ": " + format + " => " + formatNextGenVersion + " (mobile: " + ttf[i_1].mobile + ")");
                        logInfo.push('to=' + formatNextGenVersion);
                        var sendFixTracking = null;
                        if (router.Constant.PID_FIX_CSS_LEMONDE_PADDING.test(pid)) {
                            ttf[i_1].css = 'max-width:1000px !important; margin: 13px auto; padding: 0px;';
                            sendFixTracking = 'LEMONDE_PADDING';
                        }
                        else if (router.Constant.PID_FIX_CSS_LEMONDE_WIDTH.test(pid)) {
                            ttf[i_1].css = 'width:1000px !important; margin: 13px auto; padding: 0px;';
                            sendFixTracking = 'LEMONDE_WIDTH';
                        }
                        if (router.Constant.PID_FIX_CSS_CI_CH_HU.test(pid)) {
                            ttf[i_1].css = '';
                            ttf[i_1].slotMode = 'in';
                            sendFixTracking = 'CI_CH_HU';
                        }
                        if (router.Constant.PID_FIX_CSS_OBS.test(pid)) {
                            ttf[i_1].css = 'width:979px !important; margin:15px auto;z-index:10';
                            ttf[i_1].slot = '.bloc-une,.kch,#obs-page,.double-line,.obs-breadcrumbs, .content-gal';
                            sendFixTracking = 'OBS';
                        }
                        if (router.Constant.PID_FIX_CSS_TELERAMA_IB.test(pid)) {
                            ttf[i_1].css = 'width:1000px !important; margin: 12px auto;';
                            sendFixTracking = 'TELERAMA_IB';
                        }
                        if (router.Constant.PID_FIX_CSS_TELERAMA_IR.test(pid)) {
                            ttf[i_1].slot = '.wysiwyg > p , [itemprop="description"] p:not(:empty)';
                            sendFixTracking = 'TELERAMA_IR';
                        }
                        if (sendFixTracking) {
                            logInfo.push('fix=' + sendFixTracking);
                        }
                        var doc = win.document;
                        router.Utils.injectFormat(doc, win, url);
                        router.routerSumologic.sendInfo(logInfo.join(' '));
                    }
                }
            }
        }
        catch (err) {
            logger.error('Routing cannot be detected: ', err);
            if (err !== 'window._ttf must be an array') {
                router.routerSumologic.sendError('Routing error: ' + (err.message ? err.message : err));
            }
        }
    })(router = teads.router || (teads.router = {}));
})(teads || (teads = {}));

 __extends(window.teads, teads); 
 })(window.teads = window.teads || {});