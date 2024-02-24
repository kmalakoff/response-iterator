var decodeUTF8 = require('./decodeUTF8.cjs');

function text(data, iterator) {
  return new Promise((resolve, reject) => {
    iterator
      .next()
      .then((next) => {
        if (next.done) return resolve(data);
        data += decodeUTF8(next.value);
        text(data, iterator).then(resolve).catch(reject);
      })
      .catch(reject);
  });
}

module.exports = function toText(iterator) {
  return text('', iterator);
};
