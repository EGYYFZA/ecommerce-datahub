const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { test } = require('node:test');
const expressRequire = createRequire(require.resolve('express'));
const qs = expressRequire('qs');

test('Express uses the patched query parser and retains demo filters', () => {
  assert.equal(expressRequire('qs/package.json').version, '6.16.1');
  assert.deepEqual(qs.parse('username=demo&role=user&tags[]=a&tags[]=b'), {
    username: 'demo', role: 'user', tags: ['a', 'b'],
  });
  assert.throws(() => qs.parse('a[]=1,2,3,4', {
    comma: true, arrayLimit: 3, throwOnLimitExceeded: true,
  }), RangeError);
});
