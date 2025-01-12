const assert = require('assert');
const responseIterator = require('response-iterator/dist/umd/response-iterator.cjs');

describe('exports response-iterator/dist/umd/response-iterator.cjs', () => {
  it('exists', () => {
    assert.equal(typeof responseIterator, 'function');
  });
});
