"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExponentialBackOffRetryPolicy = void 0;
var duration_1 = require("../duration");
var ExponentialBackOffRetryPolicy = (function () {
    function ExponentialBackOffRetryPolicy(_initialDelay, _maxAttempts, _multiplier) {
        this._initialDelay = _initialDelay;
        this._maxAttempts = _maxAttempts;
        this._multiplier = _multiplier;
        this.errorsNotRetryOn = [];
        this.currentDelay = this._initialDelay;
    }
    Object.defineProperty(ExponentialBackOffRetryPolicy.prototype, "initialDelay", {
        get: function () {
            return this._initialDelay;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ExponentialBackOffRetryPolicy.prototype, "maxAttempts", {
        get: function () {
            return this._maxAttempts;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ExponentialBackOffRetryPolicy.prototype, "multiplier", {
        get: function () {
            return this._multiplier;
        },
        enumerable: false,
        configurable: true
    });
    ExponentialBackOffRetryPolicy.ofDefaults = function () {
        return new ExponentialBackOffRetryPolicy((0, duration_1.seconds)(1), 4, 2);
    };
    ExponentialBackOffRetryPolicy.prototype.notRetryOn = function (e) {
        this.errorsNotRetryOn.push(e);
    };
    ExponentialBackOffRetryPolicy.prototype.shouldNotRetry = function (e) {
        return this.errorsNotRetryOn.some(function (v) { return e instanceof v; });
    };
    ExponentialBackOffRetryPolicy.prototype.equals = function (retryPolicy) {
        return this._initialDelay === retryPolicy.initialDelay &&
            this._maxAttempts === retryPolicy.maxAttempts &&
            this._multiplier === retryPolicy._multiplier;
    };
    ExponentialBackOffRetryPolicy.prototype.toString = function () {
        return "ExponentialBackOffRetryPolicy(\n      _initialDelay=".concat(this._initialDelay, "),\n      maxAttemps=").concat(this._maxAttempts, ",\n      multiplier=").concat(this._multiplier, "\n    )");
    };
    ExponentialBackOffRetryPolicy.prototype.canRetry = function (retryContext) {
        return !retryContext.lastError ||
            retryContext.attemptsCount < this._maxAttempts;
    };
    ExponentialBackOffRetryPolicy.prototype.getNextDelay = function () {
        this.currentDelay = this.currentDelay.multiply(this._multiplier);
        return this.currentDelay;
    };
    return ExponentialBackOffRetryPolicy;
}());
exports.ExponentialBackOffRetryPolicy = ExponentialBackOffRetryPolicy;
(function (ExponentialBackOffRetryPolicy) {
    ExponentialBackOffRetryPolicy.builder = function () {
        return new Builder();
    };
    var Builder = (function () {
        function Builder() {
            this.errorsNotRetryOn = [];
        }
        Builder.prototype.initialDelay = function (delay) {
            this._initialDelay = delay;
            return this;
        };
        Builder.prototype.maxAttempts = function (attempts) {
            this._maxAttempts = attempts;
            return this;
        };
        Builder.prototype.multiplier = function (multiplier) {
            this._multiplier = multiplier;
            return this;
        };
        Builder.prototype.notRetryOn = function (e) {
            this.notRetrysOn([e]);
            return this;
        };
        Builder.prototype.notRetrysOn = function (constructors) {
            var _this = this;
            constructors.forEach(function (c) { return _this.errorsNotRetryOn.push(c); });
            return this;
        };
        Builder.prototype.build = function () {
            var initialDelay = this._initialDelay ? this._initialDelay : (0, duration_1.seconds)(1);
            var maxAttemps = this._maxAttempts ? this._maxAttempts : 4;
            var multiplier = this._multiplier ? this._multiplier : 2;
            var policy = new ExponentialBackOffRetryPolicy(initialDelay, maxAttemps, multiplier);
            this.errorsNotRetryOn.forEach(function (e) { return policy.notRetryOn(e); });
            return policy;
        };
        return Builder;
    }());
    ExponentialBackOffRetryPolicy.Builder = Builder;
})(ExponentialBackOffRetryPolicy = exports.ExponentialBackOffRetryPolicy || (exports.ExponentialBackOffRetryPolicy = {}));
exports.ExponentialBackOffRetryPolicy = ExponentialBackOffRetryPolicy;
//# sourceMappingURL=exponential-backoff-retry-policy.js.map