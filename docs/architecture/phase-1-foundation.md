# Phase 1: Rust Foundation

## Goal

Introduce a small, platform-independent Rust workspace without disrupting the
existing GitHub Pages browser prototype.

## Repository layout introduced in this phase

- `Cargo.toml`: Cargo workspace root.
- `crates/kernel-core`: `no_std` shared kernel primitives.
- `docs/architecture/phase-1-foundation.md`: scope and implementation boundaries.
- `.github/workflows/rust-check.yml`: formatting, tests, linting, and Wasm compile checks.

## Kernel-core boundary

The initial crate provides only foundational types:

- Kernel interface version and process/task/service identifiers.
- Capability identifiers and a compact capability-set representation.
- Common kernel error values.
- Task metadata and lifecycle-state definitions.

It deliberately does **not** implement a scheduler, process execution, memory
management, IPC transport, filesystem, drivers, boot sequence, or permission
enforcement. Those require separate designs and platform-specific implementations.

The crate forbids unsafe Rust and does not depend on `std`, JavaScript, browser
APIs, or external crates.

## Two editions, one repository

The intended build targets remain:

1. **Browser Edition** — Rust shared logic compiled to WebAssembly and hosted by
   a browser adapter. Browser capabilities are limited to APIs explicitly
   provided by the browser.
2. **Native Edition** — Rust shared logic integrated with a native platform
   layer, boot path, hardware abstraction layer, and drivers.

The editions share platform-neutral contracts where appropriate. They do not
share a single hardware backend or assume that WebAssembly can access physical
hardware.

## Local checks

Install a stable Rust toolchain and the WebAssembly target, then run:

```sh
rustup target add wasm32-unknown-unknown
cargo fmt --all -- --check
cargo test --workspace
cargo clippy --workspace --all-targets -- -D warnings
cargo check -p phantomx-kernel-core --target wasm32-unknown-unknown
```

## Explicitly deferred

- Choosing and integrating the native bootloader.
- Native x86_64 entry point, memory map, paging, interrupts, and drivers.
- Browser host bindings and Web Worker integration.
- Scheduler, IPC, VFS implementation, and service lifecycle.
- UI migration and the three user-facing modes.

These remain later milestones and must not be described as implemented by this
foundation commit.
