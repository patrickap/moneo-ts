"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCancel = exports.withTimeout = exports.withDelay = exports.toPromise = exports.isPromise = exports.isFunction = exports.isNil = void 0;
var isNil = function (x) {
    if (x === null || x === undefined) {
        return true;
    }
    else {
        return false;
    }
};
exports.isNil = isNil;
var isFunction = function (x) {
    return !!(x && typeof x == 'function');
};
exports.isFunction = isFunction;
var isPromise = function (x) {
    return !!(x && isFunction(x === null || x === void 0 ? void 0 : x.then));
};
exports.isPromise = isPromise;
var toPromise = function (fn) {
    return new Promise(function (resolve, reject) {
        try {
            return resolve(fn());
        }
        catch (e) {
            return reject(e);
        }
    });
};
exports.toPromise = toPromise;
var withDelay = function (promise) {
    var delay = function (ms) {
        return new Promise(function (resolve) {
            var timeoutId = setTimeout(function () {
                resolve(void 0);
                clearTimeout(timeoutId);
            }, ms);
        }).then(function () { return promise(); });
    };
    return { delay: delay };
};
exports.withDelay = withDelay;
var withTimeout = function (promise) {
    var timeout = function (ms) {
        var timeoutId;
        var timeoutPromise = new Promise(function (_, reject) {
            timeoutId = setTimeout(function () { return reject(new Error('promise timed out')); }, ms);
        });
        return Promise.race([promise(), timeoutPromise]).then(function (result) {
            clearTimeout(timeoutId);
            return result;
        });
    };
    return { timeout: timeout };
};
exports.withTimeout = withTimeout;
var withCancel = function (promise) {
    var cancel = function () {
        return Promise.race([
            promise(),
            new Promise(function (_, reject) { return reject(new Error('promise canceled')); }),
        ]).then(function (result) {
            return result;
        });
    };
    return { cancel: cancel };
};
exports.withCancel = withCancel;
