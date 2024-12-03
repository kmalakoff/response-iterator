module.exports = function stringStream(string) {
  if (typeof window === 'undefined') {
    var Readable = null;
    try {
      Readable = require('readable-stream-3');
    } catch (_err) {
      Readable = require('readable-stream-2');
    }

    class StringStream extends Readable {
      constructor(str, encoding) {
        super();
        this._str = str;
        this._encoding = encoding || 'utf8';
      }

      _read() {
        if (!this.ended) {
          process.nextTick(() => {
            this.push(Buffer.from(this._str, this._encoding));
            this.push(null);
          });
          this.ended = true;
        }
      }
    }
    return new StringStream(string);
  }
  // biome-ignore lint/style/noUselessElse: <explanation>
  else {
    return new Response(new Blob([string], { type: 'application/text' }));
  }
};
