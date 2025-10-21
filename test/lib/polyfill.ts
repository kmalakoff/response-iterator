if (typeof Buffer !== 'undefined' && !Buffer.from) {
  // @ts-expect-error
  Buffer.from = function from(data, encoding) {
    return new Buffer(data, encoding);
  };
}
