import assert from 'assert';
// @ts-ignore
import responseIterator from 'response-iterator';
import decodeUTF8 from '../lib/decodeUTF8.cjs';
import '../lib/polyfill.cjs';
import stringStream from '../lib/stringStream.cjs';
import toText from '../lib/toText.cjs';

const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;
const hasAsync = typeof process !== 'undefined' && +process.versions.node.split('.')[0] > 10;
const hasConst = typeof process !== 'undefined' && +process.versions.node.split('.')[0] > 0;

describe('response-iterator', () => {
  it('error: no response', () => {
    try {
      responseIterator(undefined);
      assert.ok(false);
    } catch (err) {
      assert(err);
    }
  });

  it('error: unexpected response', () => {
    const response = 'not-a-response';
    try {
      responseIterator(response as unknown as Response);
      assert.ok(false);
    } catch (err) {
      assert(err);
    }
  });

  it('string stream', (done) => {
    const res = stringStream('{ "name": "response-iterator"}');
    toText(responseIterator(res))
      .then((data) => {
        assert.deepEqual(JSON.parse(data).name, 'response-iterator');
        done();
      })
      .catch(done);
  });

  !hasAsync ||
    it('string stream - async', async () => {
      const res = stringStream('{ "name": "response-iterator"}');

      const iter = responseIterator(res);

      let data = '';
      for await (const chunk of iter) {
        data += decodeUTF8(chunk);
      }
      assert.deepEqual(JSON.parse(data).name, 'response-iterator');
    });

  !hasConst ||
    it('axios stream or blob', (done) => {
      import('axios')
        .then((axios) => {
          axios
            .default({
              url: 'https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json',
              responseType: typeof window === 'undefined' ? 'stream' : 'blob',
            })
            .then((res) => {
              toText(responseIterator(res))
                .then((data) => {
                  assert.deepEqual(JSON.parse(data).name, 'response-iterator');
                  done();
                })
                .catch(done);
            });
        })
        .catch(done);
    });

  !hasConst ||
    it('fetch or node-fetch', (done) => {
      import('isomorphic-fetch')
        .then(() => {
          fetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').then((res) => {
            toText(responseIterator(res))
              .then((data) => {
                assert.deepEqual(JSON.parse(data).name, 'response-iterator');
                done();
              })
              .catch(done);
          });
        })
        .catch(done);
    });

  !hasIterator ||
    !hasAsync ||
    typeof fetch === 'undefined' ||
    it('fetch or node-fetch - async', async () => {
      const res = await fetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json');

      let data = '';
      for await (const chunk of responseIterator(res)) {
        data += decodeUTF8(chunk);
      }
      assert.deepEqual(JSON.parse(data).name, 'response-iterator');
    });

  !hasConst ||
    it('cross-fetch', (done) => {
      import('cross-fetch')
        .then((crossFetch) => {
          crossFetch.default('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').then((res) => {
            toText(responseIterator(res))
              .then((data) => {
                assert.deepEqual(JSON.parse(data).name, 'response-iterator');
                done();
              })
              .catch(done);
          });
        })
        .catch(done);
    });
});
