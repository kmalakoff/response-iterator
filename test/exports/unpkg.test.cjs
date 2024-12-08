const assert = require('assert');
const responseIterator = require('response-iterator/dist/umd/response-iterator.js');

describe('exports response-iterator/dist/umd/response-iterator.js', () => {
  it('exists', () => {
    assert.equal(typeof responseIterator, 'function');
  });
});
