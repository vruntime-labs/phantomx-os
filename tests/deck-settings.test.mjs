import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";

function bootSettings() {
  const makeElement = (value = "") => {
    const listeners = {};
    return {
      value, checked: false, textContent: "", dataset: {}, listeners,
      addEventListener(type, callback) { (listeners[type] ||= []).push(callback); },
      dispatch(type) { for (const callback of listeners[type] || []) callback({ target: this }); }
    };
  };
  const elements = {
    "deck-theme": makeElement("mint"),
    "deck-wallpaper": makeElement("grid"),
    "deck-dock-magnification": makeElement(),
    "deck-compact-mode": makeElement(),
    "deck-reduce-motion": makeElement(),
    "deck-show-widget": makeElement(),
    "deck-reset-settings": makeElement(),
    "deck-settings-status": makeElement()
  };
  const stored = new Map();
  const rootStyle = new Map();
  const window = {
    PhantomAppRegistry: { hasCapability: (_id, permission) => ["settings.read", "settings.write", "saves.manage"].includes(permission) },
    localStorage: {
      getItem: (key) => stored.get(key) ?? null,
      setItem: (key, value) => stored.set(key, value),
      removeItem: (key) => stored.delete(key)
    },
    confirm: () => true
  };
  const document = {
    documentElement: { dataset: {}, style: { setProperty: (key, value) => rootStyle.set(key, value) } },
    body: { dataset: {} },
    getElementById: (id) => elements[id] || null
  };
  vm.runInNewContext(fs.readFileSync(new URL("../apps/deck-settings.js", import.meta.url), "utf8"), { window, document, Object, JSON });
  return { window, document, elements, stored, rootStyle };
}

test("DeckSettings applies selected theme visibly and persists it", () => {
  const { window, document, elements, stored, rootStyle } = bootSettings();
  elements["deck-theme"].value = "amber";
  elements["deck-theme"].dispatch("change");
  assert.equal(document.documentElement.dataset.phantomTheme, "amber");
  assert.equal(rootStyle.get("--mint"), "#e8bd79");
  assert.equal(JSON.parse(stored.get(window.PhantomDeckSettings.storageKey)).theme, "amber");
  assert.match(elements["deck-settings-status"].textContent, /APPLIED AND SAVED/);
});

test("DeckSettings applies wallpaper and persists it", () => {
  const { document, elements, stored, window } = bootSettings();
  elements["deck-wallpaper"].value = "scanlines";
  elements["deck-wallpaper"].dispatch("change");
  assert.equal(document.body.dataset.phantomWallpaper, "scanlines");
  assert.equal(JSON.parse(stored.get(window.PhantomDeckSettings.storageKey)).wallpaper, "scanlines");
});

test("DeckSettings applies dock, density, motion and desktop widget preferences", () => {
  const { document, elements, stored, window } = bootSettings();
  elements["deck-dock-magnification"].checked = false;
  elements["deck-dock-magnification"].dispatch("change");
  elements["deck-compact-mode"].checked = true;
  elements["deck-compact-mode"].dispatch("change");
  elements["deck-reduce-motion"].checked = true;
  elements["deck-reduce-motion"].dispatch("change");
  elements["deck-show-widget"].checked = false;
  elements["deck-show-widget"].dispatch("change");

  assert.equal(document.documentElement.dataset.phantomDockMagnification, "off");
  assert.equal(document.documentElement.dataset.phantomDensity, "compact");
  assert.equal(document.documentElement.dataset.phantomMotion, "reduced");
  assert.equal(document.body.dataset.phantomWidget, "hidden");
  const saved = JSON.parse(stored.get(window.PhantomDeckSettings.storageKey));
  assert.equal(saved.dockMagnification, false);
  assert.equal(saved.compactMode, true);
  assert.equal(saved.reduceMotion, true);
  assert.equal(saved.showDesktopWidget, false);
});

test("DeckSettings restores all defaults and clears stored preferences", () => {
  const { window, document, elements, stored, rootStyle } = bootSettings();
  elements["deck-theme"].value = "ice";
  elements["deck-theme"].dispatch("change");
  elements["deck-compact-mode"].checked = true;
  elements["deck-compact-mode"].dispatch("change");
  elements["deck-reset-settings"].dispatch("click");
  assert.equal(stored.has(window.PhantomDeckSettings.storageKey), false);
  assert.equal(document.documentElement.dataset.phantomTheme, "mint");
  assert.equal(document.documentElement.dataset.phantomDensity, "comfortable");
  assert.equal(document.documentElement.dataset.phantomMotion, "full");
  assert.equal(document.documentElement.dataset.phantomDockMagnification, "on");
  assert.equal(document.body.dataset.phantomWallpaper, "grid");
  assert.equal(document.body.dataset.phantomWidget, "visible");
  assert.equal(rootStyle.get("--mint"), "#9fe3c4");
  assert.equal(elements["deck-theme"].value, "mint");
  assert.equal(elements["deck-dock-magnification"].checked, true);
});

test("DeckSettings appearance and workspace options have explicit CSS behavior", () => {
  const css = fs.readFileSync(new URL("../style.css", import.meta.url), "utf8");
  assert.ok(css.includes(".taskbar-dock"));
  assert.ok(css.includes(".taskbar-item.is-active::after"));
  assert.ok(css.includes(':root[data-phantom-density="compact"]'));
  assert.ok(css.includes(':root[data-phantom-motion="reduced"]'));
  assert.ok(css.includes('body[data-phantom-widget="hidden"]'));
});
