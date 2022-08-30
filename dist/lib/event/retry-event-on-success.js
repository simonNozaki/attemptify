"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryEventOnSuccess = void 0;
var RetryEventOnSuccess = (function () {
    function RetryEventOnSuccess(attemptCounts) {
        this.attemptCounts = attemptCounts;
    }
    RetryEventOnSuccess.prototype.getAttemptCounts = function () {
        return this.attemptCounts;
    };
    RetryEventOnSuccess.prototype.isSuccess = function () {
        return true;
    };
    RetryEventOnSuccess.prototype.isFailure = function () {
        return false;
    };
    return RetryEventOnSuccess;
}());
exports.RetryEventOnSuccess = RetryEventOnSuccess;
//# sourceMappingURL=retry-event-on-success.js.map