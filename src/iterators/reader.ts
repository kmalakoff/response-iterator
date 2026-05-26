const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

/* c8 ignore start */
export default function readerIterator<T, TReturn = unknown, TNext = unknown>(reader: ReadableStreamDefaultReader<T>): AsyncIterableIterator<T, TReturn, TNext> {
  const iterator: { next(): Promise<IteratorResult<T, TReturn>> } = {
    next(): Promise<IteratorResult<T, TReturn>> {
      return reader.read() as Promise<IteratorResult<T, TReturn>>;
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
