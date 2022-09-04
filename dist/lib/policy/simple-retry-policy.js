"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleRetryPolicy = void 0;
var duration_1 = require("@/duration");
var SimpleRetryPolicy = (function () {
    function SimpleRetryPolicy(_durationMsec, _maxAttempts) {
        this._durationMsec = _durationMsec;
        this._maxAttempts = _maxAttempts;
        this.errorsNotRetryOn = [];
    }
    SimpleRetryPolicy.ofDefaults = function () {
        return new SimpleRetryPolicy((0, duration_1.seconds)(1), 4);
    };
    SimpleRetryPolicy.prototype.notRetryOn = function (e) {
        this.errorsNotRetryOn.push(e);
    };
    SimpleRetryPolicy.prototype.shouldNotRetry = function (e) {
        return this.errorsNotRetryOn.some(function (v) { return e instanceof v; });
    };
    SimpleRetryPolicy.prototype.equals = function (retryPolicy) {
        return this._maxAttempts === retryPolicy._maxAttempts &&
            this._durationMsec === retryPolicy.durationMsec;
    };
    SimpleRetryPolicy.prototype.toString = function () {
        return "SimpleRetryPolicy(\n      durationMsec=".concat(this._durationMsec, "), maxAttemps=").concat(this._maxAttempts, "\n    )");
    };
    SimpleRetryPolicy.prototype.canRetry = function (retryContext) {
        return !retryContext.lastError ||
            retryContext.attemptsCount < this._maxAttempts;
    };
    SimpleRetryPolicy.prototype.getNextDelay = function () {
        return this._durationMsec;
    };
    Object.defineProperty(SimpleRetryPolicy.prototype, "maxAttempts", {
        get: function () {
            return this._maxAttempts;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SimpleRetryPolicy.prototype, "durationMsec", {
        get: function () {
            return this._durationMsec;
        },
        enumerable: false,
        configurable: true
    });
    return SimpleRetryPolicy;
}());
exports.SimpleRetryPolicy = SimpleRetryPolicy;
(function (SimpleRetryPolicy) {
    SimpleRetryPolicy.newBuilder = function () {
        return new SimpleRetryPolicy.Builder();
    };
    var Builder = (function () {
        function Builder() {
            this.errorsNotRetryOn = [];
        }
        Builder.prototype.duration = function (duration) {
            this._duration = duration;
            return this;
        };
        Builder.prototype.maxAttempts = function (attempts) {
            this._maxAttempts = attempts;
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
            var duration = this._duration ? this._duration : (0, duration_1.seconds)(1);
            var maxAttempts = this._maxAttempts ? this._maxAttempts : 4;
            var policy = new SimpleRetryPolicy(duration, maxAttempts);
            this.errorsNotRetryOn.forEach(function (e) { return policy.notRetryOn(e); });
            return policy;
        };
        return Builder;
    }());
    SimpleRetryPolicy.Builder = Builder;
})(SimpleRetryPolicy = exports.SimpleRetryPolicy || (exports.SimpleRetryPolicy = {}));
exports.SimpleRetryPolicy = SimpleRetryPolicy;
//# sourceMappingURL=simple-retry-policy.js.map