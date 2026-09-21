# ⚡ PhantomX OS v2.2.0

> A zero-dependency, open-source web desktop environment, cyberdeck HUD, and browser-based hacking simulator.

PhantomX OS is a lightweight Web OS platform built 100% in pure Vanilla JavaScript, HTML5, and CSS3. It simulates a high-tech terminal exploit suite—complete with real-time CLI commands, telemetry monitoring, CCTV feed bypasses, trace monitors, and Web Audio SFX—all managed inside an authentic desktop window environment with zero framework bloat.

---

## 🌐 Live Demo & Deployment

* **Live Web App:** [https://vruntime-labs.github.io/phantomx-os/](https://vruntime-labs.github.io/phantomx-os/)
* **Organization:** [vruntime-labs](https://github.com/vruntime-labs)

---

## 🚀 What's New in v2.2.0

* **Modular Kernel Architecture:** Extracted core OS operations into `kernel.js` to handle low-level window lifecycles (open, close, minimize, maximize), dynamic z-index stacking, and active process tracking.
* **Virtual File System:** Added an in-memory JSON-backed filesystem (`/home`, `/sys`, `/logs`) supporting `ls` and `ps` CLI terminal commands.
* **Service Worker Update:** Synchronized offline PWA caching layer with the new `kernel.js` release bundle.

---

## 🔥 Key Features

* 💻 **Web Desktop Environment:** Functional floating taskbar dock, desktop app icons, and real-time clock indicator.
* 🧠 **Kernel Engine (`kernel.js`):** Client-side state handling for window lifecycles, active process lists, and focus management.
* 👾 **Cyberdeck Terminal Suite:** Interactive CLI stream supporting real-time commands, process inspection (`ps`), and filesystem traversal (`ls`).
* 🎥 **CCTV & Trace Monitors:** Simulated visual canvas monitoring and real-time security trace level displays.
* 🎵 **Web Audio API SFX:** Native browser audio synthesis for tactical UI clicks and alarm sound effects.
* 🎨 **Theme Engine:** Instant color scheme switching (Matrix Green, Retro Amber, Cyberpunk Neon).

---

## 🛠 Tech Stack & Architecture

* **Frontend:** Pure HTML5, CSS3 (Flexbox/Grid, Glassmorphism), Vanilla JavaScript (ES6+).
* **Graphics & Audio:** HTML5 2D Canvas API & Native Web Audio API.
* **Dependencies:** STRICTLY 0 (No React, Vue, Tailwind, or external NPM libraries).
* **Hosting:** 100% Free static deployment via GitHub Pages.

---

## 📂 Repository Hierarchy

```text
phantomx-os/
├── index.html               # Main root HTML5 entry point
├── style.css                # Core window manager & cyberdeck HUD styles
├── kernel.js                # OS Kernel (Window lifecycle, z-index, process tracking)
├── script.js                # App logic & CLI command parser
├── manifest.json            # PWA web app installer specification
├── sw.js                    # Service worker offline cache engine
├── sitemap.xml              # Search engine index sitemap
├── robots.txt               # Crawler permission file
├── google*.html             # Google Search Console verification
└── BingSiteAuth.xml         # Bing Webmaster Tools verification
