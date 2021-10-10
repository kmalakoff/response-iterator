import { Response as NodeResponse } from "node-fetch";
interface CrossFetchResponse {
    _bodyBlob: Blob;
}
export interface IterableIterator<T> {
    next(): Promise<IteratorResult<T, boolean>>;
    [Symbol.asyncIterator](): Promise<IteratorResult<T, boolean>>;
}
/**
 * @param response A response. Supports fetch, node-fetch, and cross-fetch
 */
export default function responseIterator<T>(response: Response | NodeResponse | CrossFetchResponse): IterableIterator<T>;
export {};
