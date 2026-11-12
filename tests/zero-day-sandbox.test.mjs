import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html=fs.readFileSync(new URL("../story-test/index.html",import.meta.url),"utf8");
const script=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)?.[1]||"";

test("ZERO-DAY SANDBOX is a playable investigation campaign",()=>{
  for(const id of ["INIT_SANDBOX","GHOST_PR","MIRROR_VFS"]) assert.ok(script.includes(id));
  for(const view of ["messages","contacts","calls","notes","mail","files","browser","gallery","board"]) assert.match(html,new RegExp('data-view="'+view+'"'));
  assert.match(html,/Mission control/);
  assert.match(html,/Investigation board/);
  assert.match(script,/PARTNERSHIP ENDING/);
});

test("story runtime parses and stores only local progress",()=>{
  assert.ok(script.length>5000);
  assert.doesNotThrow(()=>new vm.Script(script));
  assert.match(script,/phantomx\.zero-day-story\.v2/);
  assert.match(script,/localStorage/);
  assert.doesNotMatch(script,/fetch\s*\(|XMLHttpRequest|WebSocket|navigator\.sendBeacon/);
});

test("missions have objectives, evidence collection, hints, and branching trust",()=>{
  for(const id of ["message","manifest","signature","thread","patch","sora","snapshotA","snapshotB","marker","contain"]) assert.ok(script.includes('"'+id+'"'));
  assert.match(script,/function addClue/);
  assert.match(script,/function requestHint/);
  assert.match(script,/decodeMarker/);
  assert.match(script,/containSafe/);
  assert.match(script,/containPurge/);
  assert.match(script,/askSnapshot/);
  assert.match(script,/shareBoot/);
  assert.match(script,/withholdBoot/);
  assert.match(script,/demandProof/);
  assert.match(script,/state\.ending==="clean"/);
  assert.match(script,/state\.ending==="cold"/);
  assert.match(script,/answer==="024117"/);
  assert.match(script,/function showCinematic/);
  assert.match(script,/function contacts/);
  assert.match(script,/function calls/);
  assert.match(script,/function notes/);
  assert.match(script,/state\.trust\+\+/);
  assert.match(script,/state\.trust--/);
});

test("story UI supports save, reset, replay, and responsive scrolling",()=>{
  assert.match(html,/id="saveBtn"/);
  assert.match(html,/id="resetBtn"/);
  assert.match(html,/id="introModal"/);
  assert.match(html,/overflow:auto!important/);
  assert.match(html,/prefers-reduced-motion/);
  assert.match(html,/id="cinematic"/);
  assert.match(html,/RECONSTRUCT THE MIRROR KEY/);
  assert.match(html,/grid-template-columns:1fr/);
});

test("story campaign remains fictional and does not request host access",()=>{
  assert.match(html,/No host access or external targets|No host access/);
  assert.match(html,/FICTIONAL INVESTIGATION SIMULATION/);
  assert.doesNotMatch(script,/navigator\.mediaDevices|RTCPeerConnection|child_process|process\.env/);
});
