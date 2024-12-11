import '../lib/polyfill.ts';
import assert from 'assert';
// @ts-ignore
import responseIterator from 'response-iterator';
// @ts-ignore
import decodeUTF8 from '../lib/decodeUTF8.ts';
// @ts-ignore
import stringStream from '../lib/stringStream.browser.ts';
// @ts-ignore
import toText from '../lib/toText.ts';

const _hasIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;
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
    const res = stringStream('{ "name": "response-iterator"}', 'utf8');
    try {
      toText(responseIterator(res)).then((data: string) => {
        assert.deepEqual(JSON.parse(data).name, 'response-iterator');
        done();
      });
    } catch (err) {
      done(err);
    }
  });

  !hasAsync ||
    it('string stream - async', async () => {
      const res = stringStream('{ "name": "response-iterator"}', 'utf8');

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
              try {
                toText(responseIterator(res)).then((data: string) => {
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
