import decodeUTF8 from './decodeUTF8.ts';

function text(data: string, iterator: AsyncIterator<Uint8Array>) {
  return new Promise((resolve, reject) => {
    iterator
      .next()
      .then((next: IteratorResult<Uint8Array>) => {
        if (next.value !== undefined) data += decodeUTF8(next.value);
        if (next.done) return resolve(data);
        text(data, iterator).then(resolve).catch(reject);
      })
      .catch(reject);
  });
}

export default function toText(iterator: AsyncIterator<Uint8Array>) {
  return text('', iterator);
}
