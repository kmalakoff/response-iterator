import assert from 'assert';
// @ts-ignore
import responseIterator from 'response-iterator';

describe('exports .ts', () => {
  it('exists', () => {
    assert.equal(typeof responseIterator, 'function');
  });
});
