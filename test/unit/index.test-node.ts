import "../lib/polyfill.cjs";
import { assert } from "chai";
import got from "got";
import nodeFetch from "node-fetch";
import { fetch as undiciFetch } from "undici";
import responseIterator from "response-iterator";
import decodeUTF8 from "../lib/decodeUTF8.cjs";
import toText from "../lib/toText.cjs";

const hasAsync = typeof process !== "undefined" && +process.versions.node.split(".")[0] > 10;

describe("response-iterator node", function () {
  it("node-fetch", function (done) {
    nodeFetch("https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json").then(function (res) {
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

  !hasAsync ||
    it("node-fetch - async", async function () {
      const res = await nodeFetch("https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json");

      let data = "";
      for await (const chunk of responseIterator(res)) {
        data += decodeUTF8(chunk);
      }
      assert.deepEqual(JSON.parse(data).name, "response-iterator");
    });

  it("got stream", function (done) {
    const res = got.stream("https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json");
    try {
      toText(responseIterator(res)).then(function (data) {
        assert.deepEqual(JSON.parse(data).name, "response-iterator");
        done();
      });
    } catch (err) {
      done(err);
    }
  });

  !undiciFetch ||
    it("undici", function (done) {
      undiciFetch("https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json").then(function (
        res
      ) {
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
});
