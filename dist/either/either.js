"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Right = exports.Left = exports.Either = void 0;
var option_1 = require("../option");
var Left = function (l) { return ({
    ap: function (_) { return Left(l); },
    map: function (_) { return Left(l); },
    flatMap: function (_) { return Left(l); },
    isLeft: function () { return true; },
    isRight: function () { return false; },
    orElse: function (alternative) { return alternative; },
    getOrElse: function (alternative) { return alternative; },
    getOrNull: function () { return null; },
    getOrUndefined: function () { return void 0; },
    get: function () {
        throw Error('could not get value of type left');
    },
    fold: function (_, left) { return left(l); },
    match: function (_a) {
        var Left = _a.Left;
        return Left(l);
    },
    filter: function (_) { return Left(l); },
    transform: function (convert) { return convert(Left(l)); },
    contains: function (value) { return l === value; },
    equals: function (compare) { return compare.isLeft() && compare.contains(l); },
    swap: function () { return Right(l); },
    option: function () { return option_1.None; },
    inspect: function () { return "Left(" + l + ")"; },
}); };
exports.Left = Left;
Left.of = Left;
var Right = function (r) { return ({
    ap: function (applicative) { return applicative.map(function (f) { return f(r); }); },
    map: function (f) { return Right(f(r)); },
    flatMap: function (f) { return f(r); },
    isLeft: function () { return false; },
    isRight: function () { return true; },
    orElse: function (_) { return Right(r); },
    getOrElse: function (_) { return r; },
    getOrNull: function () { return r; },
    getOrUndefined: function () { return r; },
    get: function () { return r; },
    fold: function (right, _) { return right(r); },
    match: function (_a) {
        var Right = _a.Right;
        return Right(r);
    },
    filter: function (predicate) { return (predicate(r) ? Right(r) : Left(null)); },
    transform: function (convert) { return convert(Right(r)); },
    contains: function (value) { return r === value; },
    equals: function (compare) { return compare.isRight() && compare.contains(r); },
    swap: function () { return Left(r); },
    option: function () { return option_1.Some(r); },
    inspect: function () { return "Right(" + r + ")"; },
}); };
exports.Right = Right;
Right.of = Right;
var Either = {
    left: Left,
    right: Right,
};
exports.Either = Either;
