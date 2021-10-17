"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = nodeStreamIterator;
var hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
/* c8 ignore start */

function nodeStreamIterator(stream) {
  var _cleanup = null;
  var error = null;
  var done = false;
  var data = [];
  var waiting = [];

  function onData(chunk) {
    if (error) return;
    if (waiting.length) return waiting.shift()[0]({
      value: chunk,
      done: false
    });
    data.push(chunk);
  }

  function onError(err) {
    error = err;
    var all = waiting.slice();
    all.forEach(function (pair) {
      pair[1](err);
    });
    !_cleanup || _cleanup();
  }

  function onEnd() {
    done = true;
    var all = waiting.slice();
    all.forEach(function (pair) {
      pair[0]({
        value: undefined,
        done: true
      });
    });
    !_cleanup || _cleanup();
  }

  _cleanup = function cleanup() {
    _cleanup = null;
    stream.removeListener("data", onData);
    stream.removeListener("error", onError);
    stream.removeListener("end", onEnd);
    stream.removeListener("finish", onEnd);
    stream.removeListener("close", onEnd);
  };

  stream.on("data", onData);
  stream.on("error", onError);
  stream.on("end", onEnd);
  stream.on("finish", onEnd);
  stream.on("close", onEnd);

  function getNext() {
    return new Promise(function (resolve, reject) {
      if (error) return reject(error);
      if (data.length) return resolve({
        value: data.shift(),
        done: false
      });
      if (done) return resolve({
        value: undefined,
        done: true
      });
      waiting.push([resolve, reject]);
    });
  }

  var iterator = {
    next: function next() {
      return getNext();
    }
  };

  if (hasIterator) {
    iterator[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  return iterator;
}
/* c8 ignore stop */


module.exports = exports.default;
//# sourceMappingURL=nodeStream.js.map