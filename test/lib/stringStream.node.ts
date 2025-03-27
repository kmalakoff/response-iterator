import { Readable } from 'readable-stream';

export default function stringStream(string: string, encoding: BufferEncoding) {
  let ended = false;
  return new Readable({
    read() {
      if (ended) return;
      ended = true;
      setTimeout(() => {
        // @ts-ignore
        this.push(Buffer.from(string, encoding));
        // @ts-ignore
        this.push(null);
      }, 0);
    },
  });
}
