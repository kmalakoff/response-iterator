import Pinkie from 'pinkie-promise';
import '../lib/polyfill.ts';
import assert from 'assert';
import get from 'get-remote';

// @ts-ignore
import responseIterator from 'response-iterator';
import decodeUTF8 from '../lib/decodeUTF8.ts';
import stringStream from '../lib/stringStream.node.ts';
import toText from '../lib/toText.ts';

const hasConst = typeof process !== 'undefined' && +process.versions.node.split('.')[0] > 0;

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
      toText(responseIterator(res)).then((data: string) => {
        assert.deepEqual(JSON.parse(data as string).name, 'response-iterator');
        done();
      });
    } catch (err) {
      done(err);
    }
  });

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
      function skip() {
        console.log('skipping axios');
        done();
      }

      import('axios')
        .then((axios) =>
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
            })
        )
        .catch(skip);
    });

  it('get-remote stream', (done) => {
    const _res = get('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').stream((err, res) => {
      if (err) {
        done(err.message);
        return;
      }
      try {
        toText(responseIterator(res)).then((data: string) => {
          assert.deepEqual(JSON.parse(data).name, 'response-iterator');
          done();
        });
      } catch (err) {
        done(err);
      }
    });
  });

  !hasConst ||
    it('node-fetch', (done) => {
      function skip() {
        console.log('skipping node-fetch');
        done();
      }

      import('node-fetch')
        .then((nodeFetch) => {
          nodeFetch.default('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').then((res) => {
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
        .catch(skip);
    });

  // it('got stream', (done) => {
  //   import('got')
  //     .then((got) => {
  //       const res = got.stream('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json');
  //       try {
  //         toText(responseIterator(res)).then((data: string) => {
  //           assert.deepEqual(JSON.parse(data).name, 'response-iterator');
  //           done();
  //         });
  //       } catch (err) {
  //         done(err);
  //       }
  //     })
  //     .catch(skip);
  // });

  !hasConst ||
    it('isomorphic-fetch', (done) => {
      function skip() {
        console.log('skipping isomorphic-fetch');
        done();
      }

      import('isomorphic-fetch')
        .then(() => {
          fetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').then((res) => {
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
        .catch(skip);
    });

  typeof fetch === 'undefined' ||
    it('fetch - async', async () => {
      const res = await fetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json');

      let data = '';
      for await (const chunk of responseIterator(res)) {
        data += decodeUTF8(chunk);
      }
      assert.deepEqual(JSON.parse(data).name, 'response-iterator');
    });

  !hasConst ||
    it('cross-fetch', (done) => {
      function skip() {
        console.log('skipping cross-fetch');
        done();
      }

      import('cross-fetch')
        .then((crossFetch) => {
          crossFetch.default('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').then((res) => {
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
        .catch(skip);
    });

  !hasConst ||
    it('undici', (done) => {
      function skip() {
        console.log('skipping undici');
        done();
      }

      import('undici')
        .then((undici) => {
          if (!undici.fetch) return skip();
          undici.fetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json').then((res) => {
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
        .catch(skip);
    });
});
