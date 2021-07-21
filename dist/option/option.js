"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.None = exports.Some = exports.Option = void 0;
var either_1 = require("../either");
var utils_1 = require("../utils");
var Some = function (a) { return ({
    ap: function (applicative) { return applicative.map(function (f) { return f(a); }); },
    map: function (f) { return Some(f(a)); },
    flatMap: function (f) { return f(a); },
    isSome: function () { return true; },
    isNone: function () { return false; },
    orElse: function (_) { return Some(a); },
    getOrElse: function (_) { return a; },
    getOrNull: function () { return a; },
    getOrUndefined: function () { return a; },
    get: function () { return a; },
    fold: function (some, _) { return some(a); },
    match: function (_a) {
        var Some = _a.Some;
        return Some(a);
    },
    filter: function (predicate) { return (predicate(a) ? Some(a) : None); },
    transform: function (convert) { return convert(Some(a)); },
    contains: function (value) { return a === value; },
    equals: function (compare) { return compare.isSome() && compare.contains(a); },
    either: function () { return either_1.Right(a); },
    inspect: function () { return "Some(" + a + ")"; },
}); };
exports.Some = Some;
Some.of = Some;
var None = {
    ap: function (_) { return None; },
    map: function (_) { return None; },
    flatMap: function (_) { return None; },
    isSome: function () { return false; },
    isNone: function () { return true; },
    orElse: function (alternative) { return alternative; },
    getOrElse: function (alternative) { return alternative; },
    getOrNull: function () { return null; },
    getOrUndefined: function () { return void 0; },
    get: function () {
        throw Error('get() called on none');
    },
    fold: function (_, none) { return none(); },
    match: function (_a) {
        var None = _a.None;
        return None();
    },
    filter: function (_) { return None; },
    transform: function (convert) { return convert(None); },
    contains: function (_) { return false; },
    equals: function (compare) { return compare.isNone(); },
    either: function () { return either_1.Left(null); },
    inspect: function () { return 'None'; },
};
exports.None = None;
function Option(a) {
    return utils_1.isNil(a) ? None : Some(a);
}
exports.Option = Option;
Option.of = Option;
Option.some = Some;
Option.none = None;
