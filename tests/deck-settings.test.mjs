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
    "deck-sounds": makeElement(),
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

test("DeckSettings applies wallpaper and stores sound preference", () => {
  const { document, elements, stored, window } = bootSettings();
  elements["deck-wallpaper"].value = "scanlines";
  elements["deck-wallpaper"].dispatch("change");
  elements["deck-sounds"].checked = false;
  elements["deck-sounds"].dispatch("change");
  assert.equal(document.body.dataset.phantomWallpaper, "scanlines");
  const saved = JSON.parse(stored.get(window.PhantomDeckSettings.storageKey));
  assert.equal(saved.wallpaper, "scanlines");
  assert.equal(saved.sounds, false);
});

test("DeckSettings reset restores defaults and clears stored preferences", () => {
  const { window, document, elements, stored, rootStyle } = bootSettings();
  elements["deck-theme"].value = "ice";
  elements["deck-theme"].dispatch("change");
  elements["deck-reset-settings"].dispatch("click");
  assert.equal(stored.has(window.PhantomDeckSettings.storageKey), false);
  assert.equal(document.documentElement.dataset.phantomTheme, "mint");
  assert.equal(document.body.dataset.phantomWallpaper, "grid");
  assert.equal(rootStyle.get("--mint"), "#9fe3c4");
  assert.equal(elements["deck-theme"].value, "mint");
});


test("DeckSettings appearance modes have explicit desktop-canvas styling", () => {
  const css = fs.readFileSync(new URL("../style.css", import.meta.url), "utf8");
  assert.match(css, /:root\\[data-phantom-theme="amber"\\]/);
  assert.match(css, /body\\[data-phantom-wallpaper="scanlines"\\] \\.desktop-canvas::after/);
  assert.match(css, /--phantom-accent-rgb/);
  assert.match(css, /repeating-linear-gradient/);
});
