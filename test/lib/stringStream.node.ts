import Readable from 'readable-stream';

export default function stringStream(string: string, encoding: BufferEncoding) {
  class StringStream extends Readable {
    _string: string;
    _encoding: BufferEncoding;
    _ended: boolean;

    constructor(string: string, encoding: BufferEncoding = 'utf8') {
      super();
      this._string = string;
      this._encoding = encoding;
    }

    _read() {
      if (!this._ended) {
        this._ended = true;
        process.nextTick(() => {
          // @ts-ignore
          this.push(Buffer.from(this._string, this._encoding));
          // @ts-ignore
          this.push(null);
        });
      }
    }
  }
  return new StringStream(string, encoding);
}
