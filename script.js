document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("command-input");
  const body = document.getElementById("terminal-body");
  const clock = document.getElementById("taskbar-clock");

  // Real-time Clock
  function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  setInterval(updateClock, 1000);
  updateClock();

  // CLI Commands
  const commands = {
    help: "Available commands: <br> • <b style='color:#34d399'>help</b> - Show options<br> • <b style='color:#34d399'>about</b> - About system<br> • <b style='color:#34d399'>clear</b> - Clear screen",
    about: "PhantomX OS v2.1.0 — Modern Web Desktop Kernel."
  };

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const command = input.value.trim().toLowerCase();
        
        const userLine = document.createElement("p");
        userLine.innerHTML = `<span class="prompt">user@phantomx:~$</span> ${input.value}`;
        body.appendChild(userLine);

        if (command === "clear") {
          body.innerHTML = "";
        } else if (commands[command]) {
          const response = document.createElement("p");
          response.innerHTML = commands[command];
          body.appendChild(response);
        } else if (command !== "") {
          const error = document.createElement("p");
          error.style.color = "#ef4444";
          error.textContent = `Command not recognized: '${command}'`;
          body.appendChild(error);
        }

        input.value = "";
        body.scrollTop = body.scrollHeight;
      }
    });
  }
});

// Window Management Engine
function openWindow(windowId) {
  const win = document.getElementById(windowId);
  if (win) {
    win.style.display = "flex";
    bringToFront(win);
  }
}

function closeWindow(windowId) {
  const win = document.getElementById(windowId);
  if (win) {
    win.style.display = "none";
  }
}

function bringToFront(win) {
  document.querySelectorAll('.window').forEach(w => w.style.zIndex = 10);
  win.style.zIndex = 100;
}

function toggleStartMenu() {
  const menu = document.getElementById("start-menu");
  menu.classList.toggle("open");
}

// Simple Window Dragging Support
let activeWindow = null;
let offsetX = 0;
let offsetY = 0;

function startDrag(e, windowId) {
  if (e.target.classList.contains('window-dot')) return;
  activeWindow = document.getElementById(windowId);
  bringToFront(activeWindow);
  offsetX = e.clientX - activeWindow.offsetLeft;
  offsetY = e.clientY - activeWindow.offsetTop;
  
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
}

function onDrag(e) {
  if (!activeWindow) return;
  activeWindow.style.left = (e.clientX - offsetX) + 'px';
  activeWindow.style.top = (e.clientY - offsetY) + 'px';
}

function stopDrag() {
  activeWindow = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}
