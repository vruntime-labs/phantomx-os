# PhantomX OS — AI Project Context

> Read this before proposing or making any project change. This file is the shared handoff for AI assistants and contributors.

## Project identity

**PhantomX OS** is a zero-dependency, browser-first Web OS, cyberdeck HUD and cybersecurity simulation environment. The public project is maintained in [vruntime-labs/phantomx-os](https://github.com/vruntime-labs/phantomx-os) and deployed through [GitHub Pages](https://vruntime-labs.github.io/phantomx-os/).

The project has three intended user-facing modes:

- **Browser Mode:** the desktop/Web OS experience.
- **Hacking Mode:** a cyberdeck terminal, simulated security workflows, network/intelligence displays and related tools.
- **Story Mode:** a mission-driven narrative experience integrated into the PhantomX environment.

Do not present planned modes or features as implemented. Verify the current code before making status claims.

## Architecture decisions

- **Browser Edition:** continue the existing lightweight, client-side implementation. The current README identifies vanilla JavaScript (ES6+), HTML5 and CSS3, with no frontend framework or external NPM dependencies.
- **Browser kernel:** the existing modular JavaScript kernel (kernel.js) is the current browser-side kernel. Preserve and evolve it deliberately; do not replace it casually.
- **Native Edition:** a separate, longer-term native OS implementation is planned in the same repository. The repository already contains a Rust workspace (Cargo.toml) with a crates/kernel-core member. Audit its actual state before describing it as bootable or complete.
- **Low-level native direction:** Rust with no_std is the intended foundation; Assembly is reserved for future hardware/boot-level work when justified.
- **WASM:** treat WebAssembly integration as a planned/subject-to-architecture decision unless the current repository proves otherwise. Do not claim an existing runtime without verifying it.
- Keep Browser and Native editions distinct but aligned through documented shared concepts, interfaces and contracts where practical. Do not let native work break the browser release.
- Prefer free, open-source, browser-compatible solutions. Any paid service, external dependency or non-free requirement needs explicit approval.

## Story Mode — approved direction

Working concept: **PhantomX Chronicles**.

Two complementary experiences are approved:
1. **Single-player campaign:** a coherent narrative with missions, progression, characters and persistent player choices.
2. **Multiplayer:** support both real-time and asynchronous multiplayer experiences.

Story delivery can use in-world terminal output, files, messages, mission briefings, events and unlockable content. This is a design direction, not proof that these systems are implemented. Multiplayer networking, persistence, identity, moderation and hosting require a separate technical design and approval before implementation.

## Visual and interaction direction

- Hybrid cyberdeck/cyberpunk identity with a usable, credible OS interface.
- Desktop-first windowed environment with deliberate window, focus and navigation behavior.
- Responsive mobile experience with touch-friendly controls and appropriate full-screen app behavior.
- Lightweight and performant on low-end devices.
- Avoid generic AI-template styling, unnecessary visual effects, heavy frameworks and gratuitous dependencies.
- Preserve recognizable PhantomX visual identity and existing working interactions.

## Living project checklist

Update this checklist only after inspecting the repository and verifying the relevant implementation. Use [x] only for verified completed work, [ ] for not completed, and [?] when status is unknown or needs an audit.

### Core / Browser Edition
- [?] Current repository, release and architecture audit
- [?] Browser kernel lifecycle and process management
- [?] Desktop, window manager, focus and taskbar/dock
- [?] Terminal and command system
- [?] Virtual filesystem and persistence
- [?] Hacking Mode tools and simulation boundaries
- [?] Telemetry, monitoring and Canvas visualizations
- [?] PWA installation and offline behavior
- [?] Responsive/mobile and touch behavior
- [?] Accessibility, browser compatibility and performance

### Story Mode
- [ ] Narrative bible, world rules and mission structure
- [ ] Single-player campaign and progression
- [ ] In-world story delivery and persistent choices
- [ ] Multiplayer architecture and threat model
- [ ] Real-time multiplayer
- [ ] Asynchronous multiplayer
- [ ] Player identity, persistence, moderation and abuse controls

### Native Edition
- [?] Rust workspace and crates/kernel-core audit
- [ ] Native target and boot strategy
- [ ] Memory, CPU, device and filesystem architecture
- [ ] Bootloader and hardware abstraction decisions
- [ ] Assembly integration where genuinely required
- [ ] Browser/Native shared contracts and compatibility plan
- [ ] Native build, test and emulator/VM workflow

### Quality and release
- [?] Security and permission boundaries
- [?] Automated tests and regression coverage
- [?] Documentation and contributor workflow
- [?] Release readiness and deployment verification

## Mandatory development workflow

For every task:

1. Read this file and inspect the relevant source, documentation, history and current branch.
2. Establish what is implemented, partially implemented, planned, broken or unknown. Cite file paths and evidence.
3. Check the existing project checklist and preserve completed work.
4. Present a focused plan: files affected, architecture, dependencies, risks, tests and rollback considerations.
5. **Stop for explicit user approval before editing files, creating branches/PRs, committing, merging, deploying or changing project settings.**
6. After approval, make the smallest coherent change. Avoid unrelated refactors and overwrites.
7. Run appropriate checks, report exact results, and update this document's checklist only when verified.
8. Summarize changed files, commit/PR links and remaining work.

## Non-negotiable rules

- Never modify code or project files before explicit approval of the proposed plan.
- Never overwrite or undo completed work without explaining why and receiving approval.
- Never infer implementation from a roadmap, README claim, empty scaffold or previous AI response; inspect the current repository.
- Clearly label **implemented**, **in progress**, **planned**, **experimental** and **unknown**.
- Do not introduce paid services, hidden telemetry, external dependencies or broad permissions without approval.
- Hacking Mode must remain an authorized, controlled simulation. Do not add functionality that attacks real systems or accesses data without permission.
- Keep documentation, architecture decisions and checklists synchronized with verified code.
- If instructions conflict, preserve the user's latest explicit decision and ask before making an irreversible or scope-changing choice.

**Golden rule: Build upon PhantomX OS, not over it. Protect its identity, existing functionality and long-term Browser + Native vision.**
