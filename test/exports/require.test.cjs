/* eslint-disable @typescript-eslint/no-var-requires */
require("../lib/polyfill.cjs");
const assert = require("assert");
const responseIterator = require("response-iterator");
const stringStream = require("../lib/stringStream.cjs");
const toText = require("../lib/toText.cjs");

describe("exports .cjs", function () {
  it("string stream", function (done) {
    const res = stringStream('{ "name": "response-iterator"}');
    try {
      toText(responseIterator(res)).then(function (data) {
        assert.deepEqual(JSON.parse(data).name, "response-iterator");
        done();
      });
    } catch (err) {
      done(err);
    }
  });
});
