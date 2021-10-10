function streamIterator(stream) {
  const iterator = stream[Symbol.asyncIterator]();
  return {
    next: function () {
      return iterator.next();
    },
    [Symbol.asyncIterator]: function () {
      return this;
    }
  };
}
/* c8 ignore start */


function readerIterator(reader) {
  return {
    next: function () {
      return reader.read();
    },
    [Symbol.asyncIterator]: function () {
      return this;
    }
  };
}

function promiseIterator(promise) {
  let resolved = false;
  return {
    next: function () {
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
    [Symbol.asyncIterator]: function () {
      return this;
    }
  };
}
/* c8 ignore stop */


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
