import assert from 'assert';
import responseIterator from 'response-iterator';
import toText from '../lib/toText.ts';

const hasAxiosBrowser = typeof Blob !== 'undefined' && typeof XMLHttpRequest !== 'undefined';

describe('browser adapters', () => {
  !hasAxiosBrowser ||
    it('axios blob', async () => {
      const axios = await import('axios');
      const response = await axios.default({
        url: '/test/fixtures/browser-response.json',
        responseType: 'blob',
      });
      assert.ok(response.data instanceof Blob);
      const data = await toText(responseIterator(response));
      assert.deepEqual(JSON.parse(data as string), { name: 'response-iterator', message: 'Local Axios Blob response' });
    });
});
