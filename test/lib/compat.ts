/**
 * Compatibility Layer for Node.js 0.8+
 * Local to this package - contains only needed functions.
 */

import Module from 'module';

const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;

/**
 * Stream compatibility - Transform class
 * - Uses native stream.Transform on Node 0.10+
 * - Falls back to readable-stream for Node 0.8
 */
const major = +process.versions.node.split('.')[0];
export const Readable: typeof import('stream').Readable = major > 0 ? _require('stream').Readable : _require('readable-stream').Readable;
export const Writable: typeof import('stream').Writable = major > 0 ? _require('stream').Writable : _require('readable-stream').Writable;
export const Transform: typeof import('stream').Transform = major > 0 ? _require('stream').Transform : _require('readable-stream').Transform;
export const PassThrough: typeof import('stream').PassThrough = major > 0 ? _require('stream').PassThrough : _require('readable-stream').PassThrough;

/**
 * Create a buffer from string, array, or existing buffer
 * - Uses Buffer.from() on Node 4.5+
 * - Falls back to new Buffer() on Node 0.8-4.4
 */
const hasBufferFrom = typeof Buffer !== 'undefined' && typeof Buffer.from === 'function' && Buffer.from !== Uint8Array.from;
export function bufferFrom(data: string | number[] | Buffer | Uint8Array, encoding?: BufferEncoding): Buffer {
  if (hasBufferFrom) {
    if (typeof data === 'string') {
      return Buffer.from(data, encoding);
    }
    return Buffer.from(data as number[] | Buffer);
  }
  // Node 0.8 compatibility - deprecated Buffer constructor
  // For Uint8Array, convert to array first (needed for crypto output in Node 0.8)
  if (data instanceof Uint8Array && !(data instanceof Buffer)) {
    const arr: number[] = [];
    for (let i = 0; i < data.length; i++) {
      arr.push(data[i]);
    }
    return new Buffer(arr);
  }
  return new Buffer(data as string & number[], encoding);
}
