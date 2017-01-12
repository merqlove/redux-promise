(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['chai', 'chai-as-promised', 'babel-polyfill'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('chai'), require('chai-as-promised'), require('babel-polyfill'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.chai, global.chaiAsPromised, global.babelPolyfill);
    global.init = mod.exports;
  }
})(this, function (_chai, _chaiAsPromised) {
  'use strict';

  var _chai2 = _interopRequireDefault(_chai);

  var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  global.expect = _chai2.default.expect;
  _chai2.default.use(_chaiAsPromised2.default);
});