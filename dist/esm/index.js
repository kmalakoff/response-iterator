import asyncIterator from "./iterators/async.js";
import nodeStreamIterator from "./iterators/nodeStream.js";
import promiseIterator from "./iterators/promise.js";
import readerIterator from "./iterators/reader.js";
const hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
/**
 * @param response A response. Supports fetch, node-fetch, and cross-fetch
 */

export default function responseIterator(response) {
  if (response === undefined) throw new Error("Missing response for responseIterator"); // determine the body

  let body = response;
  if (response.body) body = response.body; // node-fetch, browser fetch, undici
  else if (response.data) body = response.data; // axios

  /* c8 ignore start */
  else if (response._bodyBlob) body = response._bodyBlob; // cross-fetch

  /* c8 ignore stop */
  // adapt the body

  if (hasIterator && body[Symbol.asyncIterator]) return asyncIterator(body);
  /* c8 ignore start */

  if (body.getReader) return readerIterator(body.getReader());
  if (body.stream) return readerIterator(body.stream().getReader());
  if (body.arrayBuffer) return promiseIterator(body.arrayBuffer());
  if (body.pipe) return nodeStreamIterator(body);
  /* c8 ignore stop */

  throw new Error("Unknown body type for responseIterator. Maybe you are not passing a streamable response");
}
//# sourceMappingURL=index.js.map