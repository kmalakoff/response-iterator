import assert from 'assert';
import get from 'get-remote';
import Pinkie from 'pinkie-promise';

import responseIterator from 'response-iterator';
import decodeUTF8 from '../lib/decodeUTF8.ts';
import stringStream from '../lib/stringStream.node.ts';
import toText from '../lib/toText.ts';

const hasAsyncIterator = typeof Symbol !== 'undefined' && Symbol.asyncIterator;
const [nodeMajor, nodeMinor, nodePatch] = process.versions.node.split('.').map(Number);
const hasNodeFetch = nodeMajor >= 16 || (nodeMajor === 14 && (nodeMinor > 13 || (nodeMinor === 13 && nodePatch >= 1))) || (nodeMajor === 12 && nodeMinor >= 20);
const hasUndici = nodeMajor > 22 || (nodeMajor === 22 && nodeMinor >= 19);

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

  it('axios stream or blob', (done) => {
    import('axios')
      .then((axios) =>
        axios.default({
          url: 'https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json',
          responseType: 'stream',
        })
      )
      .then((res) => toText(responseIterator(res)))
      .then((data) => {
        assert.deepEqual(JSON.parse(data as string).name, 'response-iterator');
        done();
      })
      .catch(done);
  });

  hasNodeFetch &&
    it('node-fetch', (done) => {
      import('node-fetch')
        .then((nodeFetch) => nodeFetch.default('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json'))
        .then((res) => toText(responseIterator(res)))
        .then((data) => {
          assert.deepEqual(JSON.parse(data as string).name, 'response-iterator');
          done();
        })
        .catch(done);
    });

  it('get-remote stream', (done) => {
    const _res = get('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').stream((err, res) => {
      if (err) return done(err);
      try {
        toText(responseIterator(res)).then((data) => {
          assert.deepEqual(JSON.parse(data as string).name, 'response-iterator');
          done();
        });
      } catch (err) {
        done(err);
      }
    });
  });

  // it('got stream', (done) => {
  //   import('got')
  //     .then((got) => {
  //       const res = got.stream('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json');
  //       try {
  //         toText(responseIterator(res)).then((data) => {
  //           assert.deepEqual(JSON.parse(data as string).name, 'response-iterator');
  //           done();
  //         });
  //       } catch (err) {
  //         done(err);
  //       }
  //     })
  //     .catch(skip);
  // });

  it('isomorphic-fetch', (done) => {
    import('isomorphic-fetch')
      .then(() => fetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json'))
      .then((res) => toText(responseIterator(res)))
      .then((data) => {
        assert.deepEqual(JSON.parse(data as string).name, 'response-iterator');
        done();
      })
      .catch(done);
  });

  typeof fetch === 'undefined' ||
    it('fetch - async', async () => {
      const res = await fetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json');

      let data = '';
      for await (const chunk of responseIterator(res)) {
        data += decodeUTF8(chunk as Uint8Array);
      }
      assert.deepEqual(JSON.parse(data as string).name, 'response-iterator');
    });

  it('cross-fetch', (done) => {
    import('cross-fetch')
      .then((crossFetch) => crossFetch.default('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json'))
      .then((res) => toText(responseIterator(res)))
      .then((data) => {
        assert.deepEqual(JSON.parse(data as string).name, 'response-iterator');
        done();
      })
      .catch(done);
  });

  hasUndici &&
    it('undici', (done) => {
      import('undici')
        .then((undici) => undici.fetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json'))
        .then((res) => toText(responseIterator(res)))
        .then((data) => {
          assert.deepEqual(JSON.parse(data as string).name, 'response-iterator');
          done();
        })
        .catch(done);
    });
});
