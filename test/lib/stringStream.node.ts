import StreamCompat from 'readable-stream';
import Stream from 'stream';

const Readable = Stream.Readable || StreamCompat.Readable;

export default function stringStream(string: string, encoding: BufferEncoding): NodeJS.ReadableStream {
  let ended = false;
  return new Readable({
    read() {
      if (ended) return;
      ended = true;
      setTimeout(() => {
        this.push(Buffer.from(string, encoding));
        this.push(null);
      }, 0);
    },
  });
}
