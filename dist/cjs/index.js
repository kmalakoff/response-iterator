'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function streamIterator(stream) {
  var iterator = stream[Symbol.asyncIterator]();
  return _defineProperty({
    next: function next() {
      return iterator.next();
    }
  }, Symbol.asyncIterator, function () {
    return this;
  });
}
/* c8 ignore start */


function readerIterator(reader) {
  return _defineProperty({
    next: function next() {
      return reader.read();
    }
  }, Symbol.asyncIterator, function () {
    return this;
  });
}

function promiseIterator(promise) {
  var resolved = false;
  return _defineProperty({
    next: function next() {
      if (resolved) return Promise.resolve({
        value: undefined,
        done: true
      });
      resolved = true;
      return new Promise(function (resolve, reject) {
        promise.then(function (value) {
          resolve({
            value: value,
            done: false
          });
        })["catch"](reject);
      });
    }
  }, Symbol.asyncIterator, function () {
    return this;
  });
}
/* c8 ignore stop */


/**
 * @param response A response. Supports fetch, node-fetch, and cross-fetch
 */
function responseIterator(response) {
  if (response === undefined) throw new Error("Missing response for responseIterator"); // node node-fetch

  if (response.body && response.body[Symbol.asyncIterator] !== undefined) return streamIterator(response.body);
  /* c8 ignore start */
  // browser fetch or undici
  else if (response.body && response.body.getReader) return readerIterator(response.body.getReader()); // cross platform axios
  else if (response.data) {
    if (response.data.stream) return readerIterator(response.data.stream().getReader());else if (response.data[Symbol.asyncIterator] !== undefined) return streamIterator(response.data);
  } // browser cross-fetch
  else if (response._bodyBlob) return promiseIterator(response._bodyBlob.arrayBuffer()); // node got
  else if (response.readable && response[Symbol.asyncIterator] !== undefined) return streamIterator(response);
  /* c8 ignore stop */

  throw new Error("Unknown body type for responseIterator");
}

module.exports = responseIterator;
//# sourceMappingURL=index.js.map
