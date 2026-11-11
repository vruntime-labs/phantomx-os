import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

test('launcher HTML does not contain literal escaped newline text', () => {
  assert.equal(html.includes(String.raw\`\\n\`), false);
});

test('service worker precaches every local runtime script loaded by the page', () => {
  const scripts = [...html.matchAll(/<script\\s+src=["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((src) => src.startsWith('./'));
  for (const src of scripts) {
    assert.ok(serviceWorker.includes(src), `Missing from service-worker app shell: ${src}`);
  }
});
