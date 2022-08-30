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
exports.Attempt = void 0;
var retry_event_on_failed_1 = require("./event/retry-event-on-failed");
var retry_event_on_success_1 = require("./event/retry-event-on-success");
var exception_1 = require("./exception");
var retry_context_1 = require("./retry-context");
var Attempt = (function () {
    function Attempt(retryPolicy) {
        this.retryPolicy = retryPolicy;
        this.requireDebugLogging = false;
        this.retryEventListeners = [];
        this.retryContext = new retry_context_1.RetryContext();
    }
    Attempt.prototype.addListener = function (retryEventListener) {
        this.addListeners([retryEventListener]);
        return this;
    };
    Attempt.prototype.addListeners = function (retryEventListeners) {
        var _this = this;
        retryEventListeners.forEach(function (listener) {
            return _this.retryEventListeners.push(listener);
        });
        return this;
    };
    Attempt.prototype.hasListener = function () {
        return this.retryEventListeners.length > 0;
    };
    Attempt.prototype.enableDebugLogging = function () {
        this.requireDebugLogging = true;
        return this;
    };
    Attempt.prototype.executeAsync = function (producer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.doOnRetryAsync(producer)];
            });
        });
    };
    Attempt.prototype.executeAsyncOrElse = function (producer, another) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.doOnRetryAsync(producer, another)];
            });
        });
    };
    Attempt.prototype.executeAsyncOrDefault = function (producer, defaultValue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.doOnRetryAsync(producer, function () {
                        return defaultValue;
                    })];
            });
        });
    };
    Attempt.prototype.doOnRetryAsync = function (producer, another) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_1, delay;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.retryPolicy.canRetry(this.retryContext)) return [3, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4, producer()];
                    case 2:
                        result = _a.sent();
                        this.notifyRetryEventOnSuccess(this.retryEventListeners, this.retryContext);
                        return [2, result];
                    case 3:
                        e_1 = _a.sent();
                        if (this.retryPolicy.shouldNotRetry(e_1)) {
                            this.logDebugIfRequire(this.requireDebugLogging, "Not retry catching error [".concat(e_1.name, "]"));
                            return [3, 0];
                        }
                        this.retryContext.updateLastError(e_1);
                        delay = this.retryPolicy.getNextDelay();
                        this.logDebugIfRequire(this.requireDebugLogging, "Attempt failed; count => ".concat(this.retryContext.attemptsCount));
                        this.logDebugIfRequire(this.requireDebugLogging, "next waiting ===> ".concat(delay.toMilliSecconds()));
                        this.notifyRetryEventOnFailed(this.retryEventListeners, this.retryContext);
                        return [4, this.wait(delay)];
                    case 4:
                        _a.sent();
                        return [3, 5];
                    case 5: return [3, 0];
                    case 6:
                        if (!another) return [3, 8];
                        return [4, another()];
                    case 7: return [2, _a.sent()];
                    case 8: throw new exception_1.ExhaustedRetryException('Attempt exhaustetd.');
                }
            });
        });
    };
    Attempt.prototype.logDebugIfRequire = function (requireDebugLogging, message) {
        if (requireDebugLogging) {
            console.log(message);
        }
    };
    Attempt.prototype.execute = function (producer) {
        return this.doOnRetry(producer);
    };
    Attempt.prototype.executeOrElse = function (producer, another) {
        return this.doOnRetry(producer, another);
    };
    Attempt.prototype.executeOrDefault = function (producer, defaultValue) {
        return this.doOnRetry(producer, function () {
            return defaultValue;
        });
    };
    Attempt.prototype.doOnRetry = function (producer, another) {
        var _this = this;
        while (this.retryPolicy.canRetry(this.retryContext)) {
            try {
                var result = producer();
                this.notifyRetryEventOnSuccess(this.retryEventListeners, this.retryContext);
                return result;
            }
            catch (e) {
                if (this.retryPolicy.shouldNotRetry(e)) {
                    this.logDebugIfRequire(this.requireDebugLogging, "Not retry catching error [".concat(e.name, "]"));
                    break;
                }
                this.logDebugIfRequire(this.requireDebugLogging, "Attempt failed; count => ".concat(this.retryContext.attemptsCount));
                this.retryContext.updateLastError(e);
                this.notifyRetryEventOnFailed(this.retryEventListeners, this.retryContext);
            }
            var delay = this.retryPolicy.getNextDelay();
            this.wait(delay)
                .then(function (_) { return _; })
                .catch(function (e) {
                _this.logDebugIfRequire(_this.requireDebugLogging, "Error occurred on waiting: ".concat(e));
                console.error("Error occurred on waiting: ".concat(e));
            });
        }
        if (another) {
            return another();
        }
        throw new exception_1.ExhaustedRetryException('Attempt exhaustetd.');
    };
    Attempt.prototype.notifyRetryEventOnSuccess = function (retryEventListeners, retryContext) {
        for (var _i = 0, retryEventListeners_1 = retryEventListeners; _i < retryEventListeners_1.length; _i++) {
            var listener = retryEventListeners_1[_i];
            var retryEvent = new retry_event_on_success_1.RetryEventOnSuccess(retryContext.attemptsCount);
            listener.onSuccess(retryEvent);
        }
    };
    Attempt.prototype.notifyRetryEventOnFailed = function (retryEventListeners, retryContext) {
        for (var _i = 0, retryEventListeners_2 = retryEventListeners; _i < retryEventListeners_2.length; _i++) {
            var listener = retryEventListeners_2[_i];
            var retryEvent = new retry_event_on_failed_1.RetryEventOnFailed(retryContext.attemptsCount, retryContext.lastError);
            listener.onFailed(retryEvent);
        }
    };
    Attempt.prototype.wait = function (duration) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve) {
                        setTimeout(resolve, duration.toMilliSecconds());
                    })];
            });
        });
    };
    return Attempt;
}());
exports.Attempt = Attempt;
//# sourceMappingURL=attempt.js.map