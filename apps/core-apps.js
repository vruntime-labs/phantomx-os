/**
 * PhantomX Tier 1 core applications.
 * NetBrowser is a local fictional intranet; it never fetches arbitrary URLs.
 */
(function (global) {
  "use strict";

  const kernel = global.PhantomKernel;
  const registry = global.PhantomAppRegistry;
  const byId = (id) => document.getElementById(id);

  // CyberPad: editor for files in the shared simulated VFS.
  const padFs = global.PhantomVFS.forApp("phantom.cyberpad");
  const padPath = byId("cyberpad-path");
  const padEditor = byId("cyberpad-editor");
  const padStatus = byId("cyberpad-status");
  const padLoad = byId("cyberpad-load");
  const padSave = byId("cyberpad-save");
  const defaultNote = "/home/mission-notes.md";
  if (!padFs.exists(defaultNote)) {
    padFs.writeFile(defaultNote, "# Mission notes\n\nUse this space for fictional mission observations.\n");
  }
  function loadPadFile() {
    const path = padFs.normalizePath(padPath.value || defaultNote, "/home");
    try {
      const content = padFs.readFile(path);
      padPath.value = path;
      padEditor.value = content;
      padStatus.textContent = "LOADED " + path;
    } catch (error) {
      padStatus.textContent = error.message.toUpperCase();
    }
  }
  padLoad?.addEventListener("click", loadPadFile);
  padSave?.addEventListener("click", () => {
    const path = padFs.normalizePath(padPath.value || defaultNote, "/home");
    try {
      padFs.writeFile(path, padEditor.value);
      padPath.value = path;
      padStatus.textContent = "SAVED TO VIRTUAL FILESYSTEM";
    } catch (error) {
      padStatus.textContent = error.message.toUpperCase();
    }
  });
  loadPadFile();

  // NetBrowser: deliberately local route table with no network navigation.
  const sites = {
    "intranet.phantom": {
      title: "Phantom Research Network",
      subtitle: "INTERNAL KNOWLEDGE PORTAL · SIMULATED",
      sections: [
        ["Welcome", "This fictional intranet is part of the PhantomX training environment."],
        ["Network bulletin", "Maintenance window scheduled for 23:00 local simulation time."],
        ["Available systems", "Research Wiki · Operations Board · Archive Terminal"]
      ],
      links: [{label:"Research Wiki",route:"wiki.phantom/"},{label:"Operations Board",route:"ops.phantom/"}]
    },
    "wiki.phantom": {
      title: "Research Wiki",
      subtitle: "DOCUMENTATION NODE · SIMULATED",
      sections: [
        ["Project Aster", "A fictional research program used to demonstrate evidence collection and mission reasoning."],
        ["Topology notes", "Gateway: 10.24.0.1 · Lab node: 10.24.0.18 · Archive: 10.24.0.42. These addresses exist only in this story."],
        ["Analyst reminder", "Treat all hostnames, addresses and records in this browser as fictional challenge data."]
      ],
      links: [{label:"Operations Board",route:"ops.phantom/"},{label:"Intranet home",route:"intranet.phantom/"}]
    },
    "ops.phantom": {
      title: "Operations Board",
      subtitle: "MISSION OPERATIONS · SIMULATED",
      sections: [
        ["Current notice", "A maintenance record was modified shortly before the scheduled outage."],
        ["Objective", "Compare the maintenance notice with the archived change log. Do not interact with real systems."],
        ["Contact", "Handler channel: ShadowComms (planned)."]
      ],
      links: [{label:"Research Wiki",route:"wiki.phantom/"},{label:"Intranet home",route:"intranet.phantom/"}]
    }
  };
  const address = byId("netbrowser-address");
  const page = byId("netbrowser-page");
  const browserStatus = byId("netbrowser-status");
  const routeButtons = document.querySelectorAll("[data-netbrowser-route]");
  function normalizeRoute(value) {
    let route = String(value || "intranet.phantom/").trim().toLowerCase();
    route = route.replace(/^https?:\/\//, "").split(/[?#]/)[0];
    route = route.replace(/\/+$/, "");
    return route || "intranet.phantom";
  }
  function navigate(value) {
    const route = normalizeRoute(value);
    const site = sites[route];
    if (!site) {
      browserStatus.textContent = "LOCAL ROUTE NOT FOUND · EXTERNAL NETWORK ACCESS DISABLED";
      page.replaceChildren();
      const notice = document.createElement("div");
      notice.className = "netbrowser-notice";
      notice.textContent = "This address is not part of the fictional intranet. NetBrowser does not connect to public websites or arbitrary URLs.";
      page.appendChild(notice);
      return;
    }
    address.value = route + "/";
    browserStatus.textContent = "LOCAL SIMULATION · " + route.toUpperCase();
    page.replaceChildren();
    const heading = document.createElement("div");
    heading.className = "netbrowser-page-heading";
    const title = document.createElement("h2");
    title.textContent = site.title;
    const subtitle = document.createElement("p");
    subtitle.textContent = site.subtitle;
    heading.append(title, subtitle);
    page.appendChild(heading);
    site.sections.forEach(([label, copy]) => {
      const section = document.createElement("section");
      section.className = "netbrowser-card";
      const h3 = document.createElement("h3");
      h3.textContent = label;
      const p = document.createElement("p");
      p.textContent = copy;
      section.append(h3, p);
      page.appendChild(section);
    });
    const nav = document.createElement("nav");
    nav.className = "netbrowser-local-links";
    nav.setAttribute("aria-label", "Fictional intranet links");
    site.links.forEach((link) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = link.label;
      button.dataset.netbrowserRoute = link.route;
      nav.appendChild(button);
    });
    page.appendChild(nav);
  }
  byId("netbrowser-go")?.addEventListener("click", () => navigate(address.value));
  address?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") navigate(address.value);
  });
  routeButtons.forEach((button) => button.addEventListener("click", () => navigate(button.dataset.netbrowserRoute)));
  page?.addEventListener("click", (event) => {
    const link = event.target.closest("[data-netbrowser-route]");
    if (link) navigate(link.dataset.netbrowserRoute);
  });
  navigate("intranet.phantom/");

  // DeckSettings: capability-gated local preferences, stored only in this browser.
  const settingsApp = "phantom.deck-settings";
  const settingsKey = "phantomx.deck-settings.v1";
  function requireSetting(capability) {
    if (!registry.hasCapability(settingsApp, capability)) throw new Error("Permission denied: " + capability);
  }
  function readSettings() {
    requireSetting("settings.read");
    try {
      const value = JSON.parse(global.localStorage.getItem(settingsKey) || "{}");
      return {
        theme: ["mint", "amber", "ice"].includes(value.theme) ? value.theme : "mint",
        wallpaper: ["grid", "quiet", "scanlines"].includes(value.wallpaper) ? value.wallpaper : "grid",
        sounds: value.sounds !== false
      };
    } catch {
      return {theme:"mint", wallpaper:"grid", sounds:true};
    }
  }
  function saveSettings(next) {
    requireSetting("settings.write");
    global.localStorage.setItem(settingsKey, JSON.stringify(next));
    applySettings(next);
  }
  function applySettings(value) {
    document.documentElement.dataset.phantomTheme = value.theme;
    document.body.dataset.phantomWallpaper = value.wallpaper;
  }
  const themeSelect = byId("deck-theme");
  const wallpaperSelect = byId("deck-wallpaper");
  const soundToggle = byId("deck-sounds");
  const settingsStatus = byId("deck-settings-status");
  let preferences = readSettings();
  applySettings(preferences);
  if (themeSelect) themeSelect.value = preferences.theme;
  if (wallpaperSelect) wallpaperSelect.value = preferences.wallpaper;
  if (soundToggle) soundToggle.checked = preferences.sounds;
  function updatePreference(key, value) {
    preferences = {...preferences, [key]:value};
    try {
      saveSettings(preferences);
      settingsStatus.textContent = "PREFERENCE SAVED IN THIS BROWSER";
    } catch (error) {
      settingsStatus.textContent = error.message.toUpperCase();
    }
  }
  themeSelect?.addEventListener("change", () => updatePreference("theme", themeSelect.value));
  wallpaperSelect?.addEventListener("change", () => updatePreference("wallpaper", wallpaperSelect.value));
  soundToggle?.addEventListener("change", () => updatePreference("sounds", soundToggle.checked));
  byId("deck-reset-settings")?.addEventListener("click", () => {
    requireSetting("saves.manage");
    if (!global.confirm("Reset PhantomX appearance and interface preferences stored in this browser?")) return;
    global.localStorage.removeItem(settingsKey);
    preferences = {theme:"mint", wallpaper:"grid", sounds:true};
    applySettings(preferences);
    if (themeSelect) themeSelect.value = preferences.theme;
    if (wallpaperSelect) wallpaperSelect.value = preferences.wallpaper;
    if (soundToggle) soundToggle.checked = preferences.sounds;
    settingsStatus.textContent = "LOCAL PREFERENCES RESET";
  });

  global.PhantomCoreApps = Object.freeze({
    open(appId) {
      const app = registry.get(appId);
      if (!app || app.status !== "available") return {ok:false, reason:"not-implemented"};
      return registry.launch(appId);
    },
    navigateIntranet: navigate
  });
})(window);
