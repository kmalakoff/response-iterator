import { AxiosResponse } from "axios";
import { Response as GotResponse } from "got";
import { Response as NodeResponse } from "node-fetch";
import { Response as UndiciResponse } from "undici";
interface CrossFetchResponse {
    _bodyBlob: Blob;
}
export declare type ResponseType = AxiosResponse | CrossFetchResponse | GotResponse | NodeResponse | Response | UndiciResponse;
/**
 * @param response A response. Supports fetch, node-fetch, and cross-fetch
 */
export default function responseIterator<T>(response: ResponseType): AsyncIterableIterator<T>;
export {};
