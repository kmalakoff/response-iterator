const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

/* c8 ignore start */
export default function readerIterator<T, TReturn = unknown, TNext = unknown>(reader: ReadableStreamReader<T>): AsyncIterableIterator<T, TReturn, TNext> {
  const iterator = {
    next(): Promise<IteratorResult<T, TReturn>> {
      return reader.read(undefined) as Promise<IteratorResult<T, TReturn>>;
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
