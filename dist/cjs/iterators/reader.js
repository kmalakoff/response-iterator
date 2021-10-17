"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = readerIterator;
var hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
/* c8 ignore start */

function readerIterator(reader) {
  var iterator = {
    next: function next() {
      return reader.read();
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
//# sourceMappingURL=reader.js.map