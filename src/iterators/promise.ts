const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

/* c8 ignore start */
export default function promiseIterator<T, TReturn = unknown, TNext = unknown>(promise: Promise<T>): AsyncIterableIterator<T, TReturn, TNext> {
  let resolved = false;

  const iterator = {
    next(): Promise<IteratorResult<T, TReturn>> {
      if (resolved) return Promise.resolve({ value: undefined, done: true });
      resolved = true;
      return new Promise((resolve, reject) => {
        promise
          .then((value: T) => {
            resolve({ value, done: false } as IteratorResult<T, TReturn>);
          })
          .catch(reject);
      });
    },
  };

  if (hasIterator) {
    iterator[Symbol.asyncIterator] = function (): AsyncIterator<T, TReturn> {
      return this;
    };
  }

  return iterator as AsyncIterableIterator<T, TReturn, TNext>;
}
/* c8 ignore stop */
