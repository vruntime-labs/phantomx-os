/**
 * PhantomX OS Browser Kernel v2.3.1
 * Window lifecycle, focus, process state, and pointer-based window movement.
 * This is a browser UI kernel, not a native operating-system kernel.
 */
class Kernel {
  constructor() {
    this.highestZ = 10;
    this.processes = new Map();
    this.activeWindow = null;
    this.dragOffset = { x: 0, y: 0 };
    this.restoreBounds = new WeakMap();

    this.onDrag = this.onDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);

    document.querySelectorAll('.window').forEach((win) => {
      // Windows start closed. They are registered only when the user launches them.
      win.style.display = 'none';
      win.setAttribute?.('aria-hidden', 'true');
      win.addEventListener('pointerdown', () => this.bringToFront(win));
      const handle = win.querySelector('[data-window-drag-handle]');
      if (handle) handle.addEventListener('pointerdown', (event) => this.startDrag(event, win.id));
    });

    // Use delegated, data-driven controls instead of inline handlers so window
    // lifecycle actions remain reliable when the launcher scripts are loaded.
    document.addEventListener('click', (event) => {
      const control = event.target.closest('[data-window-action]');
      if (!control) return;
      const win = control.closest('.window');
      if (!win) return;
      const action = control.dataset.windowAction;
      if (action === 'close') this.closeWindow(win.id);
      else if (action === 'minimize') this.minimizeWindow(win.id);
      else if (action === 'maximize') this.maximizeWindow(win.id);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.toggleStartMenu(false);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        this.toggleStartMenu(true);
        document.getElementById('start-search')?.focus();
      }
      if ((event.ctrlKey || event.metaKey) && event.altKey && event.key.toLowerCase() === 't') {
        event.preventDefault();
        this.openWindow('terminal-window');
      }
    });
    document.addEventListener('pointerdown', (event) => {
      const menu = document.getElementById('start-menu');
      const startButton = document.querySelector('.start-btn');
      if (menu && menu.classList.contains('open') &&
          !menu.contains(event.target) && !startButton?.contains(event.target)) {
        this.toggleStartMenu(false);
      }
    });
    window.addEventListener('resize', () => this.keepWindowsInBounds());
    this.keepWindowsInBounds();
  }

  get activeProcesses() { return this.processes; }

  getWindow(windowId) { return document.getElementById(windowId); }

  openWindow(windowId) {
    const win = this.getWindow(windowId);
    if (!win) return false;
    win.style.display = 'flex';
    win.setAttribute?.('aria-hidden', 'false');
    this.processes.set(windowId, { state: 'running' });
    this.bringToFront(win);
    this.keepWindowInBounds(win);
    if (windowId === 'terminal-window') {
      const input = win.querySelector('#command-input');
      if (input) input.focus();
    }
    this.updateTaskbar();
    return true;
  }

  closeWindow(windowId) {
    const win = this.getWindow(windowId);
    if (!win) return false;
    win.style.display = 'none';
    win.setAttribute?.('aria-hidden', 'true');
    win.classList.remove('maximized');
    this.processes.delete(windowId);
    if (this.activeWindow === win) this.stopDrag();
    this.updateTaskbar();
    return true;
  }

  minimizeWindow(windowId) {
    const win = this.getWindow(windowId);
    if (!win) return false;
    win.style.display = 'none';
    win.setAttribute?.('aria-hidden', 'true');
    const process = this.processes.get(windowId);
    if (process) process.state = 'minimized';
    if (this.activeWindow === win) this.stopDrag();
    this.updateTaskbar();
    return true;
  }

  maximizeWindow(windowId) {
    const win = this.getWindow(windowId);
    if (!win) return false;

    if (win.classList.contains('maximized')) {
      win.classList.remove('maximized');
      const bounds = this.restoreBounds.get(win);
      if (bounds) {
        win.style.left = bounds.left;
        win.style.top = bounds.top;
        win.style.width = bounds.width;
        win.style.height = bounds.height;
      }
      this.keepWindowInBounds(win);
    } else {
      this.restoreBounds.set(win, {
        left: win.style.left || win.offsetLeft + 'px',
        top: win.style.top || win.offsetTop + 'px',
        width: win.style.width || win.offsetWidth + 'px',
        height: win.style.height || win.offsetHeight + 'px'
      });
      win.classList.add('maximized');
      win.style.left = '0px';
      win.style.top = '0px';
      win.style.width = '100%';
      win.style.height = '100%';
    }
    win.setAttribute?.('aria-hidden', 'false');
    this.bringToFront(win);
    this.updateTaskbar();
    return true;
  }

  bringToFront(win) {
    if (!win) return;
    this.highestZ += 1;
    win.style.zIndex = String(this.highestZ);
    const process = this.processes.get(win.id);
    if (process) process.state = 'running';
  }

  updateTaskbar() {
    const target = document.getElementById('taskbar-apps');
    if (!target) return;

    const catalog = window.PhantomAppManifests;
    const glyphs = {
      terminal: '›_', folder: '▣', 'file-edit': '▤', globe: '◎',
      settings: '⚙', network: '⌘', activity: '≋', 'key-round': '#',
      'scan-search': '⌕', cctv: '◉'
    };
    const buttons = [];

    this.processes.forEach((process, windowId) => {
      const app = catalog?.apps?.find((item) => item.legacyWindowId === windowId);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'taskbar-item';
      button.dataset.windowLaunch = windowId;
      button.setAttribute('aria-label', (app?.name || windowId) + (process.state === 'minimized' ? ' (minimized)' : ''));
      button.title = app?.name || windowId;

      const mark = document.createElement('span');
      mark.className = 'taskbar-terminal-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = glyphs[app?.icon] || '◇';

      const label = document.createElement('span');
      label.textContent = app?.name || windowId.replace(/-window$/, '');
      button.append(mark, label);
      button.classList.toggle('is-active', process.state === 'running');
      button.classList.toggle('is-minimized', process.state === 'minimized');
      button.addEventListener('click', () => this.openWindow(windowId));
      buttons.push(button);
    });

    target.replaceChildren(...buttons);
  }

  toggleStartMenu(force) {
    const menu = document.getElementById('start-menu');
    const button = document.querySelector('.start-btn');
    if (!menu) return;
    const shouldOpen = typeof force === 'boolean' ? force : !menu.classList.contains('open');
    menu.classList.toggle('open', shouldOpen);
    menu.setAttribute('aria-hidden', String(!shouldOpen));
    if (button) button.setAttribute('aria-expanded', String(shouldOpen));
  }

  startDrag(event, windowId) {
    if (event.button !== 0 || event.target.closest('button, input, a, textarea')) return;
    const win = this.getWindow(windowId);
    if (!win || win.classList.contains('maximized')) return;
    event.preventDefault();
    this.activeWindow = win;
    this.bringToFront(win);
    this.dragOffset.x = event.clientX - win.offsetLeft;
    this.dragOffset.y = event.clientY - win.offsetTop;
    document.addEventListener('pointermove', this.onDrag);
    document.addEventListener('pointerup', this.stopDrag);
    document.addEventListener('pointercancel', this.stopDrag);
  }

  onDrag(event) {
    if (!this.activeWindow) return;
    const win = this.activeWindow;
    const maxLeft = Math.max(0, window.innerWidth - Math.min(48, win.offsetWidth));
    const maxTop = Math.max(0, window.innerHeight - 50);
    win.style.left = Math.min(maxLeft, Math.max(0, event.clientX - this.dragOffset.x)) + 'px';
    win.style.top = Math.min(maxTop, Math.max(0, event.clientY - this.dragOffset.y)) + 'px';
  }

  stopDrag() {
    this.activeWindow = null;
    document.removeEventListener('pointermove', this.onDrag);
    document.removeEventListener('pointerup', this.stopDrag);
    document.removeEventListener('pointercancel', this.stopDrag);
  }

  keepWindowInBounds(win) {
    if (!win || win.classList.contains('maximized')) return;
    const maxLeft = Math.max(0, window.innerWidth - Math.min(win.offsetWidth, window.innerWidth));
    const maxTop = Math.max(0, window.innerHeight - 50 - Math.min(win.offsetHeight, window.innerHeight - 50));
    win.style.left = Math.min(maxLeft, Math.max(0, win.offsetLeft)) + 'px';
    win.style.top = Math.min(maxTop, Math.max(0, win.offsetTop)) + 'px';
  }

  keepWindowsInBounds() {
    document.querySelectorAll('.window').forEach((win) => this.keepWindowInBounds(win));
  }
}

window.PhantomKernel = new Kernel();

function openWindow(id) { return window.PhantomKernel.openWindow(id); }
function closeWindow(id) { return window.PhantomKernel.closeWindow(id); }
function minimizeWindow(id) { return window.PhantomKernel.minimizeWindow(id); }
function maximizeWindow(id) { return window.PhantomKernel.maximizeWindow(id); }
function toggleStartMenu(force) { return window.PhantomKernel.toggleStartMenu(force); }
