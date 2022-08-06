"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eq = exports.then = exports.when = void 0;
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
var then = function (value) {
    return function () {
        return value;
    };
};
exports.then = then;
var eq = function (value1) {
    return function (value2) {
        return value1 === value2;
    };
};
exports.eq = eq;
//# sourceMappingURL=when.js.map