/* eslint-disable @typescript-eslint/no-var-requires */
const decodeUTF8 = require('./decodeUTF8.cjs');

function text(data, iterator) {
  return new Promise(function (resolve, reject) {
    iterator
      .next()
      .then(function (next) {
        if (next.value !== undefined) data += decodeUTF8(next.value);
        if (next.done) return resolve(data);
        text(data, iterator).then(resolve).catch(reject);
      })
      .catch(reject);
  });
}

module.exports = function toText(iterator) {
  return text('', iterator);
};
