import { AxiosResponse } from "axios";
import { Response as NodeResponse } from "node-fetch";

interface CrossFetchResponse {
  _bodyBlob: Blob;
}

function streamIterator<T>(stream): AsyncIterableIterator<T> {
  const iterator = stream[Symbol.asyncIterator]();
  return {
    next(): Promise<IteratorResult<T, boolean>> {
      return iterator.next();
    },
    [Symbol.asyncIterator](): AsyncIterator<T> {
      return this;
    },
  } as AsyncIterableIterator<T>;
}

/* c8 ignore start */
function readerIterator<T>(reader): AsyncIterableIterator<T> {
  return {
    next(): Promise<IteratorResult<T, boolean>> {
      return reader.read();
    },
    [Symbol.asyncIterator](): AsyncIterator<T> {
      return this;
    },
  } as AsyncIterableIterator<T>;
}

function promiseIterator<T>(promise): AsyncIterableIterator<T> {
  let resolved = false;
  return {
    next(): Promise<IteratorResult<T, boolean>> {
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
    [Symbol.asyncIterator](): AsyncIterator<T> {
      return this;
    },
  } as AsyncIterableIterator<T>;
}
/* c8 ignore stop */

/**
 * @param response A response. Supports fetch, node-fetch, and cross-fetch
 */
export default function responseIterator<T>(response: unknown): AsyncIterableIterator<T> {
  if (response === undefined) throw new Error("Missing response for responseIterator");

  // determine the body
  let body: unknown = response;
  if ((response as NodeResponse).body) body = (response as NodeResponse).body;
  // node-fetch, browser fetch, undici
  else if ((response as AxiosResponse).data) body = (response as AxiosResponse).data;
  // axios
  /* c8 ignore start */ else if ((response as CrossFetchResponse)._bodyBlob)
    body = (response as CrossFetchResponse)._bodyBlob; // cross-fetch
  /* c8 ignore stop */

  // adapt the body
  if (body[Symbol.asyncIterator]) return streamIterator<T>(body as AsyncIterableIterator<T>);
  /* c8 ignore start */
  if ((body as ReadableStream<T>).getReader) return readerIterator<T>((body as ReadableStream<T>).getReader());
  if ((body as Blob).stream)
    return readerIterator<T>(((body as Blob).stream() as unknown as ReadableStream<T>).getReader());
  if ((body as Blob).arrayBuffer) return promiseIterator<T>((body as Blob).arrayBuffer());
  /* c8 ignore stop */

  throw new Error("Unknown body type for responseIterator. Maybe you are not passing a streamable response");
}
