import { AxiosResponse } from "axios";
import { Response as GotResponse } from "got";
import { Response as NodeResponse } from "node-fetch";
import { Readable as NodeReadableStream } from "stream";
import { Response as UndiciResponse } from "undici";

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

export type ResponseType = AxiosResponse | CrossFetchResponse | GotResponse | NodeResponse | Response | UndiciResponse;

/**
 * @param response A response. Supports fetch, node-fetch, and cross-fetch
 */
export default function responseIterator<T>(response: ResponseType): AsyncIterableIterator<T> {
  if (response === undefined) throw new Error("Missing response for responseIterator");

  // node node-fetch
  if ((response as NodeResponse).body && (response as NodeResponse).body[Symbol.asyncIterator] !== undefined)
    return streamIterator<T>((response as NodeResponse).body);
  /* c8 ignore start */
  // browser fetch or undici
  else if ((response as Response).body && (response as Response).body.getReader)
    return readerIterator<T>((response as Response).body.getReader());
  // cross platform axios
  else if ((response as AxiosResponse).data) {
    if ((response as AxiosResponse<Blob>).data.stream)
      return readerIterator<T>(
        ((response as AxiosResponse<Blob>).data.stream() as unknown as ReadableStream<Uint8Array>).getReader()
      );
    else if ((response as AxiosResponse<NodeReadableStream>).data[Symbol.asyncIterator] !== undefined)
      return streamIterator<T>((response as AxiosResponse<NodeReadableStream>).data);
  }

  // browser cross-fetch
  else if ((response as CrossFetchResponse)._bodyBlob)
    return promiseIterator<T>((response as CrossFetchResponse)._bodyBlob.arrayBuffer());
  // node got
  else if ((response as GotResponse).readable && (response as GotResponse)[Symbol.asyncIterator] !== undefined)
    return streamIterator<T>(response as GotResponse);

  /* c8 ignore stop */

  throw new Error("Unknown body type for responseIterator");
}
