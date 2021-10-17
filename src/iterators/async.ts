export default function asyncIterator<T>(source): AsyncIterableIterator<T> {
  const iterator = source[Symbol.asyncIterator]();
  return {
    next(): Promise<IteratorResult<T, boolean>> {
      return iterator.next();
    },
    [Symbol.asyncIterator](): AsyncIterator<T> {
      return this;
    },
  } as AsyncIterableIterator<T>;
}
