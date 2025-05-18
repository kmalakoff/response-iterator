const assert = require('assert');

let umd = null;
try {
  umd = require('response-iterator/umd');
} catch (_) {
  umd = require('response-iterator/dist/umd/response-iterator.cjs');
}
const responseIterator = typeof window !== 'undefined' ? window.parserMultipart : umd.default || umd;

describe('exports umd', () => {
  it('exists', () => {
    assert.equal(typeof responseIterator, 'function');
  });
});
