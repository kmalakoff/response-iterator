import type { Readable as NodeReadableStream } from 'stream';

const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

/* c8 ignore start */
export default function nodeStreamIterator<T, TReturn = unknown, TNext = unknown>(stream: NodeReadableStream): AsyncIterableIterator<T, TReturn, TNext> {
  let cleanup = null;
  let error = null;
  let done = false;
  const data = [];
  const waiting = [];

  function onData(chunk) {
    if (error) return;
    if (waiting.length) return waiting.shift()[0]({ value: chunk, done: false });
    data.push(chunk);
  }
  function onError(err) {
    error = err;
    const all = waiting.slice();
    all.forEach((pair) => {
      pair[1](err);
    });
    !cleanup || cleanup();
  }
  function onEnd() {
    done = true;
    const all = waiting.slice();
    all.forEach((pair) => {
      pair[0]({ value: undefined, done: true });
    });
    !cleanup || cleanup();
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
      if (data.length) return resolve({ value: data.shift(), done: false });
      if (done) return resolve({ value: undefined, done: true });
      waiting.push([resolve, reject]);
    });
  }

  const iterator = {
    next(): Promise<IteratorResult<T, TReturn>> {
      return getNext();
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
