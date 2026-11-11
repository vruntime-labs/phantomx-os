/**
 * PhantomX DeckSettings.
 * Applies visible desktop and dock preferences and persists them locally.
 */
(function (global) {
  "use strict";

  const APP_ID = "phantom.deck-settings";
  const STORAGE_KEY = "phantomx.deck-settings.v1";
  const THEMES = {
    mint: { mint: "#9fe3c4", mintStrong: "#6bd5a6", amber: "#e4b77a" },
    ice: { mint: "#a8d9ee", mintStrong: "#76c7e7", amber: "#e4c78d" },
    amber: { mint: "#e8bd79", mintStrong: "#dfa957", amber: "#e8bd79" }
  };
  const DEFAULTS = Object.freeze({
    theme: "mint",
    wallpaper: "grid",
    dockMagnification: true,
    compactMode: false,
    reduceMotion: false,
    showDesktopWidget: true,
    sounds: true
  });
  const byId = (id) => document.getElementById(id);
  const controls = {
    theme: byId("deck-theme"),
    wallpaper: byId("deck-wallpaper"),
    dockMagnification: byId("deck-dock-magnification"),
    compactMode: byId("deck-compact-mode"),
    reduceMotion: byId("deck-reduce-motion"),
    showDesktopWidget: byId("deck-show-widget"),
    reset: byId("deck-reset-settings"),
    status: byId("deck-settings-status")
  };

  function can(capability) {
    return Boolean(global.PhantomAppRegistry?.hasCapability(APP_ID, capability));
  }
  function normalize(value = {}) {
    return {
      theme: Object.hasOwn(THEMES, value.theme) ? value.theme : DEFAULTS.theme,
      wallpaper: ["grid", "quiet", "scanlines"].includes(value.wallpaper) ? value.wallpaper : DEFAULTS.wallpaper,
      dockMagnification: value.dockMagnification !== false,
      compactMode: value.compactMode === true,
      reduceMotion: value.reduceMotion === true,
      showDesktopWidget: value.showDesktopWidget !== false,
      sounds: value.sounds !== false
    };
  }
  function read() {
    if (!can("settings.read")) return { ...DEFAULTS };
    try {
      return normalize(JSON.parse(global.localStorage.getItem(STORAGE_KEY) || "{}"));
    } catch {
      return { ...DEFAULTS };
    }
  }
  function setStatus(message, isError = false) {
    if (!controls.status) return;
    controls.status.textContent = message;
    controls.status.dataset.state = isError ? "error" : "success";
  }
  function syncControls() {
    if (controls.theme) controls.theme.value = preferences.theme;
    if (controls.wallpaper) controls.wallpaper.value = preferences.wallpaper;
    if (controls.dockMagnification) controls.dockMagnification.checked = preferences.dockMagnification;
    if (controls.compactMode) controls.compactMode.checked = preferences.compactMode;
    if (controls.reduceMotion) controls.reduceMotion.checked = preferences.reduceMotion;
    if (controls.showDesktopWidget) controls.showDesktopWidget.checked = preferences.showDesktopWidget;
  }
  function apply(value) {
    const next = normalize(value);
    const root = document.documentElement;
    const palette = THEMES[next.theme];
    root.dataset.phantomTheme = next.theme;
    root.dataset.phantomDensity = next.compactMode ? "compact" : "comfortable";
    root.dataset.phantomMotion = next.reduceMotion ? "reduced" : "full";
    root.dataset.phantomDockMagnification = next.dockMagnification ? "on" : "off";
    root.style.setProperty("--mint", palette.mint);
    root.style.setProperty("--mint-strong", palette.mintStrong);
    root.style.setProperty("--amber", palette.amber);
    document.body.dataset.phantomWallpaper = next.wallpaper;
    document.body.dataset.phantomWidget = next.showDesktopWidget ? "visible" : "hidden";
    return next;
  }
  function save(next) {
    if (!can("settings.write")) throw new Error("Permission denied: settings.write");
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return apply(next);
  }

  let preferences = read();
  preferences = apply(preferences);
  syncControls();

  function update(key, value) {
    const next = normalize({ ...preferences, [key]: value });
    try {
      preferences = save(next);
      syncControls();
      setStatus("APPLIED AND SAVED IN THIS BROWSER");
    } catch (error) {
      syncControls();
      setStatus(error.message.toUpperCase(), true);
    }
  }
  controls.theme?.addEventListener("change", () => update("theme", controls.theme.value));
  controls.wallpaper?.addEventListener("change", () => update("wallpaper", controls.wallpaper.value));
  controls.dockMagnification?.addEventListener("change", () => update("dockMagnification", controls.dockMagnification.checked));
  controls.compactMode?.addEventListener("change", () => update("compactMode", controls.compactMode.checked));
  controls.reduceMotion?.addEventListener("change", () => update("reduceMotion", controls.reduceMotion.checked));
  controls.showDesktopWidget?.addEventListener("change", () => update("showDesktopWidget", controls.showDesktopWidget.checked));
  controls.reset?.addEventListener("click", () => {
    try {
      if (!can("saves.manage")) throw new Error("Permission denied: saves.manage");
      if (!global.confirm("Reset PhantomX appearance and workspace preferences stored in this browser?")) return;
      global.localStorage.removeItem(STORAGE_KEY);
      preferences = apply({ ...DEFAULTS });
      syncControls();
      setStatus("DEFAULT SETTINGS RESTORED");
    } catch (error) {
      setStatus(error.message.toUpperCase(), true);
    }
  });

  global.PhantomDeckSettings = Object.freeze({
    getSettings: () => ({ ...preferences }),
    applySettings: (value) => { preferences = apply(value); syncControls(); return { ...preferences }; },
    storageKey: STORAGE_KEY
  });
})(window);
