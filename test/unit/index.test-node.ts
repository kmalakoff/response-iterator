import assert from 'assert';
import get from 'get-remote';

// @ts-ignore
import responseIterator from 'response-iterator';
import decodeUTF8 from '../lib/decodeUTF8.cjs';
import '../lib/polyfill.cjs';
import toText from '../lib/toText.cjs';

const hasAsync = typeof process !== 'undefined' && +process.versions.node.split('.')[0] > 10;
const hasConst = typeof process !== 'undefined' && +process.versions.node.split('.')[0] > 0;

describe('response-iterator node', () => {
  it('get-remote', (done) => {
    get('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').stream((err, res) => {
      if (err) return done(err);
      toText(responseIterator(res))
        .then((data) => {
          assert.deepEqual(JSON.parse(data).name, 'response-iterator');
          done();
        })
        .catch(done);
    });
  });

  !hasConst ||
    it('node-fetch', (done) => {
      import('node-fetch')
        .then((nodeFetch) => {
          nodeFetch.default('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').then((res) => {
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

  !hasAsync ||
    it('node-fetch - async', async () => {
      const nodeFetch = await import('node-fetch');
      const res = await nodeFetch.default('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json');

      let data = '';
      for await (const chunk of responseIterator(res)) {
        data += decodeUTF8(chunk);
      }
      assert.deepEqual(JSON.parse(data).name, 'response-iterator');
    });

  !hasAsync ||
    it('got', (done) => {
      import('got')
        .then((got) => {
          const res = got.default.stream('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json');
          toText(responseIterator(res))
            .then((data) => {
              assert.deepEqual(JSON.parse(data).name, 'response-iterator');
              done();
            })
            .catch(done);
        })
        .catch(done);
    });

  !hasAsync ||
    it('undici', (done) => {
      import('undici')
        .then((undici) => {
          undici.request('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').then((res) => {
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
