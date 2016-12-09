'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = promiseMiddleware;

var _fluxStandardAction = require('flux-standard-action');

function isPromise(val) {
  return val && typeof val.then === 'function';
}

function promiseMiddleware(_ref) {
  var dispatch = _ref.dispatch;

  return function (next) {
    return function (action) {
      if (!(0, _fluxStandardAction.isFSA)(action)) {
        return isPromise(action) ? action.then(dispatch) : next(action);
      }

      return isPromise(action.payload) && !action.error ? action.payload.then(function (result) {
        return dispatch(Object.assign({}, action, { payload: result }));
      }, function (error) {
        dispatch(Object.assign({}, action, { payload: error, error: true }));
        throw error;
      }) : next(action);
    };
  };
}