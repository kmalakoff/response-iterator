export default function asyncIterator<T, TReturn = unknown, TNext = unknown>(source: AsyncIterableIterator<T, TReturn, TNext>): AsyncIterableIterator<T, TReturn, TNext> {
  const iterator = source[Symbol.asyncIterator]();
  return {
    next(): Promise<IteratorResult<T, TReturn>> {
      return iterator.next();
    },
    [Symbol.asyncIterator](): AsyncIterator<T, TReturn, TNext> {
      return this;
    },
  } as AsyncIterableIterator<T, TReturn, TNext>;
}
