const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

/* c8 ignore start */
export default function readerIterator<T>(reader): AsyncIterableIterator<T> {
  const iterator = {
    next(): Promise<IteratorResult<T, boolean>> {
      return reader.read();
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
