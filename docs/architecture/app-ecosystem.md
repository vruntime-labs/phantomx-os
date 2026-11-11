# PhantomX Application Ecosystem

## Product boundary

PhantomX is a browser-based cyberdeck launcher and simulation platform, not a native operating system. Its applications run inside the browser and must not claim access to host processes, disks, networks, cameras or devices unless a user explicitly grants a supported browser permission for a clearly explained feature.

The existing desktop, taskbar, window manager and terminal are the foundation. New applications must integrate with them rather than replacing the launcher or rebuilding the interface.

## Application tiers

### Tier 1 — Core shell and utilities

| App | Responsibility | Initial capability |
|---|---|---|
| PhantomTerm | Simulated command interface | History, autocomplete, safe pipes, app launch commands |
| VFS Explorer | Shared virtual filesystem | Browse, search, preview, hidden files and properties |
| CyberPad | Notes and virtual-file editor | Tabs, syntax highlighting and mission notes |
| NetBrowser | Fictional mission intranet | Local fictional pages, portals, wiki and forum |
| DeckSettings | Launcher preferences | Theme, wallpaper, sound and save-data management |

### Tier 2 — Simulation tools

| App | Responsibility | Boundary |
|---|---|---|
| NetRadar | Network topology and port map | Synthetic environments only |
| PacketSniffer | Packet and request inspection | Synthetic traffic only; no real interception |
| HashBreaker | Encoding and hash challenges | Offline educational puzzles; hashes are verified against candidates, not decrypted |
| HexScope | Log and file forensics | Fictional evidence; no trace wiping or evasion |
| OpenCam Viewer | Public camera and webcam viewer | Intentionally published public feeds only; no discovery/scanning of exposed private cameras |

### Tier 3 — Story and progression

| App | Responsibility |
|---|---|
| MissionControl | Contracts, objectives, environments and progression |
| ShadowComms | Fictional handlers, messages and branching dialogue |
| SysGuard | Simulated trace, CPU/RAM and session status |

## Shared application contract

Each app manifest declares a stable app ID, display name, tier, category, icon identifier, default and minimum window dimensions, window capabilities, required permissions and implementation status.

A manifest is metadata, not an authorization mechanism. The app runtime must check each requested capability at the service boundary. Unknown or ungranted permissions must fail closed. Apps must not receive unrestricted access to shared services.

## Shared services

1. **AppRegistry** — validates manifests and exposes launchable apps.
2. **Window API** — opens, focuses, minimizes, maximizes, restores and closes app windows through the existing window manager.
3. **VirtualFileSystem** — shared virtual files and folders. Terminal, Explorer and CyberPad must see the same data.
4. **EventBus** — typed, scoped events for app-to-app updates; no arbitrary code execution.
5. **SettingsService** — user preferences and appearance.
6. **SessionManager** — current browser/simulation mode and session metadata.
7. **SaveManager** — versioned mission progress and local save recovery.

Use IndexedDB for virtual files and mission saves after the VFS migration is designed and tested. Use localStorage only for small preferences. Do not silently migrate or erase existing user data.

## OpenCam Viewer — public camera integration

The camera application is a public-webcam viewer, not a surveillance scanner. It may display traffic, weather, scenic, wildlife, harbor and other feeds deliberately published for public viewing by their operators.

Source strategy:
- Prefer curated official operator feeds and camera directories that explicitly allow public display.
- OpenEye's public catalog can be evaluated for discovery metadata and its per-camera view instructions. Render only entries explicitly marked for image display; for source-only entries, open the operator's page instead. Public catalog access does not mean every feed is free to relay or redistribute.
- Windy's Webcams API is an optional source if a free API key is configured. Its free tier provides limited image access and expiring image URLs; refresh metadata when loading a camera and link/attribute Windy as required.
- Do not promise continuous live video. Many free sources provide periodic still frames, and live playback may be restricted, unavailable, or paid.
- Do not scrape camera credentials, bypass hotlink restrictions, proxy around access controls, scan IP ranges, enumerate exposed devices, or accept arbitrary camera IP/RTSP URLs.
- Do not record, archive, identify, track or profile people. Do not request browser geolocation by default. A location filter, if added, must be optional and user initiated.
- Show source/operator attribution, feed type (live video vs refreshed still), capture/update time when supplied, and a clear unavailable state.
- No user-submitted camera URLs in the first release. Any future submissions require an explicit authorization/rights check and moderation path.

## Delivery sequence

1. Add and review the app manifest catalog without changing existing launcher behavior.
2. Integrate AppRegistry and Window API with the existing Kernel/window manager.
3. Move the terminal's in-memory Map into a shared VFS service without changing command behavior.
4. Build VFS Explorer and verify files created in PhantomTerm appear in Explorer and vice versa.
5. Build CyberPad, NetBrowser and DeckSettings.
6. Build one complete fictional mission using MissionControl and the shared VFS.
7. Add NetRadar, PacketSniffer, HashBreaker and HexScope as simulation modules.
8. Add OpenCam Viewer with a small curated set of verified public feeds and graceful fallbacks.
9. Add ShadowComms and SysGuard, then expand single-player story content. Multiplayer remains a separate design and security milestone.

## Compatibility and review rules

- Preserve the current root-level runtime entry points and GitHub Pages paths.
- Keep vanilla JavaScript and browser-native APIs; no mandatory framework or paid service.
- Do not label planned apps as available until their windows, capabilities and core interactions work.
- Keep each milestone focused and reviewable. Do not replace the existing desktop shell or terminal wholesale.
- Update the service worker asset list/cache version when new runtime files are integrated.
- Test desktop and mobile layouts, keyboard access, window lifecycle, VFS sharing, offline behavior and browser console errors before release.