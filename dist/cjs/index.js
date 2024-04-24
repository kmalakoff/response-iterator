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
var _asyncts = /*#__PURE__*/ _interop_require_default(require("./iterators/async.js"));
var _nodeStreamts = /*#__PURE__*/ _interop_require_default(require("./iterators/nodeStream.js"));
var _promisets = /*#__PURE__*/ _interop_require_default(require("./iterators/promise.js"));
var _readerts = /*#__PURE__*/ _interop_require_default(require("./iterators/reader.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
function responseIterator(response) {
    if (response === undefined) throw new Error("Missing response for responseIterator");
    // determine the body
    var body = response;
    if (response.body) body = response.body;
    else if (response.data) body = response.data;
    else if (response._bodyBlob) body = response._bodyBlob; // cross-fetch
    /* c8 ignore stop */ // adapt the body
    if (hasIterator && body[Symbol.asyncIterator]) return (0, _asyncts.default)(body);
    /* c8 ignore start */ if (body.getReader) return (0, _readerts.default)(body.getReader());
    if (body.stream) return (0, _readerts.default)(body.stream().getReader());
    if (body.arrayBuffer) return (0, _promisets.default)(body.arrayBuffer());
    if (body.pipe) return (0, _nodeStreamts.default)(body);
    /* c8 ignore stop */ throw new Error("Unknown body type for responseIterator. Maybe you are not passing a streamable response");
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }