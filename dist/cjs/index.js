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
  if (response === undefined) throw new Error("Missing response for responseIterator"); // determine the body

  var body = response;
  if (response.body) body = response.body; // node-fetch, browser fetch, undici
  else if (response.data) body = response.data; // axios

  /* c8 ignore start */
  else if (response._bodyBlob) body = response._bodyBlob; // cross-fetch

  /* c8 ignore stop */
  // adapt the body

  if (body[Symbol.asyncIterator]) return streamIterator(body);
  /* c8 ignore start */

  if (body.getReader) return readerIterator(body.getReader());
  if (body.stream) return readerIterator(body.stream().getReader());
  if (body.arrayBuffer) return promiseIterator(body.arrayBuffer());
  /* c8 ignore stop */

  throw new Error("Unknown body type for responseIterator. Maybe you are not passing a streamable response");
}

module.exports = responseIterator;
//# sourceMappingURL=index.js.map
