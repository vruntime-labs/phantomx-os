import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";

function createRuntime(storage = new Map()) {
  const permissions = {
    "phantom.mission-control":["missions.read","missions.progress.write","saves.read","saves.write"],
    "phantom.shadow-comms":["story.dialogue.read","story.dialogue.write"],
    "phantom.sysguard":["simulation.status.read"],
    "phantom.netradar":["story.mission.record"],
    "phantom.packetsniffer":["story.mission.record"],
    "phantom.hexscope":["story.mission.record"]
  };
  const window = {
    localStorage:{
      getItem(key){return storage.has(key)?storage.get(key):null;},
      setItem(key,value){storage.set(key,String(value));},
      removeItem(key){storage.delete(key);}
    },
    PhantomAppRegistry:{
      hasCapability(appId,capability){return Boolean(permissions[appId]?.includes(capability));}
    }
  };
  const context={window,console,Date,JSON,Object,Set,Array,Number,String,TypeError};
  vm.runInNewContext(fs.readFileSync(new URL("../apps/story-engine.js",import.meta.url),"utf8"),context);
  return {window,storage};
}

test("story campaign starts idle and is readable only by declared story apps",()=>{
  const {window}=createRuntime();
  assert.equal(window.PhantomStoryEngine.getState("phantom.mission-control").stage,"briefing");
  assert.throws(()=>window.PhantomStoryEngine.getState("phantom.netradar"),/Permission denied/);
  assert.equal(window.PhantomStoryEngine.getMission("phantom.mission-control").id,"aster-quiet-relay");
});

test("campaign evidence is gated by an active mission and the owning simulation app",()=>{
  const {window}=createRuntime();
  const engine=window.PhantomStoryEngine;
  assert.equal(engine.recordEvidence("phantom.netradar","relay-topology").reason,"mission-not-active");
  assert.equal(engine.startMission("phantom.mission-control").reason,"started");
  assert.equal(engine.recordEvidence("phantom.packetsniffer","relay-topology").reason,"permission-denied");
  assert.equal(engine.recordEvidence("phantom.netradar","relay-topology").reason,"recorded");
  assert.equal(engine.recordEvidence("phantom.netradar","relay-topology").reason,"already-recorded");
  assert.equal(engine.getState("phantom.mission-control").progress,1);
});

test("evidence progression persists and unlocks the two ending choices",()=>{
  const runtime=createRuntime();
  const engine=runtime.window.PhantomStoryEngine;
  engine.startMission("phantom.mission-control");
  engine.recordEvidence("phantom.netradar","relay-topology");
  engine.recordEvidence("phantom.packetsniffer","expired-session");
  engine.recordEvidence("phantom.hexscope","trace-anomaly");
  assert.equal(engine.getState("phantom.shadow-comms").stage,"report");
  assert.equal(engine.chooseOutcome("phantom.shadow-comms","unknown").reason,"invalid-outcome");
  assert.equal(engine.chooseOutcome("phantom.shadow-comms","anomaly").reason,"completed");
  assert.equal(engine.getState("phantom.sysguard").status,"complete");
  const reloaded=createRuntime(runtime.storage);
  assert.equal(reloaded.window.PhantomStoryEngine.getState("phantom.mission-control").outcome,"anomaly");
  assert.equal(reloaded.window.PhantomStoryEngine.getState("phantom.mission-control").stage,"complete");
});

test("campaign cannot be concluded before all three evidence items are recorded",()=>{
  const {window}=createRuntime();
  const engine=window.PhantomStoryEngine;
  engine.startMission("phantom.mission-control");
  assert.equal(engine.chooseOutcome("phantom.shadow-comms","maintenance").reason,"evidence-incomplete");
});

test("campaign reset clears persisted progress and returns to briefing",()=>{
  const {window,storage}=createRuntime();
  const engine=window.PhantomStoryEngine;
  engine.startMission("phantom.mission-control");
  engine.recordEvidence("phantom.netradar","relay-topology");
  assert.equal(storage.has(engine.storageKey),true);
  assert.equal(engine.reset("phantom.mission-control").reason,"reset");
  assert.equal(storage.has(engine.storageKey),false);
  assert.equal(engine.getState("phantom.mission-control").stage,"briefing");
});
