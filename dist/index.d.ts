import { Response as NodeResponse } from "node-fetch";
interface CrossFetchResponse {
    _bodyBlob: Blob;
}
/**
 * @param response A response. Supports fetch, node-fetch, and cross-fetch
 */
export default function responseIterator<T>(response: Response | NodeResponse | CrossFetchResponse): AsyncIterableIterator<T>;
export {};
