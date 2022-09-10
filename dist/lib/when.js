"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.when = void 0;
var match = function (value) { return ({
    is: function () { return match(value); },
    default: function () { return value; },
}); };
var chain = function (value) { return ({
    is: function (prediction, producer) {
        return prediction(value) ? match(producer()) : chain(value);
    },
    default: function (producer) { return producer(); },
}); };
var when = function (value) { return ({
    is: function (prediction, producer) {
        return prediction(value) ? match(producer()) : chain(value);
    },
}); };
exports.when = when;
//# sourceMappingURL=when.js.map