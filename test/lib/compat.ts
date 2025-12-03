/**
 * Compatibility Layer for Node.js 0.8+
 * Local to this package - contains only needed functions.
 */

// Feature detection (runs once at module load)
var hasBufferFrom = typeof Buffer !== 'undefined' && typeof Buffer.from === 'function' && Buffer.from !== Uint8Array.from;

/**
 * Create a buffer from string, array, or existing buffer
 * - Uses Buffer.from() on Node 4.5+
 * - Falls back to new Buffer() on Node 0.8-4.4
 */
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
    var arr: number[] = [];
    for (var i = 0; i < data.length; i++) {
      arr.push(data[i]);
    }
    return new Buffer(arr);
  }
  return new Buffer(data as string & number[], encoding);
}
