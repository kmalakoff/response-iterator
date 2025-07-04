import type { AxiosResponse } from 'axios';
import type { Response as NodeResponse } from 'node-fetch';
import type { Readable as NodeReadableStream } from 'stream';

import asyncIterator from './iterators/async.js';
import nodeStreamIterator from './iterators/nodeStream.js';
import promiseIterator from './iterators/promise.js';
import readerIterator from './iterators/reader.js';

interface CrossFetchResponse {
  _bodyBlob: Blob;
}

const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

/**
 * @param response A response. Supports fetch, node-fetch, and cross-fetch
 */
export default function responseIterator<T, TReturn = unknown, TNext = unknown>(response: unknown): AsyncIterableIterator<T, TReturn, TNext> {
  if (response === undefined) throw new Error('Missing response for responseIterator');

  // determine the body
  let body: unknown = response;
  if ((response as NodeResponse).body) body = (response as NodeResponse).body;
  // node-fetch, browser fetch, undici
  else if ((response as AxiosResponse).data) body = (response as AxiosResponse).data;
  // axios
  /* c8 ignore start */ else if ((response as CrossFetchResponse)._bodyBlob) body = (response as CrossFetchResponse)._bodyBlob; // cross-fetch
  /* c8 ignore stop */

  // adapt the body
  if (hasIterator && body[Symbol.asyncIterator]) return asyncIterator<T, TReturn, TNext>(body as AsyncIterableIterator<T, TReturn, TNext>);
  /* c8 ignore start */
  if ((body as ReadableStream<T>).getReader) return readerIterator<T, TReturn, TNext>((body as ReadableStream<T>).getReader());
  if ((body as Blob).stream) return readerIterator<T, TReturn, TNext>(((body as Blob).stream() as unknown as ReadableStream<T>).getReader());
  if ((body as Blob).arrayBuffer) return promiseIterator<T, TReturn, TNext>((body as Blob).arrayBuffer() as unknown as Promise<T>);
  if ((body as NodeReadableStream).pipe) return nodeStreamIterator<T, TReturn, TNext>(body as NodeReadableStream);
  /* c8 ignore stop */

  throw new Error('Unknown body type for responseIterator. Maybe you are not passing a streamable response');
}
