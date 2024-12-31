// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import Promise from 'pinkie-promise';
// @ts-ignore
import decodeUTF8 from './decodeUTF8.ts';

function text(data, iterator) {
  return new Promise((resolve, reject) => {
    iterator
      .next()
      .then((next) => {
        if (next.value !== undefined) data += decodeUTF8(next.value);
        if (next.done) return resolve(data);
        text(data, iterator).then(resolve).catch(reject);
      })
      .catch(reject);
  });
}

export default function toText(iterator) {
  return text('', iterator);
}
