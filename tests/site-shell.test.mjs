import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

test('launcher HTML does not contain literal escaped newline text', () => {
  assert.equal(html.includes(String.fromCharCode(92) + 'n'), false);
});

test('service worker precaches every local runtime script loaded by the page', () => {
  const scripts = html.split('<script src="').slice(1).map((part) => part.split('"')[0]);
  for (const src of scripts) {
    assert.ok(serviceWorker.includes(src), 'Missing from service-worker app shell: ' + src);
  }
});


test('taskbar does not contain the full application catalogue at startup', () => {
  const taskbar = html.split('<footer id="taskbar"')[1]?.split('</footer>')[0] || '';
  assert.ok(taskbar.includes('id="taskbar-apps"'));
  assert.equal(taskbar.includes('data-window-launch='), false);
});

test('NetBrowser and OpenCam expose public website and OpenCCTV viewer surfaces', () => {
  assert.ok(html.includes('id="netbrowser-frame"'));
  assert.ok(html.includes('id="netbrowser-open-external"'));
  assert.ok(html.includes('id="opencam-player"'));
  assert.ok(html.includes('id="opencam-load-directory"'));
  assert.ok(serviceWorker.includes('./apps/browser-utils.js'));
});
