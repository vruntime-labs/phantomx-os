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
  const listeners = new Map();
  const document = {
    querySelectorAll(selector) {
      if (selector === '.window') return [terminal];
      if (selector === '[data-window-launch]') return [];
      return [];
    },
    getElementById(id) { return id === terminal.id ? terminal : id === 'start-menu' ? menu : null; },
    querySelector(selector) { return selector === '.start-btn' ? startButton : null; },
    addEventListener(name, fn) { listeners.set(name, fn); },
    removeEventListener(name) { listeners.delete(name); }
  };
  const window = { innerWidth: 1280, innerHeight: 800, addEventListener() {} };
  const context = { window, document, console };
  vm.runInNewContext(fs.readFileSync(new URL('../kernel.js', import.meta.url), 'utf8'), context);
  return { kernel: window.PhantomKernel, terminal, menu };
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


test('taskbar contains only running or minimized applications', () => {
  const { kernel, terminal, taskbarApps } = bootKernel();
  assert.equal(taskbarApps.children.length, 0);
  kernel.openWindow('terminal-window');
  assert.equal(taskbarApps.children.length, 1);
  assert.equal(taskbarApps.children[0].dataset.windowLaunch, 'terminal-window');
  assert.equal(taskbarApps.children[0].classList.contains('is-active'), true);
  kernel.minimizeWindow('terminal-window');
  assert.equal(taskbarApps.children.length, 1);
  assert.equal(taskbarApps.children[0].classList.contains('is-minimized'), true);
  kernel.closeWindow('terminal-window');
  assert.equal(taskbarApps.children.length, 0);
});
