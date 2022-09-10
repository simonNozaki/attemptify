"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eq = exports.get = void 0;
var get = function (value) { return function () { return value; }; };
exports.get = get;
var eq = function (v1) { return function (v2) { return v1 === v2; }; };
exports.eq = eq;
//# sourceMappingURL=operator.js.map