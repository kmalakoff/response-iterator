const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

/* c8 ignore start */
export default function promiseIterator<T, TReturn = unknown, TNext = unknown>(promise: Promise<T>): AsyncIterableIterator<T, TReturn, TNext> {
  let resolved = false;

  const iterator: { next(): Promise<IteratorResult<T, TReturn>> } = {
    next(): Promise<IteratorResult<T, TReturn>> {
      if (resolved) return Promise.resolve({ value: undefined as unknown as TReturn, done: true });
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
    (iterator as unknown as AsyncIterableIterator<T, TReturn, TNext>)[Symbol.asyncIterator] = function (): AsyncIterableIterator<T, TReturn, TNext> {
      return this as unknown as AsyncIterableIterator<T, TReturn, TNext>;
    };
  }

  return iterator as unknown as AsyncIterableIterator<T, TReturn, TNext>;
}
/* c8 ignore stop */
