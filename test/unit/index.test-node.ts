import assert from 'assert';
import got from 'got';
import nodeFetch from 'node-fetch';
import responseIterator from 'response-iterator';
import { fetch as undiciFetch } from 'undici';
import decodeUTF8 from '../lib/decodeUTF8.cjs';
import '../lib/polyfill.cjs';
import toText from '../lib/toText.cjs';

const hasAsync = typeof process !== 'undefined' && +process.versions.node.split('.')[0] > 10;

describe('response-iterator node', () => {
  it('node-fetch', (done) => {
    nodeFetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').then((res) => {
      toText(responseIterator(res))
        .then((data) => {
          assert.deepEqual(JSON.parse(data).name, 'response-iterator');
          done();
        })
        .catch((err) => done(err));
    });
  });

  !hasAsync ||
    it('node-fetch - async', async () => {
      const res = await nodeFetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json');

      let data = '';
      for await (const chunk of responseIterator(res)) {
        data += decodeUTF8(chunk);
      }
      assert.deepEqual(JSON.parse(data).name, 'response-iterator');
    });

  it('got stream', (done) => {
    const res = got.stream('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json');
    toText(responseIterator(res))
      .then((data) => {
        assert.deepEqual(JSON.parse(data).name, 'response-iterator');
        done();
      })
      .catch((err) => done(err));
  });

  !undiciFetch ||
    it('undici', (done) => {
      undiciFetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').then((res) => {
        toText(responseIterator(res))
          .then((data) => {
            assert.deepEqual(JSON.parse(data).name, 'response-iterator');
            done();
          })
          .catch((err) => done(err));
      });
    });
});
