import { assert } from "chai";
import "isomorphic-fetch";
import axios from "axios";
import crossFetch from "cross-fetch";
import responseIterator from "response-iterator";
import decodeUTF8 from "../lib/decodeUTF8.cjs";

describe("response-iterator", function () {
  it("error: no response", async function () {
    assert.throw(() => responseIterator(undefined));
  });

  it("error: unexpected response", async function () {
    const response = "not-a-response";
    assert.throw(() => responseIterator(response as unknown as Response));
  });

  it("fetch", async function () {
    const res = await fetch("https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json");

    let data = "";
    for await (const chunk of responseIterator(res)) {
      data += decodeUTF8(chunk);
    }
    assert.deepEqual(JSON.parse(data).name, "response-iterator");
  });

  it("cross-fetch", async function () {
    const res = await crossFetch("https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json");

    let data = "";
    for await (const chunk of responseIterator(res)) {
      data += decodeUTF8(chunk);
    }
    assert.deepEqual(JSON.parse(data).name, "response-iterator");
  });

  it("axios stream", async function () {
    const res = await axios({
      url: "https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json",
      responseType: typeof window === "undefined" ? "stream" : "blob",
    });

    let data = "";
    for await (const chunk of responseIterator(res)) {
      data += decodeUTF8(chunk);
    }
    assert.deepEqual(JSON.parse(data).name, "response-iterator");
  });
});
