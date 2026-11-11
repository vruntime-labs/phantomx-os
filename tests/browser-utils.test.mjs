import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";

function loadUtils() {
  const window = {};
  vm.runInNewContext(fs.readFileSync(new URL("../apps/browser-utils.js", import.meta.url), "utf8"), { window, URL });
  return window.PhantomBrowserUtils;
}

test("NetBrowser normalizes bare domains and preserves HTTP(S) URLs", () => {
  const utils = loadUtils();
  assert.equal(utils.normalizeWebUrl("example.com"), "https://example.com/");
  assert.equal(utils.normalizeWebUrl("http://example.com/path"), "http://example.com/path");
  assert.equal(utils.normalizeWebUrl("https://example.com"), "https://example.com/");
});

test("NetBrowser rejects unsafe schemes and credential-bearing URLs", () => {
  const utils = loadUtils();
  assert.throws(() => utils.normalizeWebUrl("javascript:alert(1)"));
  assert.throws(() => utils.normalizeWebUrl("file:///etc/passwd"));
  assert.throws(() => utils.normalizeWebUrl("https://user:pass@example.com"));
});

test("OpenCam accepts only OpenCCTV public directory and camera pages", () => {
  const utils = loadUtils();
  assert.equal(utils.isOpenCctvUrl("https://opencctv.org/open-cameras"), true);
  assert.equal(utils.isOpenCctvUrl("https://opencctv.org/cameras/india/example"), true);
  assert.equal(utils.isOpenCctvUrl("https://example.com/cameras/india/example"), false);
  assert.equal(utils.isOpenCctvUrl("https://opencctv.org/about"), false);
  assert.equal(utils.isOpenCctvUrl("javascript:alert(1)"), false);
});
