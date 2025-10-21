import assert from 'assert';
import responseIterator from 'response-iterator';

describe('exports .ts', () => {
  it('exists', () => {
    assert.equal(typeof responseIterator, 'function');
  });
});
