"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryContext = void 0;
var RetryContext = (function () {
    function RetryContext() {
        this._attemptCount = 0;
    }
    Object.defineProperty(RetryContext.prototype, "attemptsCount", {
        get: function () {
            return this._attemptCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RetryContext.prototype, "lastError", {
        get: function () {
            return this._lastError;
        },
        enumerable: false,
        configurable: true
    });
    RetryContext.prototype.updateLastError = function (e) {
        this._lastError = e;
        this._attemptCount++;
    };
    return RetryContext;
}());
exports.RetryContext = RetryContext;
//# sourceMappingURL=retry-context.js.map