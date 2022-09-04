"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.App = void 0;
var App = (function () {
    function App() {
    }
    App.prototype.execute = function () {
        return 'test';
    };
    App.prototype.executeAsync = function () {
        throw new Promise(function (resolve) { return resolve('test'); });
    };
    return App;
}());
exports.App = App;
exports.app = new App();
//# sourceMappingURL=app.js.map