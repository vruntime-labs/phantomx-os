document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("command-input");
  const body = document.getElementById("terminal-body");
  const clock = document.getElementById("taskbar-clock");

  // Real-time Clock function
  function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString();
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Command Responses
  const commands = {
    help: "Available commands: <br> • <b style='color:#22c55e'>help</b> - Show options<br> • <b style='color:#22c55e'>about</b> - About system<br> • <b style='color:#22c55e'>clear</b> - Clear screen",
    about: "PhantomX OS v2.1.0 — Web Desktop Kernel."
  };

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
});

// Window controls
function closeTerminal() {
  document.getElementById("terminal-window").style.display = "none";
}

function openTerminal() {
  document.getElementById("terminal-window").style.display = "flex";
}
