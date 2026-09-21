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
    about: "PhantomX OS v2.1.2 — Modern Web Desktop Kernel."
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

  // Elevate window depth on click
  document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win));
  });
});

// Window Management Engine
let highestZ = 10;

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

function minimizeWindow(windowId) {
  const win = document.getElementById(windowId);
  if (win) {
    win.style.display = "none";
  }
}

function maximizeWindow(windowId) {
  const win = document.getElementById(windowId);
  if (win) {
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
}

function bringToFront(win) {
  highestZ += 1;
  win.style.zIndex = highestZ;
}

function toggleStartMenu() {
  const menu = document.getElementById("start-menu");
  menu.classList.toggle("open");
}

// Window Dragging Support
let activeWindow = null;
let offsetX = 0;
let offsetY = 0;

function startDrag(e, windowId) {
  if (e.target.classList.contains('window-dot')) return;
  activeWindow = document.getElementById(windowId);
  if (activeWindow.classList.contains("maximized")) return;

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
