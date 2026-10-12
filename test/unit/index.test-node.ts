import assert from 'assert';
import Pinkie from 'pinkie-promise';

import responseIterator from 'response-iterator';
import decodeUTF8 from '../lib/decodeUTF8.ts';
import stringStream from '../lib/stringStream.node.ts';
import toText from '../lib/toText.ts';

const hasAsyncIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;
describe('response-iterator node', () => {
  (() => {
    // patch and restore promise
    if (typeof global === 'undefined') return;
    const globalPromise = global.Promise;
    before(() => {
      global.Promise = Pinkie;
    });
    after(() => {
      global.Promise = globalPromise;
    });
  })();

  it('error: no response', () => {
    assert.throws(() => responseIterator(undefined), Error);
  });

  it('error: unexpected response', () => {
    const response = 'not-a-response';
    assert.throws(() => responseIterator(response as unknown as Response), Error);
  });

  it('string stream', (done) => {
    const res = stringStream('{ "name": "response-iterator"}', 'utf8');
    try {
      toText(responseIterator(res)).then((data) => {
        assert.deepEqual(JSON.parse(data as string).name, 'response-iterator');
        done();
      });
    } catch (err) {
      done(err);
    }
  });

  !hasAsyncIterator ||
    it('string stream - async', async () => {
      const res = stringStream('{ "name": "response-iterator"}', 'utf8');

      const iter = responseIterator(res);

      let data = '';
      for await (const chunk of iter) {
        data += decodeUTF8(chunk as Uint8Array);
      }
      assert.deepEqual(JSON.parse(data as string).name, 'response-iterator');
    });
});
