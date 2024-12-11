const assert = require('assert');
const responseIterator = require('response-iterator');

describe('exports .cjs', () => {
  it('exists', () => {
    assert.equal(typeof responseIterator, 'function');
  });
});
