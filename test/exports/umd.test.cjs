const assert = require('assert');

let responseIterator;
if (typeof window !== 'undefined') {
  responseIterator = window.responseIterator;
} else {
  const [major, minor] = process.versions.node.split('.').map(Number);
  const supportsPackageExports = major > 13 || (major === 13 && minor >= 2) || (major === 12 && minor >= 16);
  const umd = supportsPackageExports ? require('response-iterator/umd') : require('response-iterator/dist/umd/response-iterator.cjs');
  responseIterator = umd.default || umd;
}

describe('exports umd', () => {
  it('exists', () => {
    assert.equal(typeof responseIterator, 'function');
  });
});
