if (typeof Buffer !== 'undefined' && !Buffer.from) {
  // @ts-ignore
  Buffer.from = function from(data, encoding) {
    return new Buffer(data, encoding);
  };
}
