import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function loadPublicPages(allowPopup = true) {
  const opened = [];
  const window = { open(url, target) { opened.push({ url, target }); return allowPopup ? { opener: 'same-origin' } : null; } };
  const document = { baseURI: 'https://vruntime-labs.github.io/phantomx-os/' };
  vm.runInNewContext(fs.readFileSync(new URL('../public-pages.js', import.meta.url), 'utf8'), { window, document, URL });
  return { api: window.PhantomPublicPages, opened };
}

test('resolves all approved public pages by their common command names', () => {
  const { api } = loadPublicPages();
  const cases = [
    ['privacy', 'privacy'], ['contributors', 'contributors'], ['terms', 'terms'],
    ['cookies', 'cookies'], ['disclaimer', 'disclaimer'], ['acceptable use', 'acceptable-use'],
    ['copyright', 'copyright'], ['mit license', 'license'], ['security', 'security'],
    ['legal', 'legal'], ['security.txt', 'security-txt']
  ];
  for (const [query, expected] of cases) assert.equal(api.resolve(query)?.id, expected, query);
});

test('corrects common misspellings without requiring exact capitalization', () => {
  const { api } = loadPublicPages();
  assert.equal(api.resolve('Prvacy')?.id, 'privacy');
  assert.equal(api.resolve('PRIVCY')?.id, 'privacy');
  assert.equal(api.resolve('contributers')?.id, 'contributors');
  assert.equal(api.resolve('disclamer')?.id, 'disclaimer');
});

test('does not turn unrelated terminal input into a public-page navigation', () => {
  const { api } = loadPublicPages();
  assert.equal(api.resolve('rm -rf'), null);
  assert.equal(api.resolve('network scan'), null);
  assert.equal(api.resolve(''), null);
});

test('opens only the allowlisted relative URL in a separate tab', () => {
  const { api, opened } = loadPublicPages();
  assert.equal(api.open('privacy'), true);
  assert.deepEqual(opened, [{ url: 'https://vruntime-labs.github.io/phantomx-os/privacy/', target: '_blank' }]);
  assert.equal(api.open('not-a-page'), false);
});

test('reports a blocked popup instead of claiming the page opened', () => {
  const { api } = loadPublicPages(false);
  assert.equal(api.open('privacy'), false);
});
