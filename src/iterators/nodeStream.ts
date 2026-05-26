import type { Readable as NodeReadableStream } from 'stream';

const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

/* c8 ignore start */
export default function nodeStreamIterator<T, TReturn = unknown, TNext = unknown>(stream: NodeReadableStream): AsyncIterableIterator<T, TReturn, TNext> {
  type WaitingPair = [(value: IteratorResult<T, TReturn>) => void, (reason?: unknown) => void];
  let cleanup: (() => void) | null = null;
  let error: Error | null = null;
  let done = false;
  const data: T[] = [];
  const waiting: WaitingPair[] = [];

  function onData(chunk: T): void {
    if (error) return;
    if (waiting.length) return (waiting.shift() as WaitingPair)[0]({ value: chunk, done: false });
    data.push(chunk);
  }
  function onError(err: Error): void {
    error = err;
    const all = waiting.slice();
    all.forEach((pair) => {
      pair[1](err);
    });
    if (cleanup) cleanup();
  }
  function onEnd(): void {
    done = true;
    const all = waiting.slice();
    all.forEach((pair) => {
      pair[0]({ value: undefined as unknown as TReturn, done: true });
    });
    if (cleanup) cleanup();
  }

  cleanup = () => {
    cleanup = null;
    stream.removeListener('data', onData);
    stream.removeListener('error', onError);
    stream.removeListener('end', onEnd);
    stream.removeListener('finish', onEnd);
    stream.removeListener('close', onEnd);
  };
  stream.on('data', onData);
  stream.on('error', onError);
  stream.on('end', onEnd);
  stream.on('finish', onEnd);
  stream.on('close', onEnd);

  function getNext(): Promise<IteratorResult<T, TReturn>> {
    return new Promise((resolve, reject) => {
      if (error) return reject(error);
      if (data.length) return resolve({ value: data.shift() as T, done: false });
      if (done) return resolve({ value: undefined as unknown as TReturn, done: true });
      waiting.push([resolve, reject]);
    });
  }

  const iterator: { next(): Promise<IteratorResult<T, TReturn>> } = {
    next(): Promise<IteratorResult<T, TReturn>> {
      return getNext();
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
