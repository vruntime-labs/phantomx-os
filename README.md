# 👾 PhantomX OS

> A lightweight, open-source browser desktop and cyberdeck simulation, built with vanilla web technologies.

PhantomX OS is an experimental, browser-first operating environment maintained by **VRuntime Labs**. The current public Browser Edition combines a small desktop workspace, a windowed terminal, a simulated command environment and an offline application shell.

**PhantomX is a simulation environment.** Its Hacking Mode concept is intended for fictional systems and controlled learning experiences, not unauthorized access to real devices or networks.

---

## Live project

- **Live demo:** https://vruntime-labs.github.io/phantomx-os/
- **Source repository:** https://github.com/vruntime-labs/phantomx-os
- **Maintainer:** [VRuntime Labs](https://github.com/vruntime-labs)
- **Project context for contributors and AI tools:** [PHANTOMX_CONTEXT.md](PHANTOMX_CONTEXT.md)

## Current Browser Edition

The current repository contains a deliberately small static web application. Verified source-level components include:

- A desktop workspace with a taskbar, Start menu and terminal window.
- A JavaScript window/kernel module for window lifecycle, focus and process tracking.
- A simulated terminal with a limited set of built-in commands, including `help`, `about`, `ls`, `ps` and `clear`.
- An in-memory example virtual directory structure.
- A service worker that caches the application shell for repeat/offline loading.
- A web app manifest and viewport metadata.

These are lightweight browser-side simulations, not a general-purpose operating system or a real command shell. The current terminal does not provide arbitrary host command execution, and the example virtual filesystem is not a persistent disk.

## Project modes

PhantomX has three intended user-facing modes. Their inclusion here describes the product direction, not a claim that every mode is implemented.

| Mode | Purpose | Status |
|---|---|---|
| Browser Mode | Browser desktop and web-app environment | **Early implementation** |
| Hacking Mode | Fictional cyberdeck and controlled security simulations | **Planned / evolving** |
| Story Mode | Mission-driven narrative experience | **Planned** |

## Roadmap

The proposed development sequence is:

1. **Phase 0 — Repository and architecture audit:** verify current behavior, gaps, risks and tests.
2. **Phase 1 — Browser foundation:** strengthen kernel lifecycle, process management, window management, filesystem and persistence.
3. **Phase 2 — Hacking Mode CLI:** introduce a tokenizer/parser, command pipelines, output redirection and safe simulated command handlers.
4. **Phase 3 — Simulation and Threat Matrix:** central simulation state, event dispatch, procedural Canvas visuals and trace/network displays.
5. **Phase 4 — PhantomX Chronicles:** versioned JSON story packs, narrative state machine, branching missions and save recovery.
6. **Phase 5 — Mission Control and Cyberdeck Profiles:** mission dashboard, intelligence archive and saved desktop configurations.
7. **Phase 6 — Mobile Companion:** secure QR pairing, WebRTC data channel, remote CLI, virtual trackpad and telemetry HUD.
8. **Phase 7 — Multiplayer:** separately designed real-time and asynchronous experiences, with identity, persistence and moderation.
9. **Phase 8 — Native Edition:** long-term Rust kernel and architecture-specific low-level development.

All roadmap items remain proposed until implemented and verified. The repository contains an initial Rust workspace and `kernel-core` crate, but this alone does **not** mean that a bootable Native Edition exists.

See [PHANTOMX_CONTEXT.md](PHANTOMX_CONTEXT.md) for approved architecture decisions, working rules and the living checklist.

## Technology

### Browser Edition

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Browser Service Worker and Web App Manifest APIs
- HTML Canvas 2D is planned for future visual simulation modules.

The Browser Edition is designed without a mandatory frontend framework or package dependency.

### Native Edition (long-term direction)

- Rust, with a `no_std` kernel foundation under evaluation
- Assembly for boot- and hardware-level work where required
- Cargo workspace

Native development is separate from the deployed browser application and must not destabilize it.

## Repository overview

```text
phantomx-os/
├── index.html                 # Browser application entry point
├── style.css                  # Desktop and terminal styling
├── kernel.js                  # Browser-side window/kernel behavior
├── script.js                  # Terminal and simulated command behavior
├── sw.js                      # Application-shell service worker
├── manifest.json              # Web app manifest
├── crates/
│   └── kernel-core/           # Early Rust kernel-core crate
├── docs/
│   └── architecture/          # Architecture notes
├── PHANTOMX_CONTEXT.md        # Contributor and AI project context
├── CONTRIBUTORS.json          # Machine-readable contributor directory
├── PRIVACY.md                 # Privacy policy
└── LICENSE                    # MIT License
```

## Privacy

The Browser Edition is a static client-side application. The current source inspected for this documentation does not show an application account system, analytics integration or project-operated application backend. The service worker caches listed application resources in the browser.

The hosting provider and the external Unsplash image CDN may process technical request information when their resources are requested. Browser storage and cached resources are controlled through your browser settings. See [PRIVACY.md](PRIVACY.md) for details and limitations.

## Contributing

Contributions, bug reports and thoughtful feature proposals are welcome.

1. Read [PHANTOMX_CONTEXT.md](PHANTOMX_CONTEXT.md) before proposing architectural changes.
2. Check existing issues and avoid duplicating work.
3. Describe the problem, proposed change, affected files and testing approach.
4. Keep changes focused and preserve existing working behavior.
5. Do not add paid services, mandatory external dependencies or broad permissions without maintainer approval.
6. Keep Hacking Mode within authorized, fictional simulation boundaries.

The project contributor directory is maintained in [CONTRIBUTORS.json](CONTRIBUTORS.json). It is structured so the Browser Edition may display contributor information in a future release. A listed contributor entry is a project-maintained attribution record, not an automated GitHub contribution count.

## License

PhantomX OS is distributed under the [MIT License](LICENSE), copyright © 2026 VRuntime Labs.

---

**Build upon PhantomX OS, not over it.** Preserve its lightweight identity, verify before claiming, and keep planned work distinct from shipped functionality.
