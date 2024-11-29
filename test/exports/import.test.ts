import assert from 'assert';
// @ts-ignore
import responseIterator from 'response-iterator';
import '../polyfills.cjs';
import stringStream from '../lib/stringStream.cjs';
import toText from '../lib/toText.cjs';

describe('exports .ts', () => {
  it('string stream', (done) => {
    const res = stringStream('{ "name": "response-iterator"}');
    toText(responseIterator(res))
      .then((data) => {
        assert.deepEqual(JSON.parse(data).name, 'response-iterator');
        done();
      })
      .catch(done);
  });
});
