import { assert } from "chai";
import got from "got";
import nodeFetch from "node-fetch";
import { fetch as undiciFetch } from "undici";
import responseIterator from "response-iterator";
import decodeUTF8 from "../lib/decodeUTF8.cjs";

describe("response-iterator node", function () {
  it("node-fetch", async function () {
    const res = await nodeFetch("https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json");

    let data = "";
    for await (const chunk of responseIterator(res)) {
      data += decodeUTF8(chunk);
    }
    assert.deepEqual(JSON.parse(data).name, "response-iterator");
  });

  it("got stream", async function () {
    const res = await got.stream("https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json");

    let data = "";
    for await (const chunk of responseIterator(res)) {
      data += decodeUTF8(chunk);
    }
    assert.deepEqual(JSON.parse(data).name, "response-iterator");
  });

  !undiciFetch ||
    it("undici", async function () {
      const res = await undiciFetch(
        "https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json"
      );

      let data = "";
      for await (const chunk of responseIterator(res)) {
        data += decodeUTF8(chunk);
      }
      assert.deepEqual(JSON.parse(data).name, "response-iterator");
    });
});
