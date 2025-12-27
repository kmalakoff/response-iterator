import { bufferFrom, Readable } from './compat.ts';

export default function stringStream(string: string, encoding: BufferEncoding): NodeJS.ReadableStream {
  let ended = false;
  return new Readable({
    read() {
      if (ended) return;
      ended = true;
      setTimeout(() => {
        this.push(bufferFrom(string, encoding));
        this.push(null);
      }, 0);
    },
  });
}
