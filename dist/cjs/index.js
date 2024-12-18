"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, /**
 * @param response A response. Supports fetch, node-fetch, and cross-fetch
 */ "default", {
    enumerable: true,
    get: function() {
        return responseIterator;
    }
});
var _async = /*#__PURE__*/ _interop_require_default(require("./iterators/async.js"));
var _nodeStream = /*#__PURE__*/ _interop_require_default(require("./iterators/nodeStream.js"));
var _promise = /*#__PURE__*/ _interop_require_default(require("./iterators/promise.js"));
var _reader = /*#__PURE__*/ _interop_require_default(require("./iterators/reader.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;
function responseIterator(response) {
    if (response === undefined) throw new Error('Missing response for responseIterator');
    // determine the body
    var body = response;
    if (response.body) body = response.body;
    else if (response.data) body = response.data;
    else if (response._bodyBlob) body = response._bodyBlob; // cross-fetch
    /* c8 ignore stop */ // adapt the body
    if (hasIterator && body[Symbol.asyncIterator]) return (0, _async.default)(body);
    /* c8 ignore start */ if (body.getReader) return (0, _reader.default)(body.getReader());
    if (body.stream) return (0, _reader.default)(body.stream().getReader());
    if (body.arrayBuffer) return (0, _promise.default)(body.arrayBuffer());
    if (body.pipe) return (0, _nodeStream.default)(body);
    /* c8 ignore stop */ throw new Error('Unknown body type for responseIterator. Maybe you are not passing a streamable response');
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }