* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  user-select: none;
}

body {
  background: linear-gradient(135deg, #1e3a8a, #0f172a, #111827);
  height: 100vh;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #ffffff;
}

.desktop {
  height: calc(100vh - 40px);
  position: relative;
  padding: 20px;
}

/* Desktop Icons */
.desktop-icons {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 80px;
}

.icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  text-align: center;
  font-size: 13px;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
}

.icon-img {
  width: 48px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin-bottom: 6px;
  transition: background 0.2s;
}

.icon:hover .icon-img {
  background-color: rgba(255, 255, 255, 0.25);
}

/* Terminal Window */
.window {
  width: 550px;
  height: 380px;
  background-color: #0b0f19;
  border: 1px solid #1e293b;
  border-radius: 8px;
  position: absolute;
  top: 40px;
  left: 140px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.window-header {
  background-color: #1e293b;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.window-title {
  font-size: 13px;
  color: #cbd5e1;
}

.close-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 16px;
  cursor: pointer;
}

.window-body {
  padding: 15px;
  flex: 1;
  overflow-y: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}

.welcome-text {
  color: #22c55e;
}

.welcome-sub {
  color: #ffffff;
}

.highlight {
  color: #22c55e;
  font-weight: bold;
}

.input-line {
  display: flex;
  padding: 10px 15px;
  background-color: #0b0f19;
  font-family: 'Courier New', Courier, monospace;
}

.prompt {
  color: #22c55e;
  margin-right: 8px;
  font-weight: bold;
}

#command-input {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-family: inherit;
  font-size: 14px;
  flex: 1;
}

/* Taskbar */
.taskbar {
  height: 40px;
  background-color: #090d16;
  border-top: 1px solid #1e293b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.start-btn {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 13px;
}

.clock {
  font-size: 12px;
  color: #cbd5e1;
  font-family: monospace;
}
