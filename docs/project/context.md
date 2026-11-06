# PhantomX OS Project Context

## Identity
PhantomX OS is a lightweight browser-first Web OS, cyberdeck HUD and fictional hacking simulator maintained by VRuntime Labs.

## Modes
- Browser Mode: current static browser desktop, early implementation.
- Hacking Mode: controlled fictional simulation, planned/evolving.
- Story Mode: PhantomX Chronicles, single-player campaign plus multiplayer direction.

## Architecture
- Browser Edition: vanilla JavaScript, HTML and CSS; keep lightweight and independent.
- Native Edition: separate long-term Rust no_std kernel foundation; Assembly reserved for future boot/hardware work.
- Current Rust workspace is not a bootable operating system.
- Do not claim WASM, persistent storage, real scheduling, or hardware support unless verified.

## Story and multiplayer
Story content may appear through terminal interactions, files, messages, mission briefings, events and unlockables. Multiplayer direction includes real-time and asynchronous play. Networking, identity, persistence, moderation, hosting and costs require separate design and approval.

## Approved concepts, not yet implementation claims
CLI piping/redirection; Canvas Threat Matrix; JSON story packs and narrative state machine; WebRTC mobile companion with signaling design; Mission Control; Cyberdeck Profiles; Simulation Engine.

## Safety
Hacking Mode is a controlled fictional simulation. Do not build features that facilitate unauthorized access to real systems.

## Working rules
Audit before implementation. Obtain explicit approval before code changes. Preserve completed work and visual identity. Prefer free/browser-native solutions; no paid services or mandatory dependencies without approval. Distinguish shipped features from roadmap proposals.
