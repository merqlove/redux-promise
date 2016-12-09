'use strict';

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _sinon = require('sinon');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function noop() {}
var GIVE_ME_META = 'GIVE_ME_META';
function metaMiddleware() {
  return function (next) {
    return function (action) {
      return action.type === GIVE_ME_META ? next(Object.assign({}, action, { meta: 'here you go' })) : next(action);
    };
  };
}

describe('promiseMiddleware', function () {
  var baseDispatch = void 0;
  var dispatch = void 0;
  var foobar = void 0;
  var err = void 0;

  beforeEach(function () {
    baseDispatch = (0, _sinon.spy)();
    dispatch = function d(action) {
      var methods = { dispatch: d, getState: noop };
      return metaMiddleware()((0, _2.default)(methods)(baseDispatch))(action);
    };
    foobar = { foo: 'bar' };
    err = new Error();
  });

  it('handles Flux standard actions', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return dispatch({
              type: 'ACTION_TYPE',
              payload: Promise.resolve(foobar)
            });

          case 2:

            expect(baseDispatch.calledOnce).to.be.true;
            expect(baseDispatch.firstCall.args[0]).to.deep.equal({
              type: 'ACTION_TYPE',
              payload: foobar
            });

            _context.next = 6;
            return dispatch({
              type: 'ACTION_TYPE',
              payload: Promise.reject(err)
            }).catch(noop);

          case 6:

            expect(baseDispatch.calledTwice).to.be.true;
            expect(baseDispatch.secondCall.args[0]).to.deep.equal({
              type: 'ACTION_TYPE',
              payload: err,
              error: true
            });

            _context.next = 10;
            return expect(dispatch({
              type: 'ACTION_TYPE',
              payload: Promise.reject(err)
            })).to.eventually.be.rejectedWith(err);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('handles promises', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return dispatch(Promise.resolve(foobar));

          case 2:
            expect(baseDispatch.calledOnce).to.be.true;
            expect(baseDispatch.firstCall.args[0]).to.equal(foobar);

            _context2.next = 6;
            return expect(dispatch(Promise.reject(err))).to.eventually.be.rejectedWith(err);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('ignores non-promises', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            dispatch(foobar);
            expect(baseDispatch.calledOnce).to.be.true;
            expect(baseDispatch.firstCall.args[0]).to.equal(foobar);

            dispatch({ type: 'ACTION_TYPE', payload: foobar });
            expect(baseDispatch.calledTwice).to.be.true;
            expect(baseDispatch.secondCall.args[0]).to.deep.equal({
              type: 'ACTION_TYPE',
              payload: foobar
            });

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('starts async dispatches from beginning of middleware chain', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return dispatch(Promise.resolve({ type: GIVE_ME_META }));

          case 2:
            dispatch({ type: GIVE_ME_META });
            expect(baseDispatch.args.map(function (args) {
              return args[0].meta;
            })).to.eql(['here you go', 'here you go']);

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
});