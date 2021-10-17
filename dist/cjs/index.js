"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = responseIterator;

var _async = _interopRequireDefault(require("./iterators/async"));

var _nodeStream = _interopRequireDefault(require("./iterators/nodeStream"));

var _promise = _interopRequireDefault(require("./iterators/promise"));

var _reader = _interopRequireDefault(require("./iterators/reader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
/**
 * @param response A response. Supports fetch, node-fetch, and cross-fetch
 */

function responseIterator(response) {
  if (response === undefined) throw new Error("Missing response for responseIterator"); // determine the body

  var body = response;
  if (response.body) body = response.body; // node-fetch, browser fetch, undici
  else if (response.data) body = response.data; // axios

  /* c8 ignore start */
  else if (response._bodyBlob) body = response._bodyBlob; // cross-fetch

  /* c8 ignore stop */
  // adapt the body

  if (hasIterator && body[Symbol.asyncIterator]) return (0, _async["default"])(body);
  /* c8 ignore start */

  if (body.getReader) return (0, _reader["default"])(body.getReader());
  if (body.stream) return (0, _reader["default"])(body.stream().getReader());
  if (body.arrayBuffer) return (0, _promise["default"])(body.arrayBuffer());
  if (body.pipe) return (0, _nodeStream["default"])(body);
  /* c8 ignore stop */

  throw new Error("Unknown body type for responseIterator. Maybe you are not passing a streamable response");
}

module.exports = exports.default;
//# sourceMappingURL=index.js.map