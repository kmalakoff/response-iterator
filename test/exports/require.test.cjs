/* eslint-disable @typescript-eslint/no-var-requires */
const { assert } = require("chai");
const crossFetch = require("cross-fetch");
const responseIterator = require("response-iterator");
const decodeUTF8 = require("../lib/decodeUTF8.cjs");

describe("exports .cjs", function () {
  it("cross-fetch", async function () {
    const res = await crossFetch("https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json");

    let data = "";
    for await (const chunk of responseIterator(res)) {
      data += decodeUTF8(chunk);
    }
    assert.deepEqual(JSON.parse(data).name, "response-iterator");
  });
});
