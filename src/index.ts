import { Response as NodeResponse } from "node-fetch";

interface CrossFetchResponse {
  _bodyBlob: Blob;
}

export interface IterableIterator<T> {
  next(): Promise<IteratorResult<T, boolean>>;
  [Symbol.asyncIterator](): Promise<IteratorResult<T, boolean>>;
}

function streamIterator<T>(stream): IterableIterator<T> {
  const iterator = stream[Symbol.asyncIterator]();
  return {
    next: function (): Promise<IteratorResult<T, boolean>> {
      return iterator.next();
    },
    [Symbol.asyncIterator]: function (): Promise<IteratorResult<T, boolean>> {
      return this;
    },
  } as IterableIterator<T>;
}

/* c8 ignore start */
function readerIterator<T>(reader): IterableIterator<T> {
  return {
    next: function (): Promise<IteratorResult<T, boolean>> {
      return reader.read();
    },
    [Symbol.asyncIterator]: function (): Promise<IteratorResult<T, boolean>> {
      return this;
    },
  } as IterableIterator<T>;
}

function promiseIterator<T>(promise): IterableIterator<T> {
  let resolved = false;
  return {
    next: function (): Promise<IteratorResult<T, boolean>> {
      if (resolved) return Promise.resolve({ value: undefined, done: true });
      resolved = true;
      return new Promise(function (resolve, reject) {
        promise
          .then(function (value) {
            resolve({ value, done: false });
          })
          .catch(reject);
      });
    },
    [Symbol.asyncIterator]: function (): Promise<IteratorResult<T, boolean>> {
      return this;
    },
  } as IterableIterator<T>;
}
/* c8 ignore stop */

/**
 * @param response A response. Supports fetch, node-fetch, and cross-fetch
 */
export default function responseIterator<T>(
  response: Response | NodeResponse | CrossFetchResponse
): IterableIterator<T> {
  if (response === undefined) throw new Error("Missing response for responseIterator");

  // node-fetch
  if ((response as NodeResponse).body && (response as NodeResponse).body[Symbol.asyncIterator] !== undefined)
    return streamIterator<T>((response as NodeResponse).body);
  /* c8 ignore start */
  // browser fetch
  else if ((response as Response).body && (response as Response).body.getReader)
    return readerIterator<T>((response as Response).body.getReader());
  // browser cross-fetch
  else if ((response as CrossFetchResponse)._bodyBlob)
    return promiseIterator<T>((response as CrossFetchResponse)._bodyBlob.arrayBuffer());
  /* c8 ignore stop */

  throw new Error("Unknown body type for responseIterator");
}
