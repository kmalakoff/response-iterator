# response-iterator

Create an async iterator for response bodies from Fetch, node-fetch, cross-fetch, Axios, or Node streams.

## Install

```sh
npm install response-iterator
```

## Use with fetch

```typescript
import responseIterator from 'response-iterator';

const res = await fetch('https://raw.githubusercontent.com/kmalakoff/response-iterator/master/package.json');

const decoder = new TextDecoder();
let data = '';
for await (const chunk of responseIterator(res)) {
  data += typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true });
}
data += decoder.decode();
console.log(JSON.parse(data).name); // "response-iterator"
```

The example uses the global `fetch` available in modern Node.js and browsers. On older Node.js versions, pass a response from a fetch implementation such as `cross-fetch`. Yielded chunks keep the underlying body type, so decode `Uint8Array` chunks before treating them as text.

## Documentation

[API Docs](https://kmalakoff.github.io/response-iterator/)
