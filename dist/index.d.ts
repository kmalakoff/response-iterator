import { Response as NodeResponse } from "node-fetch";
interface CrossResponse {
    _bodyBlob: Blob;
}
export interface IterableIterator<T> {
    next(): Promise<IteratorResult<T, boolean>>;
    [Symbol.asyncIterator](): Promise<IteratorResult<T, boolean>>;
}
export default function responseIterator<T>(response: Response | NodeResponse | CrossResponse): IterableIterator<T>;
export {};
