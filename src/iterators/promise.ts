const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

/* c8 ignore start */
export default function promiseIterator<T>(promise): AsyncIterableIterator<T> {
  let resolved = false;

  const iterator = {
    next(): Promise<IteratorResult<T, boolean>> {
      if (resolved) return Promise.resolve({ value: undefined, done: true });
      resolved = true;
      return new Promise((resolve, reject) => {
        promise
          .then((value) => {
            resolve({ value, done: false });
          })
          .catch(reject);
      });
    },
  };

  if (hasIterator) {
    iterator[Symbol.asyncIterator] = function (): AsyncIterator<T> {
      return this;
    };
  }

  return iterator as AsyncIterableIterator<T>;
}
/* c8 ignore stop */
