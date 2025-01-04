import assert from 'assert';
import responseIterator from 'response-iterator';

describe('exports .mjs', () => {
  it('exists', () => {
    assert.equal(typeof responseIterator, 'function');
  });
});
