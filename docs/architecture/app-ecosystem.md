# PhantomX Application Ecosystem

PhantomX is a browser-based cyberdeck launcher and simulation platform, not a native operating system. The existing desktop, terminal, taskbar and window manager remain the foundation. New apps integrate incrementally; no shell rebuild is intended.

## App tiers

### Tier 1 — Core shell
- PhantomTerm: simulated CLI, history, autocomplete and safe app-launch commands.
- VFS Explorer: browse, create folders/files, preview and edit the shared virtual filesystem.
- CyberPad: edit mission notes and virtual files.
- NetBrowser: fictional mission intranet plus direct public website embedding in an iframe, with an open-in-new-tab fallback when a publisher blocks framing. It does not proxy or inspect external page content.
- DeckSettings: theme, wallpaper, sound and save-data preferences.

### Tier 2 — Simulation
- NetRadar: four-node fictional topology and port-state fixture; no host discovery or live scanning.
- PacketSniffer: synthetic HTTP/MQTT request/response fixtures; editing and replay remain local to the simulation.
- HashBreaker: reversible Base64/Caesar exercises and one-candidate SHA-256 comparison. Hashes are not decrypted and there is no brute-force routine.
- HexScope: read-only inspection of virtual log files and a bounded hex preview; no trace wiping or evasion.
- OpenCam Viewer: OpenEye free still-image previews plus an OpenCCTV.org public directory/camera-page viewer. OpenCCTV pages are restricted to the official directory host and are embedded only as publisher pages; the source determines whether a page contains live video, refreshed images or an unavailable feed. No camera discovery, private feeds, IP scanning, credentials, arbitrary RTSP/IP URLs, recording, tracking or access-control bypass.

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

The initial VFS is intentionally in-memory and resets on reload, matching the existing terminal behavior. PhantomTerm, VFS Explorer and CyberPad share the same VFS instance. HexScope has read-only access to the virtual logs. It provides normalized paths, directory listing, file reads/writes, directory/file creation and change subscriptions. Access is app-scoped; the service rejects undeclared or unavailable app capabilities. IndexedDB persistence is a separate follow-up after shared behavior is verified; this migration does not silently change data lifetime.

## Launcher behavior

The Start Menu renders the catalog grouped into Core Shell, Simulation Tools, and Story & Progression. PhantomTerm, VFS Explorer, CyberPad, NetBrowser and DeckSettings are launchable in the core-app milestone; NetRadar, PacketSniffer, HashBreaker, HexScope and OpenCam Viewer are launchable in the simulation milestone. Future apps remain visible but disabled and labelled PLANNED; they are not represented as completed features. Planned apps remain visible but disabled and labelled PLANNED; they are not represented as completed features. Search filters the app catalog.

## Public camera integration

OpenCam Viewer uses OpenEye's anonymous public featured-catalog endpoint on explicit user action. It filters to free, recent, image previews that carry per-camera embed permission and HTTPS attribution; it does not poll or request geolocation. These cards remain still-image previews, not continuous video. A separate OpenCCTV.org viewer accepts only the provider's public directory and camera-page URLs; the provider page may display a permitted live video, a refreshed image, or an offline state. The app never calls OpenEye's metered WHEP/live-video, frame, analysis or subscription endpoints. Windy's Webcams API is not embedded directly because its API key must remain secret and cannot safely be shipped in a public static site.

## Delivery order

1. App manifests and registry.
2. Shared VFS migration with unchanged terminal command behavior.
3. Extend VFS Explorer; verify terminal-created files appear in Explorer and vice versa.
4. CyberPad, NetBrowser and DeckSettings.
5. One complete fictional mission and the Tier 2 simulation tools.
6. OpenCam Viewer using a small curated set of verified free public previews.
7. Story progression apps; multiplayer remains a separate design and security milestone.

## Compatibility and validation

Keep vanilla JavaScript, current root-level entry points, GitHub Pages paths, desktop styling and terminal controls. Do not mark planned apps as available until their windows and core interactions work. Update the service worker asset list for every new runtime asset. Test desktop/mobile layout, window lifecycle, VFS sharing, offline loading and browser-console errors before release.
