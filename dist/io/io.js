"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOAsync = exports.IO = void 0;
var either_1 = require("../either");
var option_1 = require("../option");
var utils_1 = require("../utils");
var IOAsync = function (fa) {
    var memo;
    return {
        ap: function (applicative) {
            return IOAsync(function (env) { return applicative.flatMap(function (f) { return IOAsync(fa).map(f); }).run(env); });
        },
        map: function (f) { return IOAsync(function (env) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = f;
                    return [4 /*yield*/, fa(env)];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
            }
        }); }); }); },
        flatMap: function (f) { return IOAsync(function (env) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = f;
                    return [4 /*yield*/, fa(env)];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()]).run(env)];
            }
        }); }); }); },
        memoize: function () {
            return IOAsync(function (env) {
                if (!memo)
                    memo = IOAsync(fa).run(env);
                return memo;
            });
        },
        provide: function (env) { return IOAsync(function () { return fa(env); }); },
        provideDefault: function (env) { return IOAsync(function (newEnv) { return fa(__assign(__assign({}, env), newEnv)); }); },
        either: function () {
            return IOAsync(function (env) { return __awaiter(void 0, void 0, void 0, function () {
                var _a, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            _a = either_1.Right;
                            return [4 /*yield*/, fa(env)];
                        case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                        case 2:
                            e_1 = _b.sent();
                            return [2 /*return*/, either_1.Left(e_1)];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        },
        option: function () {
            return IOAsync(function (env) { return __awaiter(void 0, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            _a = option_1.Some;
                            return [4 /*yield*/, fa(env)];
                        case 1: return [2 /*return*/, _a.apply(void 0, [_c.sent()])];
                        case 2:
                            _b = _c.sent();
                            return [2 /*return*/, option_1.None];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        },
        recover: function (handle) {
            return IOAsync(function (env) { return __awaiter(void 0, void 0, void 0, function () {
                var e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fa(env)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            e_2 = _a.sent();
                            return [2 /*return*/, handle(e_2)];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        },
        recoverWith: function (alternative) {
            return IOAsync(function (env) { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fa(env)];
                        case 1: return [2 /*return*/, _b.sent()];
                        case 2:
                            _a = _b.sent();
                            return [2 /*return*/, alternative.run(env)];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        },
        retry: function (amount) {
            return IOAsync(function (env) { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(amount > 0)) return [3 /*break*/, 5];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fa(env)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, IOAsync(fa)
                                    .retry(amount - 1)
                                    .run(env)];
                        case 4: return [3 /*break*/, 6];
                        case 5: return [2 /*return*/, fa(env)];
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
        },
        delay: function (ms) {
            return IOAsync(function (env) { return __awaiter(void 0, void 0, void 0, function () {
                var delay;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            delay = utils_1.withDelay(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, fa(env)];
                            }); }); }).delay;
                            return [4 /*yield*/, delay(ms)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); });
        },
        timeout: function (ms) {
            return IOAsync(function (env) { return __awaiter(void 0, void 0, void 0, function () {
                var timeout;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            timeout = utils_1.withTimeout(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, fa(env)];
                            }); }); }).timeout;
                            return [4 /*yield*/, timeout(ms)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); });
        },
        cancel: function () {
            return IOAsync(function (env) { return __awaiter(void 0, void 0, void 0, function () {
                var cancel;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cancel = utils_1.withCancel(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, fa(env)];
                            }); }); }).cancel;
                            return [4 /*yield*/, cancel()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); });
        },
        transform: function (convert) { return convert(IOAsync(fa)); },
        access: function (f) { return IOAsync(function (env) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = f;
                    _b = [env];
                    return [4 /*yield*/, fa(env)];
                case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
            }
        }); }); }); },
        ask: function () { return IOAsync(function (env) { return env; }); },
        asks: function (f) { return IOAsync(function (env) { return f(env); }); },
        local: function (f) { return IOAsync(function (env) { return IOAsync(fa).run(f(env)); }); },
        run: function (env) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, fa(env)];
        }); }); },
        inspect: function () { return "IOAsync(" + fa + ")"; },
    };
};
exports.IOAsync = IOAsync;
IOAsync.of = function (a) { return IOAsync(function () { return a; }); };
IOAsync.failure = function (t) {
    return IOAsync(function () {
        throw t;
    });
};
IOAsync.success = function (a) { return IOAsync(function () { return a; }); };
var IO = function (fa) {
    var memo;
    return {
        ap: function (applicative) {
            return IO(function (env) { return applicative.flatMap(function (f) { return IO(fa).map(f); }).run(env); });
        },
        map: function (f) { return IO(function (env) { return f(fa(env)); }); },
        flatMap: function (f) { return IO(function (env) { return f(fa(env)).run(env); }); },
        memoize: function () {
            return IO(function (env) {
                if (!memo)
                    memo = IO(fa).run(env);
                return memo;
            });
        },
        provide: function (env) { return IO(function () { return fa(env); }); },
        provideDefault: function (env) { return IO(function (newEnv) { return fa(__assign(__assign({}, env), newEnv)); }); },
        either: function () {
            return IO(function (env) {
                try {
                    return either_1.Right(fa(env));
                }
                catch (e) {
                    return either_1.Left(e);
                }
            });
        },
        option: function () {
            return IO(function (env) {
                try {
                    return option_1.Some(fa(env));
                }
                catch (_a) {
                    return option_1.None;
                }
            });
        },
        recover: function (handle) {
            return IO(function (env) {
                try {
                    return fa(env);
                }
                catch (e) {
                    return handle(e);
                }
            });
        },
        recoverWith: function (alternative) {
            return IO(function (env) {
                try {
                    return fa(env);
                }
                catch (_a) {
                    return alternative.run(env);
                }
            });
        },
        retry: function (amount) {
            return IO(function (env) {
                if (amount > 0) {
                    try {
                        return fa(env);
                    }
                    catch (_a) {
                        return IO(fa)
                            .retry(amount - 1)
                            .run(env);
                    }
                }
                else {
                    return fa(env);
                }
            });
        },
        transform: function (convert) { return convert(IO(fa)); },
        access: function (f) { return IO(function (env) { return f(env, fa(env)); }); },
        ask: function () { return IO(function (env) { return env; }); },
        asks: function (f) { return IO(function (env) { return f(env); }); },
        local: function (f) { return IO(function (env) { return IO(fa).run(f(env)); }); },
        async: function () { return IOAsync(function (env) { return IO(fa).run(env); }); },
        run: function (env) { return fa(env); },
        inspect: function () { return "IO(" + fa + ")"; },
    };
};
exports.IO = IO;
IO.of = function (a) { return IO(function () { return a; }); };
IO.failure = function (t) {
    return IO(function () {
        throw t;
    });
};
IO.success = function (a) { return IO(function () { return a; }); };
IO.async = IOAsync;
