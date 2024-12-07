import assert from 'assert';
import responseIterator from 'response-iterator';
import '../lib/polyfill.cjs';
import stringStream from '../lib/stringStream.cjs';
import toText from '../lib/toText.cjs';

describe('exports .mjs', () => {
  it('string stream', (done) => {
    const res = stringStream('{ "name": "response-iterator"}');
    toText(responseIterator(res))
      .then((data) => {
        assert.deepEqual(JSON.parse(data).name, 'response-iterator');
        done();
      })
      .catch((err) => done(err));
  });
});
