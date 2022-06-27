import '../lib/polyfill.cjs';
import assert from 'assert';
import responseIterator from 'response-iterator';
import decodeUTF8 from '../lib/decodeUTF8.cjs';
import stringStream from '../lib/stringStream.cjs';
import toText from '../lib/toText.cjs';

const hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;
const hasAsync = typeof process !== 'undefined' && +process.versions.node.split('.')[0] > 10;
const hasConst = typeof process !== 'undefined' && +process.versions.node.split('.')[0] > 0;

describe('response-iterator', function () {
  it('error: no response', function () {
    try {
      responseIterator(undefined);
      assert.ok(false);
    } catch (err) {
      assert(err);
    }
  });

  it('error: unexpected response', function () {
    const response = 'not-a-response';
    try {
      responseIterator(response as unknown as Response);
      assert.ok(false);
    } catch (err) {
      assert(err);
    }
  });

  it('string stream', function (done) {
    const res = stringStream('{ "name": "response-iterator"}');
    try {
      toText(responseIterator(res)).then(function (data) {
        assert.deepEqual(JSON.parse(data).name, 'response-iterator');
        done();
      });
    } catch (err) {
      done(err);
    }
  });

  !hasAsync ||
    it('string stream - async', async function () {
      const res = stringStream('{ "name": "response-iterator"}');

      const iter = responseIterator(res);

      let data = '';
      for await (const chunk of iter) {
        data += decodeUTF8(chunk);
      }
      assert.deepEqual(JSON.parse(data).name, 'response-iterator');
    });

  !hasConst ||
    it('axios stream or blob', function (done) {
      import('axios')
        .then(function (axios) {
          axios
            .default({
              url: 'https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json',
              responseType: typeof window === 'undefined' ? 'stream' : 'blob',
            })
            .then(function (res) {
              try {
                toText(responseIterator(res)).then(function (data) {
                  assert.deepEqual(JSON.parse(data).name, 'response-iterator');
                  done();
                });
              } catch (err) {
                done(err);
              }
            });
        })
        .catch(done);
    });

  !hasConst ||
    it('fetch or node-fetch', function (done) {
      import('isomorphic-fetch')
        .then(function () {
          fetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').then(function (res) {
            try {
              toText(responseIterator(res)).then(function (data) {
                assert.deepEqual(JSON.parse(data).name, 'response-iterator');
                done();
              });
            } catch (err) {
              done(err);
            }
          });
        })
        .catch(done);
    });

  !hasIterator ||
    !hasAsync ||
    typeof fetch === 'undefined' ||
    it('fetch or node-fetch - async', async function () {
      const res = await fetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json');

      let data = '';
      for await (const chunk of responseIterator(res)) {
        data += decodeUTF8(chunk);
      }
      assert.deepEqual(JSON.parse(data).name, 'response-iterator');
    });

  !hasConst ||
    it('cross-fetch', function (done) {
      import('cross-fetch')
        .then(function (crossFetch) {
          crossFetch.default('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').then(function (res) {
            try {
              toText(responseIterator(res)).then(function (data) {
                assert.deepEqual(JSON.parse(data).name, 'response-iterator');
                done();
              });
            } catch (err) {
              done(err);
            }
          });
        })
        .catch(done);
    });
});
