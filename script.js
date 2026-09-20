// Clock functionality
function updateClock() {
  const now = new Date();
  document.getElementById('clock').innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Window management
function openWindow(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeWindow(id) {
  document.getElementById(id).classList.add('hidden');
}

// Window Dragging Logic
let activeWin = null;
let offsetX = 0, offsetY = 0;

function dragMouseDown(e, winId) {
  activeWin = document.getElementById(winId);
  offsetX = e.clientX - activeWin.offsetLeft;
  offsetY = e.clientY - activeWin.offsetTop;
  document.onmousemove = elementDrag;
  document.onmouseup = closeDragElement;
}

function elementDrag(e) {
  if (!activeWin) return;
  activeWin.style.left = (e.clientX - offsetX) + "px";
  activeWin.style.top = (e.clientY - offsetY) + "px";
}

function closeDragElement() {
  document.onmousemove = null;
  document.onmouseup = null;
  activeWin = null;
}

// Simple Terminal Interaction
function handleCommand(e) {
  if (e.key === 'Enter') {
    const input = e.target.value.trim().toLowerCase();
    const body = document.querySelector('.terminal-body');
    
    let output = document.createElement('p');
    output.className = 'term-text';
    
    if (input === 'help') {
      output.innerText = "Available commands: help, clear, version";
    } else if (input === 'version') {
      output.innerText = "PhantomX OS version 2.0.1 (Refactored Core)";
    } else if (input === 'clear') {
      body.querySelectorAll('p').forEach(p => p.remove());
      e.target.value = '';
      return;
    } else {
      output.innerText = `Command not recognized: ${input}`;
    }

    body.insertBefore(output, document.querySelector('.input-line'));
    e.target.value = '';
  }
}
