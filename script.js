document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("command-input");
  const body = document.getElementById("terminal-body");
  const clock = document.getElementById("taskbar-clock");

  // Real-time Clock
  function updateClock() {
    const now = new Date();
    if (clock) {
      clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Simulated Virtual File System Structure
  const fileSystem = {
    "/": ["home", "sys", "logs"],
    "/home": ["user_notes.txt", "project_info.md"],
    "/sys": ["kernel.conf", "network.cfg"],
    "/logs": ["auth.log", "trace.log"]
  };

  let currentPath = "/";

  // CLI Commands Engine
  const commands = {
    help: "Available commands: <br> • <b style='color:#34d399'>help</b> - List commands<br> • <b style='color:#34d399'>about</b> - OS info<br> • <b style='color:#34d399'>ls</b> - List directory contents<br> • <b style='color:#34d399'>ps</b> - List active processes<br> • <b style='color:#34d399'>clear</b> - Clear terminal screen",
    about: "PhantomX OS v2.2.0 — Modern Cyberdeck Web OS Kernel."
  };

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const rawInput = input.value.trim();
        const command = rawInput.toLowerCase();

        const userLine = document.createElement("p");
        userLine.innerHTML = `<span class="prompt">user@phantomx:${currentPath}$</span> ${rawInput}`;
        body.appendChild(userLine);

        if (command === "clear") {
          body.innerHTML = "";
        } else if (command === "ls") {
          const files = fileSystem[currentPath] || [];
          const output = document.createElement("p");
          output.innerHTML = files.map(f => f.includes('.') ? f : `<b style='color:#3b82f6'>${f}/</b>`).join("&nbsp;&nbsp;&nbsp;&nbsp;");
          body.appendChild(output);
        } else if (command === "ps") {
          const active = Array.from(window.PhantomKernel.activeProcesses);
          const output = document.createElement("p");
          output.innerHTML = active.length > 0 
            ? `Active Processes (${active.length}):<br>` + active.map(pid => ` • <span style="color:#34d399">${pid}</span> (running)`).join("<br>")
            : "No active background processes.";
          body.appendChild(output);
        } else if (commands[command]) {
          const response = document.createElement("p");
          response.innerHTML = commands[command];
          body.appendChild(response);
        } else if (command !== "") {
          const error = document.createElement("p");
          error.style.color = "#ef4444";
          error.textContent = `Command not recognized: '${rawInput}'`;
          body.appendChild(error);
        }

        input.value = "";
        body.scrollTop = body.scrollHeight;
      }
    });
  }

  // Window depth elevation listener
  document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', () => window.PhantomKernel.bringToFront(win));
  });
});
