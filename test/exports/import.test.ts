import "../lib/polyfill.cjs";
import { assert } from "chai";
import responseIterator from "response-iterator";
import stringStream from "../lib/stringStream.cjs";
import toText from "../lib/toText.cjs";

describe("exports .ts", function () {
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
