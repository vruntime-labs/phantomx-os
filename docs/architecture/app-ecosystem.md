# PhantomX Application Ecosystem

PhantomX is a browser-based cyberdeck launcher and simulation platform, not a native operating system. The existing desktop, terminal, taskbar and window manager remain the foundation. New apps integrate incrementally; no shell rebuild is intended.

## App tiers

### Tier 1 — Core shell
- PhantomTerm: simulated CLI, history, autocomplete and safe app-launch commands.
- VFS Explorer: browse, create folders/files, preview and edit the shared virtual filesystem.
- CyberPad: edit mission notes and virtual files.
- NetBrowser: fictional, locally hosted mission intranet.
- DeckSettings: theme, wallpaper, sound and save-data preferences.

### Tier 2 — Simulation
- NetRadar: fictional network topology and simulated ports only.
- PacketSniffer: synthetic traffic and fictional request/response inspection only.
- HashBreaker: offline encoding and candidate-hash verification challenges. Hashes are not decrypted.
- HexScope: fictional logs and forensic challenge files; no trace wiping or evasion.
- OpenCam Viewer: operator-published public camera feeds only. No exposed-camera discovery, private feeds, IP scanning, credentials, arbitrary RTSP/IP URLs, recording, tracking or access-control bypass.

### Tier 3 — Story
- MissionControl: contracts, objectives, environments and progression.
- ShadowComms: fictional handlers, messages and branching dialogue.
- SysGuard: simulated trace, CPU/RAM and session status.

## Runtime foundation

- apps/app-manifests.js: application metadata, stable IDs, tier/category, window defaults, status and declared capability requirements.
- app-registry.js: catalog lookup, launch routing and capability checks. Only apps with an available status and a registered window can launch.
- vfs.js: one shared browser-only virtual filesystem used through app-scoped capability interfaces.
- kernel.js: existing window lifecycle and pointer-based window management.
- script.js: terminal interface and commands, consuming the shared VFS and registry.

The manifest is not itself authorization. Every VFS operation checks the calling app's status and declared capability at the service boundary. Apps cannot access host files, host processes, physical networks or devices through these simulated services.

## Shared VFS contract

The initial VFS is intentionally in-memory and resets on reload, matching the existing terminal behavior. PhantomTerm and VFS Explorer already share the same VFS instance. It provides normalized paths, directory listing, file reads/writes, directory/file creation and change subscriptions. Access is app-scoped; the service rejects undeclared or unavailable app capabilities. IndexedDB persistence is a separate follow-up after shared behavior is verified; this migration does not silently change data lifetime.

## Launcher behavior

The Start Menu renders the catalog grouped into Core Shell, Simulation Tools, and Story & Progression. PhantomTerm and VFS Explorer are launchable in this milestone. Future apps remain visible but disabled and labelled PLANNED; they are not represented as completed features. Planned apps remain visible but disabled and labelled PLANNED; they are not represented as completed features. Search filters the app catalog.

## Public camera integration

OpenCam Viewer is a public-webcam viewer, not a surveillance scanner. Prefer official operator feeds and directories that explicitly permit public display. OpenEye's public catalog may be evaluated for metadata and display instructions. Windy's Webcams API is an optional keyed source; free access is limited and may return expiring still-image URLs. Do not promise continuous video where only refreshed images are available. Display operator attribution, feed type and freshness when supplied. Do not request geolocation by default.

## Delivery order

1. App manifests and registry.
2. Shared VFS migration with unchanged terminal command behavior.
3. Extend VFS Explorer; verify terminal-created files appear in Explorer and vice versa.
4. CyberPad, NetBrowser and DeckSettings.
5. One complete fictional mission, then the Tier 2 simulation tools.
6. OpenCam Viewer using a small curated set of verified public feeds.
7. Story progression apps; multiplayer remains a separate design and security milestone.

## Compatibility and validation

Keep vanilla JavaScript, current root-level entry points, GitHub Pages paths, desktop styling and terminal controls. Do not mark planned apps as available until their windows and core interactions work. Update the service worker asset list for every new runtime asset. Test desktop/mobile layout, window lifecycle, VFS sharing, offline loading and browser-console errors before release.
