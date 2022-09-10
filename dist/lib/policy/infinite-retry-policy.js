"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfiniteRetryPolicy = void 0;
var InfiniteRetryPolicy = (function () {
    function InfiniteRetryPolicy(_duration) {
        this._duration = _duration;
        this.errorsNotRetryOn = [];
    }
    InfiniteRetryPolicy.prototype.canRetry = function (retryContext) {
        return true;
    };
    InfiniteRetryPolicy.prototype.getNextDelay = function () {
        return this._duration;
    };
    InfiniteRetryPolicy.prototype.notRetryOn = function (e) {
        this.errorsNotRetryOn.push(e);
    };
    InfiniteRetryPolicy.prototype.shouldNotRetry = function (e) {
        return this.errorsNotRetryOn.some(function (v) { return e instanceof v; });
    };
    InfiniteRetryPolicy.prototype.equals = function (retryPolicy) {
        return this._duration.equals(retryPolicy.duration);
    };
    InfiniteRetryPolicy.prototype.toString = function () {
        return "InfiniteRetryPolicy(duration=".concat(this._duration, "))");
    };
    Object.defineProperty(InfiniteRetryPolicy.prototype, "duration", {
        get: function () {
            return this._duration;
        },
        enumerable: false,
        configurable: true
    });
    return InfiniteRetryPolicy;
}());
exports.InfiniteRetryPolicy = InfiniteRetryPolicy;
//# sourceMappingURL=infinite-retry-policy.js.map