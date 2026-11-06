<div align="center">

<img src="assets/readme/phantomx-header.gif" alt="Animated PhantomX OS cyberdeck terminal banner" width="100%">

**A lightweight, open-source browser desktop and cyberdeck simulation.**

[Live Demo](https://vruntime-labs.github.io/phantomx-os/) · [Documentation](docs/) · [Contributors](https://vruntime-labs.github.io/phantomx-os/contributors/) · [Policies](https://vruntime-labs.github.io/phantomx-os/legal/)

</div>

---

## System overview

PhantomX OS is an experimental, browser-first operating environment maintained by **VRuntime Labs**. The current Browser Edition combines a small desktop workspace, a windowed terminal, a simulated command environment and an offline application shell.

> **Simulation boundary:** Hacking-themed interfaces are intended for fictional systems and controlled learning experiences, not unauthorized access to real devices or networks.

## Current Browser Edition

- Desktop workspace with taskbar, Start menu and terminal window.
- JavaScript window/kernel module for window lifecycle, focus and process tracking.
- Simulated terminal with help, about, ls, ps and clear commands.
- Example in-memory virtual directory structure.
- Service worker and web app manifest for application-shell caching.

These are lightweight browser-side simulations, not a general-purpose operating system. The terminal does not execute arbitrary host commands and the example filesystem is not persistent user storage.

## Project modes

| Mode | Purpose | Status |
|---|---|---|
| Browser Mode | Browser desktop and web-app environment | **Early implementation** |
| Hacking Mode | Fictional cyberdeck and controlled security simulations | **Planned / evolving** |
| Story Mode | Mission-driven narrative experience | **Planned** |

## Architecture

**Browser Edition:** HTML5, CSS3, vanilla JavaScript (ES6+), Service Worker and Web App Manifest APIs. No mandatory frontend framework or package dependency.

**Native Edition:** Separate long-term direction based on Rust and a no_std kernel foundation. Assembly is reserved for boot- and hardware-level work where required. The current Rust workspace is an early foundation, **not a bootable Native Edition**.

## Roadmap

1. **Phase 0 — Repository and architecture audit**
2. **Phase 1 — Browser foundation:** kernel lifecycle, process/window management, filesystem and persistence.
3. **Phase 2 — Hacking Mode CLI:** tokenizer/parser, pipelines, output redirection and safe simulated handlers.
4. **Phase 3 — Simulation and Threat Matrix:** simulation state, event dispatch, procedural Canvas visuals and network displays.
5. **Phase 4 — PhantomX Chronicles:** versioned JSON story packs, branching missions and save recovery.
6. **Phase 5 — Mission Control and Cyberdeck Profiles**
7. **Phase 6 — Mobile Companion:** QR pairing, WebRTC data channel, remote CLI, virtual trackpad and telemetry HUD.
8. **Phase 7 — Multiplayer:** real-time and asynchronous experiences, identity, persistence and moderation.
9. **Phase 8 — Native Edition:** long-term Rust kernel and low-level development.

Roadmap items remain proposed until implemented and verified.

## Repository layout

- .github/ — GitHub workflows
- .well-known/ — Security disclosure metadata
- assets/css/ — Shared public-page styles
- assets/readme/ — README media
- acceptable-use/, contributors/, cookies/, copyright/, disclaimer/, legal/, license/, privacy/, security/, terms/ — Public static pages
- data/ — Public structured project data
- docs/architecture/ — Architecture notes
- docs/legal/ — Markdown policy source
- docs/project/ — Maintainer and AI context
- crates/ — Early Rust kernel foundation
- index.html, kernel.js, script.js, style.css, sw.js, manifest.json — Browser Edition runtime files

Runtime entry files remain at the repository root to preserve existing relative paths, PWA behavior and GitHub Pages deployment.

## Development

The Browser Edition is static and dependency-free. Serve the repository root through a local HTTP server so the service worker and fetch-based contributor directory work as expected.

## Privacy, policies and security

- [Privacy Policy](https://vruntime-labs.github.io/phantomx-os/privacy/)
- [Terms of Service](https://vruntime-labs.github.io/phantomx-os/terms/)
- [Cookie Policy](https://vruntime-labs.github.io/phantomx-os/cookies/)
- [Disclaimer](https://vruntime-labs.github.io/phantomx-os/disclaimer/)
- [Acceptable Use & Community Guidelines](https://vruntime-labs.github.io/phantomx-os/acceptable-use/)
- [Copyright Notice](https://vruntime-labs.github.io/phantomx-os/copyright/)
- [MIT License](https://vruntime-labs.github.io/phantomx-os/license/)
- [Security Policy](https://vruntime-labs.github.io/phantomx-os/security/)
- [security.txt](https://vruntime-labs.github.io/phantomx-os/.well-known/security.txt)

The inspected source does not show an account system, analytics integration, advertising SDK or project-operated application backend. The site does request a third-party Unsplash image and uses browser cache storage. No optional analytics/advertising cookies are currently used, so no cookie-consent banner is displayed.

A separate proprietary EULA is not currently used because the repository is distributed under MIT and the Browser Edition is not a proprietary downloadable desktop client. The Acceptable Use page covers safe simulation and public project participation; feature-specific moderation rules must be expanded before uploads, chat, hosted user content or multiplayer launch.

## Contributing

1. Read the project context in docs/project/context.md and architecture notes before proposing structural changes.
2. Check existing issues and avoid duplicating work.
3. Describe the problem, proposed change, affected files and testing approach.
4. Keep changes focused and preserve existing working behavior.
5. Do not add paid services, mandatory external dependencies or broad permissions without maintainer approval.
6. Keep Hacking Mode within authorized, fictional simulation boundaries.

See the [Contributors page](https://vruntime-labs.github.io/phantomx-os/contributors/) and canonical contributors data in data/contributors.json.

## License

[MIT License](LICENSE) · Copyright © 2026 VRuntime Labs.

<div align="center">

**BUILD WITH INTENT. SIMULATE RESPONSIBLY.**

<sub>PhantomX OS · Maintained by VRuntime Labs</sub>

</div>
