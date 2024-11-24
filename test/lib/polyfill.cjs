function polyfill() {
  var root = typeof window === 'undefined' ? global : window;
  if (typeof Promise === 'undefined') {
    root.Promise = require('pinkie-promise');
  }

  if (typeof setImmediate === 'undefined') {
    root.setImmediate = require('next-tick');
  }

  if (typeof Buffer !== 'undefined' && !Buffer.from) {
    Buffer.from = function from(data, encoding) {
      return new Buffer(data, encoding);
    };
  }
}
polyfill();
