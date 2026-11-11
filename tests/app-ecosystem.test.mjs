import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function loadAppRuntime() {
  const opened = [];
  const window = {
    PhantomKernel: {
      getWindow(id) { return id === 'terminal-window' ? { id } : null; },
      openWindow(id) { opened.push(id); return id === 'terminal-window'; }
    }
  };
  const context = { window, console };
  for (const path of ['../apps/app-manifests.js', '../app-registry.js', '../vfs.js']) {
    vm.runInNewContext(fs.readFileSync(new URL(path, import.meta.url), 'utf8'), context);
  }
  return { window, opened };
}

test('catalog registers the complete requested app ecosystem', () => {
  const { window } = loadAppRuntime();
  assert.equal(window.PhantomAppRegistry.list().length, 13);
  assert.equal(window.PhantomAppRegistry.get('phantom.term').status, 'available');
  assert.equal(window.PhantomAppRegistry.get('phantom.opencam').status, 'planned');
});

test('registry launches only apps with an available registered window', () => {
  const { window, opened } = loadAppRuntime();
  assert.equal(window.PhantomAppRegistry.launch('phantom.term').ok, true);
  assert.equal(window.PhantomAppRegistry.launch('phantom.vfs-explorer').reason, 'not-implemented');
  assert.equal(window.PhantomAppRegistry.launch('missing.app').reason, 'unknown-app');
  assert.deepEqual(opened, ['terminal-window']);
});

test('terminal app can create and read files through the shared VFS', () => {
  const { window } = loadAppRuntime();
  const terminal = window.PhantomVFS.forApp('phantom.term');
  terminal.mkdir('shared');
  terminal.writeFile('/home/shared/mission.txt', 'mission data');
  assert.equal(terminal.readFile('/home/shared/mission.txt'), 'mission data');
  assert.equal(terminal.list('/home/shared')[0].name, 'mission.txt');
});

test('VFS denies capabilities not declared by an available app', () => {
  const { window } = loadAppRuntime();
  const explorer = window.PhantomVFS.forApp('phantom.vfs-explorer');
  assert.throws(() => explorer.list('/'), /Permission denied/);
  assert.throws(() => explorer.writeFile('/home/blocked.txt', 'nope'), /Permission denied/);
});

test('VFS normalizes relative paths and rejects missing parent directories', () => {
  const { window } = loadAppRuntime();
  const terminal = window.PhantomVFS.forApp('phantom.term');
  assert.equal(terminal.normalizePath('../logs/trace.log', '/home'), '/logs/trace.log');
  assert.throws(() => terminal.touch('/missing/file.txt'), /Parent directory does not exist/);
});
