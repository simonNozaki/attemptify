"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryEventOnFailed = void 0;
var RetryEventOnFailed = (function () {
    function RetryEventOnFailed(attemptCounts, lastError) {
        this.attemptCounts = attemptCounts;
        this.lastError = lastError;
    }
    RetryEventOnFailed.prototype.getAttemptCounts = function () {
        return this.attemptCounts;
    };
    RetryEventOnFailed.prototype.isSuccess = function () {
        return false;
    };
    RetryEventOnFailed.prototype.isFailure = function () {
        return true;
    };
    RetryEventOnFailed.prototype.getLastError = function () {
        return this.lastError;
    };
    return RetryEventOnFailed;
}());
exports.RetryEventOnFailed = RetryEventOnFailed;
//# sourceMappingURL=retry-event-on-failed.js.map