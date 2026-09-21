/**
 * PhantomX OS Kernel v2.2.0
 * Central operating engine for window management, event routing, and process registry.
 */

class Kernel {
  constructor() {
    this.highestZ = 10;
    this.activeProcesses = new Set();
    this.activeWindow = null;
    this.dragOffset = { x: 0, y: 0 };

    this.onDrag = this.onDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
  }

  // Window Management Subsystem
  openWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    win.style.display = "flex";
    this.bringToFront(win);
    this.activeProcesses.add(windowId);
  }

  closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    win.style.display = "none";
    this.activeProcesses.delete(windowId);
  }

  minimizeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    win.style.display = "none";
  }

  maximizeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    if (win.classList.contains("maximized")) {
      win.classList.remove("maximized");
      win.style.top = "80px";
      win.style.left = "200px";
      win.style.width = "580px";
      win.style.height = "380px";
    } else {
      win.classList.add("maximized");
      win.style.top = "0px";
      win.style.left = "0px";
      win.style.width = "100vw";
      win.style.height = "calc(100vh - 50px)";
    }
  }

  bringToFront(win) {
    this.highestZ += 1;
    win.style.zIndex = this.highestZ;
  }

  toggleStartMenu() {
    const menu = document.getElementById("start-menu");
    if (menu) menu.classList.toggle("open");
  }

  // Window Drag Handler
  startDrag(e, windowId) {
    if (e.target.classList.contains('window-dot')) return;
    
    const win = document.getElementById(windowId);
    if (!win || win.classList.contains("maximized")) return;

    this.activeWindow = win;
    this.bringToFront(this.activeWindow);

    this.dragOffset.x = e.clientX - this.activeWindow.offsetLeft;
    this.dragOffset.y = e.clientY - this.activeWindow.offsetTop;

    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.stopDrag);
  }

  onDrag(e) {
    if (!this.activeWindow) return;
    this.activeWindow.style.left = `${e.clientX - this.dragOffset.x}px`;
    this.activeWindow.style.top = `${e.clientY - this.dragOffset.y}px`;
  }

  stopDrag() {
    this.activeWindow = null;
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
  }
}

// Global Kernel Instance
window.PhantomKernel = new Kernel();

// Exported global wrappers for inline HTML event handlers
function openWindow(id) { window.PhantomKernel.openWindow(id); }
function closeWindow(id) { window.PhantomKernel.closeWindow(id); }
function minimizeWindow(id) { window.PhantomKernel.minimizeWindow(id); }
function maximizeWindow(id) { window.PhantomKernel.maximizeWindow(id); }
function toggleStartMenu() { window.PhantomKernel.toggleStartMenu(); }
function startDrag(e, id) { window.PhantomKernel.startDrag(e, id); }
