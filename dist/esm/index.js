function streamIterator(stream) {
  const iterator = stream[Symbol.asyncIterator]();
  return {
    next() {
      return iterator.next();
    },

    [Symbol.asyncIterator]() {
      return this;
    }

  };
}
/* c8 ignore start */


function readerIterator(reader) {
  return {
    next() {
      return reader.read();
    },

    [Symbol.asyncIterator]() {
      return this;
    }

  };
}

function promiseIterator(promise) {
  let resolved = false;
  return {
    next() {
      if (resolved) return Promise.resolve({
        value: undefined,
        done: true
      });
      resolved = true;
      return new Promise(function (resolve, reject) {
        promise.then(function (value) {
          resolve({
            value,
            done: false
          });
        }).catch(reject);
      });
    },

    [Symbol.asyncIterator]() {
      return this;
    }

  };
}
/* c8 ignore stop */

/**
 * @param response A response. Supports fetch, node-fetch, and cross-fetch
 */


function responseIterator(response) {
  if (response === undefined) throw new Error("Missing response for responseIterator"); // node-fetch

  if (response.body && response.body[Symbol.asyncIterator] !== undefined) return streamIterator(response.body);
  /* c8 ignore start */
  // browser fetch
  else if (response.body && response.body.getReader) return readerIterator(response.body.getReader()); // browser cross-fetch
  else if (response._bodyBlob) return promiseIterator(response._bodyBlob.arrayBuffer());
  /* c8 ignore stop */

  throw new Error("Unknown body type for responseIterator");
}

export { responseIterator as default };
//# sourceMappingURL=index.js.map
