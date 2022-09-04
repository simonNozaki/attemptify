"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Multiplier = exports.multiplierOf = void 0;
var attempt_object_exception_1 = require("./exception/attempt-object-exception");
var multiplierOf = function (multiplier) {
    return new Multiplier(multiplier);
};
exports.multiplierOf = multiplierOf;
var Multiplier = (function () {
    function Multiplier(intValue) {
        if (intValue < 0) {
            throw new attempt_object_exception_1.AttemptObjectException('Multiplier shuold be positive.');
        }
        this.value = Math.round(intValue);
    }
    return Multiplier;
}());
exports.Multiplier = Multiplier;
//# sourceMappingURL=multiplier.js.map