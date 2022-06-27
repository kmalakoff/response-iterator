"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
module.exports = responseIterator;
var _asyncJs = _interopRequireDefault(require("./iterators/async.js"));
var _nodeStreamJs = _interopRequireDefault(require("./iterators/nodeStream.js"));
var _promiseJs = _interopRequireDefault(require("./iterators/promise.js"));
var _readerJs = _interopRequireDefault(require("./iterators/reader.js"));
function responseIterator(response) {
    if (response === undefined) throw new Error("Missing response for responseIterator");
    // determine the body
    var body = response;
    if (response.body) body = response.body;
    else if (response.data) body = response.data;
    else if (response._bodyBlob) body = response._bodyBlob; // cross-fetch
    /* c8 ignore stop */ // adapt the body
    if (hasIterator && body[Symbol.asyncIterator]) return (0, _asyncJs).default(body);
    /* c8 ignore start */ if (body.getReader) return (0, _readerJs).default(body.getReader());
    if (body.stream) return (0, _readerJs).default(body.stream().getReader());
    if (body.arrayBuffer) return (0, _promiseJs).default(body.arrayBuffer());
    if (body.pipe) return (0, _nodeStreamJs).default(body);
    /* c8 ignore stop */ throw new Error("Unknown body type for responseIterator. Maybe you are not passing a streamable response");
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
