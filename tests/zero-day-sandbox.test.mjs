import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html=fs.readFileSync(new URL("../story-test/index.html",import.meta.url),"utf8");
const script=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)?.[1]||"";

test("ZERO-DAY SANDBOX is an isolated three-chapter test campaign",()=>{
  assert.match(html,/ZERO-DAY SANDBOX/);
  assert.match(html,/Separate from Project Aster|separate from Project Aster/i);
  assert.match(script,/INIT_SANDBOX/);
  assert.match(script,/GHOST_PR/);
  assert.match(script,/MIRROR_VFS/);
  assert.match(script,/Sandbox sealed/);
});

test("playtest script parses and persists only browser-local progress",()=>{
  assert.ok(script.length>500);
  assert.doesNotThrow(()=>new vm.Script(script));
  assert.match(script,/phantomx\.zero-day-sandbox\.test\.v1/);
  assert.match(script,/localStorage/);
  assert.doesNotMatch(script,/fetch\s*\(|XMLHttpRequest|WebSocket|navigator\.sendBeacon/);
});

test("test campaign includes safe containment choices, reset, and per-chapter evidence review",()=>{
  for(const id of ["isolate","quarantine","contain"]) assert.ok(script.includes('"'+id+'"'));
  assert.match(html,/id="zd-reset"/);
  assert.match(script,/confirm\(/);
  assert.match(script,/state\.reviewed=\[\]/);
});

test("playtest page remains scrollable and exposes evidence-review progress",()=>{
  assert.match(html,/overflow-y:auto/);
  assert.match(html,/EVIDENCE REVIEW/);
  assert.match(html,/zd-choice:disabled/);
});
