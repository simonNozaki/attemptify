"use strict";
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
var attempt_1 = require("@/attempt");
var exhausted_retey_exception_1 = require("@/exception/exhausted-retey-exception");
var duration_1 = require("@/duration");
var simple_retry_policy_1 = require("@/policy/simple-retry-policy");
var app_1 = require("./app");
var spec_retry_exception_1 = require("./spec-retry-exception");
var operator_1 = require("@/functions/operator");
describe('attempt spec', function () {
    afterEach(function () {
        jest.resetAllMocks();
    });
    it('can retry 3 times', function () {
        var policy = new simple_retry_policy_1.SimpleRetryPolicy((0, duration_1.msecs)(50), 3);
        var spy = jest.spyOn(app_1.App.prototype, 'execute')
            .mockImplementation(function () {
            throw new spec_retry_exception_1.SpecRetryException('Error occured on App');
        });
        try {
            new attempt_1.Attempt(policy).execute(function () {
                return app_1.app.execute();
            });
        }
        catch (e) {
            expect(e).toBeInstanceOf(exhausted_retey_exception_1.ExhaustedRetryException);
        }
        expect(spy).toHaveBeenCalledTimes(3);
    });
    it('can retry 3 times asynchronously', function () { return __awaiter(void 0, void 0, void 0, function () {
        var policy, spy, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    policy = new simple_retry_policy_1.SimpleRetryPolicy((0, duration_1.msecs)(50), 3);
                    spy = jest.spyOn(app_1.App.prototype, 'executeAsync')
                        .mockImplementation(function () {
                        throw new Error('Error occured on App');
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, new attempt_1.Attempt(policy)
                            .enableDebugLogging()
                            .executeAsync(function () {
                            return app_1.app.executeAsync();
                        })];
                case 2:
                    _a.sent();
                    return [3, 4];
                case 3:
                    e_1 = _a.sent();
                    expect(e_1).toBeInstanceOf(exhausted_retey_exception_1.ExhaustedRetryException);
                    return [3, 4];
                case 4:
                    expect(spy).toHaveBeenCalledTimes(3);
                    return [2];
            }
        });
    }); });
    it('can handle retry events in EventListener', function () {
        var policy = new simple_retry_policy_1.SimpleRetryPolicy((0, duration_1.msecs)(50), 3);
        jest.spyOn(app_1.App.prototype, 'execute')
            .mockImplementation(function () {
            throw new spec_retry_exception_1.SpecRetryException('Error occured on App');
        });
        var SpecRetryEventListener = (function () {
            function SpecRetryEventListener() {
            }
            SpecRetryEventListener.prototype.onSuccess = function (retryEvent) {
                throw new Error('Should not be as Success');
            };
            SpecRetryEventListener.prototype.onFailed = function (retryEvent) {
                this.attemptCounts = retryEvent.getAttemptCounts();
                this.lastError = retryEvent.getLastError();
            };
            SpecRetryEventListener.prototype.onExhausted = function (retryEvent) {
                retryEvent;
            };
            return SpecRetryEventListener;
        }());
        var listener = new SpecRetryEventListener();
        try {
            new attempt_1.Attempt(policy)
                .addListener(listener)
                .enableDebugLogging()
                .execute(function () {
                return app_1.app.execute();
            });
        }
        catch (e) {
        }
        expect(listener.attemptCounts).toBe(3);
        expect(listener.lastError).toBeInstanceOf(spec_retry_exception_1.SpecRetryException);
    });
    it('can handle retry events in EventListener asynchronously', function () { return __awaiter(void 0, void 0, void 0, function () {
        var policy, SpecRetryEventListener, listener, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    policy = new simple_retry_policy_1.SimpleRetryPolicy((0, duration_1.msecs)(50), 3);
                    jest.spyOn(app_1.App.prototype, 'executeAsync')
                        .mockImplementation(function () {
                        throw new spec_retry_exception_1.SpecRetryException('Error occured on App');
                    });
                    SpecRetryEventListener = (function () {
                        function SpecRetryEventListener() {
                        }
                        SpecRetryEventListener.prototype.onSuccess = function (retryEvent) {
                            throw new Error('Should not be as Success');
                        };
                        SpecRetryEventListener.prototype.onFailed = function (retryEvent) {
                            this.attemptCounts = retryEvent.getAttemptCounts();
                            this.lastError = retryEvent.getLastError();
                        };
                        SpecRetryEventListener.prototype.onExhausted = function (retryEvent) {
                            retryEvent;
                        };
                        return SpecRetryEventListener;
                    }());
                    listener = new SpecRetryEventListener();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, new attempt_1.Attempt(policy)
                            .addListener(listener)
                            .enableDebugLogging()
                            .executeAsync(function () {
                            return app_1.app.executeAsync();
                        })];
                case 2:
                    _a.sent();
                    return [3, 4];
                case 3:
                    e_2 = _a.sent();
                    return [3, 4];
                case 4:
                    expect(listener.attemptCounts).toBe(3);
                    expect(listener.lastError).toBeInstanceOf(spec_retry_exception_1.SpecRetryException);
                    return [2];
            }
        });
    }); });
    it('get default on exhausted', function () {
        var policy = new simple_retry_policy_1.SimpleRetryPolicy((0, duration_1.msecs)(50), 3);
        var spy = jest.spyOn(app_1.App.prototype, 'execute')
            .mockImplementation(function () {
            throw new spec_retry_exception_1.SpecRetryException('Error occured on App');
        });
        var result = new attempt_1.Attempt(policy)
            .enableDebugLogging()
            .executeOrDefault(function () {
            return app_1.app.execute();
        }, 'EXHAUSTED');
        expect(spy).toHaveBeenCalledTimes(3);
        expect(result).toBe('EXHAUSTED');
    });
    it('get default on exhausted asynchronously', function () { return __awaiter(void 0, void 0, void 0, function () {
        var policy, spy, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    policy = new simple_retry_policy_1.SimpleRetryPolicy((0, duration_1.msecs)(50), 3);
                    spy = jest.spyOn(app_1.App.prototype, 'executeAsync')
                        .mockImplementation(function () {
                        throw new spec_retry_exception_1.SpecRetryException('Error occured on App');
                    });
                    return [4, new attempt_1.Attempt(policy)
                            .enableDebugLogging()
                            .executeAsyncOrDefault(function () {
                            return app_1.app.executeAsync();
                        }, 'EXHAUSTED')];
                case 1:
                    result = _a.sent();
                    expect(spy).toHaveBeenCalledTimes(3);
                    expect(result).toBe('EXHAUSTED');
                    return [2];
            }
        });
    }); });
    it('should execute another on exhausted asynchronously', function () { return __awaiter(void 0, void 0, void 0, function () {
        var policy, spy, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    policy = new simple_retry_policy_1.SimpleRetryPolicy((0, duration_1.msecs)(50), 3);
                    spy = jest.spyOn(app_1.App.prototype, 'executeAsync')
                        .mockImplementation(function () {
                        throw new spec_retry_exception_1.SpecRetryException('Error occured on App');
                    });
                    return [4, new attempt_1.Attempt(policy)
                            .enableDebugLogging()
                            .executeAsyncOrElse(function () {
                            return app_1.app.executeAsync();
                        }, function () {
                            return new Promise(function (resolve) { return resolve('EXHAUSTED'); });
                        })];
                case 1:
                    result = _a.sent();
                    expect(spy).toHaveBeenCalledTimes(3);
                    expect(result).toBe('EXHAUSTED');
                    return [2];
            }
        });
    }); });
    it('should execute another on exhausted', function () {
        var policy = new simple_retry_policy_1.SimpleRetryPolicy((0, duration_1.msecs)(50), 3);
        var spy = jest.spyOn(app_1.App.prototype, 'execute')
            .mockImplementation(function () {
            throw new spec_retry_exception_1.SpecRetryException('Error occured on App');
        });
        var result = new attempt_1.Attempt(policy)
            .enableDebugLogging()
            .executeOrElse(function () {
            return app_1.app.execute();
        }, function () {
            return 'EXHAUSTED';
        });
        expect(spy).toHaveBeenCalledTimes(3);
        expect(result).toBe('EXHAUSTED');
    });
    it('should retry only once and can success', function () {
        var policy = new simple_retry_policy_1.SimpleRetryPolicy((0, duration_1.msecs)(50), 3);
        var spy = jest.spyOn(app_1.App.prototype, 'execute')
            .mockImplementationOnce(function () {
            throw new spec_retry_exception_1.SpecRetryException('Error occured on App');
        })
            .mockImplementationOnce(function () {
            return 'test';
        });
        var result;
        try {
            result = new attempt_1.Attempt(policy)
                .enableDebugLogging()
                .execute(function () {
                return app_1.app.execute();
            });
        }
        catch (e) {
        }
        expect(spy).toHaveBeenCalledTimes(2);
        expect(result).toBe('test');
    });
    it('should success normally and handle retry event', function () {
        jest.spyOn(app_1.App.prototype, 'execute').mockImplementationOnce(function () { return 'test'; });
        var AttemptSuccessEventListener = (function () {
            function AttemptSuccessEventListener() {
            }
            AttemptSuccessEventListener.prototype.onSuccess = function (retryEvent) {
                this.isSuccess = retryEvent.isSuccess();
                this.attemptCounts = retryEvent.getAttemptCounts();
            };
            AttemptSuccessEventListener.prototype.onFailed = function (retryEvent) {
                throw new Error('Method not implemented.');
            };
            AttemptSuccessEventListener.prototype.onExhausted = function (retryEvent) {
                throw new Error('Method not implemented.');
            };
            return AttemptSuccessEventListener;
        }());
        var p = simple_retry_policy_1.SimpleRetryPolicy.ofDefaults();
        var listener = new AttemptSuccessEventListener();
        var r = new attempt_1.Attempt(p)
            .addListener(listener)
            .execute((0, operator_1.get)(app_1.app.execute()));
        expect(r).toBe('test');
        expect(listener.isSuccess).toBeTruthy();
        expect(listener.attemptCounts).toBe(0);
    });
});
//# sourceMappingURL=attempt-spec.js.map