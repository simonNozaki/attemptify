"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duration = exports.minutes = exports.seconds = exports.msecs = void 0;
var when_1 = require("./when");
var msecs = function (milliseconds) {
    return Duration.of(milliseconds);
};
exports.msecs = msecs;
var seconds = function (seconds) {
    return Duration.ofSeconds(seconds);
};
exports.seconds = seconds;
var minutes = function (minutes) {
    return Duration.ofMinutes(minutes);
};
exports.minutes = minutes;
var Duration = (function () {
    function Duration(_value, durationUnit) {
        this._value = _value;
        this.durationUnit = durationUnit;
    }
    Object.defineProperty(Duration.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    Duration.of = function (milliseconds) {
        return new Duration(milliseconds, 'milliseconds');
    };
    Duration.ofSeconds = function (seconds) {
        return new Duration(seconds, 'seconds');
    };
    Duration.ofMinutes = function (minutes) {
        return new Duration(minutes, 'minutes');
    };
    Duration.prototype.toMilliSecconds = function () {
        var _this = this;
        return (0, when_1.when)(this.durationUnit)
            .is((0, when_1.eq)('seconds'), function () { return _this._value * 1000; })
            .is((0, when_1.eq)('minutes'), function () { return _this._value * 60000; })
            .default((0, when_1.then)(this._value));
    };
    Duration.prototype.multiply = function (multiplier) {
        return new Duration(this._value * multiplier.value, this.durationUnit);
    };
    Duration.prototype.equals = function (duration) {
        return this._value === duration.value &&
            this.durationUnit === duration.durationUnit;
    };
    Duration.prototype.toString = function () {
        return "Duration(value=".concat(this._value, ", durationUnit=").concat(this.durationUnit, ")");
    };
    return Duration;
}());
exports.Duration = Duration;
//# sourceMappingURL=duration.js.map