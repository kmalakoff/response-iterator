import { assert } from "chai";
import crossFetch from "cross-fetch";
import responseIterator from "response-iterator";
import decodeUTF8 from "../lib/decodeUTF8.cjs";

describe("exports .ts", function () {
  it("cross-fetch", async function () {
    const res = await crossFetch("https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json");

    let data = "";
    for await (const chunk of responseIterator(res)) {
      data += decodeUTF8(chunk);
    }
    assert.deepEqual(JSON.parse(data).name, "response-iterator");
  });
});
