require('../polyfills.cjs');
const assert = require('assert');
const responseIterator = require('response-iterator/dist/umd/response-iterator.min.js');
const stringStream = require('../lib/stringStream.cjs');
const toText = require('../lib/toText.cjs');

describe('exports response-iterator/dist/umd/response-iterator.min.js', () => {
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
