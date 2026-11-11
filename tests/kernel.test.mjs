import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function makeClassList() {
  const values = new Set();
  return {
    contains: (name) => values.has(name),
    add: (name) => values.add(name),
    remove: (name) => values.delete(name),
    toggle(name, force) {
      const shouldAdd = force === undefined ? !values.has(name) : force;
      if (shouldAdd) values.add(name);
      else values.delete(name);
      return shouldAdd;
    }
  };
}

function createWindow(id) {
  return {
    id, style: { display: 'flex', left: '200px', top: '80px', width: '580px', height: '380px' },
    dataset: {}, classList: makeClassList(), offsetLeft: 200, offsetTop: 80,
    offsetWidth: 580, offsetHeight: 380,
    addEventListener() {}, setAttribute() {}, querySelector() { return null; },
    contains() { return false; }
  };
}

function bootKernel() {
  const terminal = createWindow('terminal-window');
  const menu = { classList: makeClassList(), setAttribute() {}, contains() { return false; } };
  const startButton = { setAttribute() {}, contains() { return false; } };
  const taskbarApps = { children: [], replaceChildren(...nodes) { this.children = nodes; } };
  const listeners = new Map();
  const document = {
    querySelectorAll(selector) {
      if (selector === '.window') return [terminal];
      if (selector === '[data-window-launch]') return taskbarApps.children;
      return [];
    },
    getElementById(id) {
      return id === terminal.id ? terminal : id === 'start-menu' ? menu : id === 'taskbar-apps' ? taskbarApps : null;
    },
    querySelector(selector) { return selector === '.start-btn' ? startButton : null; },
    createElement() {
      return {
        dataset: {}, className: '', classList: makeClassList(), children: [], attributes: {},
        setAttribute(name, value) { this.attributes[name] = value; },
        addEventListener() {}, append(...nodes) { this.children.push(...nodes); }
      };
    },
    addEventListener(name, fn) { listeners.set(name, fn); },
    removeEventListener(name) { listeners.delete(name); }
  };
  const window = {
    innerWidth: 1280, innerHeight: 800, addEventListener() {},
    PhantomAppManifests: { apps: [{ id:'phantom.term', legacyWindowId: 'terminal-window', name: 'PhantomTerm', icon: 'terminal' }] }
  };
  const context = { window, document, console };
  vm.runInNewContext(fs.readFileSync(new URL('../kernel.js', import.meta.url), 'utf8'), context);
  return { kernel: window.PhantomKernel, terminal, menu, taskbarApps };
}

test('opening and closing a window updates process state', () => {
  const { kernel, terminal } = bootKernel();
  assert.equal(terminal.style.display, 'none');
  assert.equal(kernel.activeProcesses.has('terminal-window'), false);
  kernel.openWindow('terminal-window');
  assert.equal(kernel.activeProcesses.get('terminal-window').state, 'running');
  assert.equal(terminal.style.display, 'flex');
  kernel.minimizeWindow('terminal-window');
  assert.equal(kernel.activeProcesses.get('terminal-window').state, 'minimized');
  assert.equal(terminal.style.display, 'none');
  kernel.openWindow('terminal-window');
  assert.equal(kernel.activeProcesses.get('terminal-window').state, 'running');
  assert.equal(terminal.style.display, 'flex');
  kernel.closeWindow('terminal-window');
  assert.equal(kernel.activeProcesses.has('terminal-window'), false);
  assert.equal(terminal.style.display, 'none');
});

test('maximizing and restoring preserves the previous bounds', () => {
  const { kernel, terminal } = bootKernel();
  kernel.maximizeWindow('terminal-window');
  assert.equal(terminal.classList.contains('maximized'), true);
  assert.equal(terminal.style.left, '0px');
  kernel.maximizeWindow('terminal-window');
  assert.equal(terminal.classList.contains('maximized'), false);
  assert.equal(terminal.style.left, '200px');
  assert.equal(terminal.style.top, '80px');
  assert.equal(terminal.style.width, '580px');
});

test('start menu exposes its accessible open state', () => {
  const { kernel, menu } = bootKernel();
  kernel.toggleStartMenu(true);
  assert.equal(menu.classList.contains('open'), true);
  kernel.toggleStartMenu(false);
  assert.equal(menu.classList.contains('open'), false);
});

test('dock shows only running or minimized apps and marks their active state', () => {
  const { kernel, taskbarApps } = bootKernel();
  assert.equal(taskbarApps.children.length, 0);
  kernel.openWindow('terminal-window');
  assert.equal(taskbarApps.children.length, 1);
  const item = taskbarApps.children[0];
  assert.equal(item.dataset.windowLaunch, 'terminal-window');
  assert.equal(item.dataset.appId, 'phantom.term');
  assert.equal(item.classList.contains('is-active'), true);
  assert.equal(item.attributes['aria-pressed'], 'true');
  assert.equal(item.children[0].textContent, '›_');
  kernel.minimizeWindow('terminal-window');
  assert.equal(taskbarApps.children.length, 1);
  const minimizedItem = taskbarApps.children[0];
  assert.equal(minimizedItem.classList.contains('is-minimized'), true);
  assert.equal(minimizedItem.attributes['aria-pressed'], 'false');
  kernel.closeWindow('terminal-window');
  assert.equal(taskbarApps.children.length, 0);
});
