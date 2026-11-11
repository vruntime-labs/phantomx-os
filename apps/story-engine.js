/**
 * PhantomX Story Engine.
 * Local-only state machine for the first fictional single-player campaign.
 * It does not connect to real systems or use remote identity/services.
 */
(function (global) {
  "use strict";

  const STORAGE_KEY = "phantomx.story.v1";
  const EVIDENCE = Object.freeze([
    Object.freeze({ id:"relay-topology", label:"Relay topology reviewed", source:"NetRadar", appId:"phantom.netradar", windowId:"netradar-window", hint:"Select the RELAY NODE in the fictional Project Aster map." }),
    Object.freeze({ id:"expired-session", label:"Expired session identified", source:"PacketSniffer", appId:"phantom.packetsniffer", windowId:"packetsniffer-window", hint:"Inspect synthetic packet PKT-003 and its session_expired response." }),
    Object.freeze({ id:"trace-anomaly", label:"Maintenance trace examined", source:"HexScope", appId:"phantom.hexscope", windowId:"hexscope-window", hint:"Open /logs/trace.log and review the relay maintenance entry." })
  ]);
  const MISSION = Object.freeze({
    id:"aster-quiet-relay",
    title:"The Quiet Relay",
    codename:"PROJECT ASTER",
    difficulty:"FIELD ANALYSIS",
    briefing:"A routine archive maintenance window was followed by an expired analyst session. Review the synthetic relay topology, compare the packet record and inspect the local trace. Decide whether the event is consistent with scheduled maintenance or should be escalated for review.",
    boundary:"Every host, packet, log and event is fictional browser-local training data. No real network is contacted.",
    evidence:EVIDENCE,
    outcomes:Object.freeze({
      maintenance:Object.freeze({ label:"Classify as scheduled maintenance", title:"A Quiet Resolution", body:"Your report connects the relay's maintenance acknowledgement with the expired session. Operations accepts the explanation and schedules a routine archive review. The lab returns to standby." }),
      anomaly:Object.freeze({ label:"Escalate the session anomaly", title:"An Open Question", body:"Your report flags the expired session for a second review. The handler pauses the next archive window while the fictional operations team checks its own records. The investigation remains open for a future chapter." })
    })
  });
  const OWNER_BY_EVIDENCE = Object.freeze({
    "relay-topology":"phantom.netradar",
    "expired-session":"phantom.packetsniffer",
    "trace-anomaly":"phantom.hexscope"
  });
  const READ_CAPABILITY = Object.freeze({
    "phantom.mission-control":"missions.read",
    "phantom.shadow-comms":"story.dialogue.read",
    "phantom.sysguard":"simulation.status.read"
  });

  function can(appId, capability) {
    return Boolean(global.PhantomAppRegistry?.hasCapability(appId, capability));
  }
  function blankState() {
    return { missionId:null, status:"idle", evidence:[], outcome:null, startedAt:null, completedAt:null };
  }
  function cleanState(value) {
    if (!value || value.missionId !== MISSION.id || !["active","complete"].includes(value.status)) return blankState();
    const evidence = EVIDENCE.map((item)=>item.id).filter((id)=>Array.isArray(value.evidence)&&value.evidence.includes(id));
    const outcome = Object.hasOwn(MISSION.outcomes, value.outcome) ? value.outcome : null;
    const status = value.status === "complete" && outcome && evidence.length === EVIDENCE.length ? "complete" : "active";
    return {
      missionId:MISSION.id,
      status,
      evidence,
      outcome:status === "complete" ? outcome : null,
      startedAt:Number.isFinite(value.startedAt) ? value.startedAt : null,
      completedAt:status === "complete" && Number.isFinite(value.completedAt) ? value.completedAt : null
    };
  }
  function cloneState() {
    return { ...state, evidence:[...state.evidence] };
  }
  function persist() {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }
  function publish() {
    const snapshot = cloneState();
    listeners.forEach((listener)=>{ try { listener(snapshot); } catch (error) { console.error("PhantomX story listener error:",error); } });
  }
  function readState() {
    try { return cleanState(JSON.parse(global.localStorage.getItem(STORAGE_KEY) || "null")); }
    catch { return blankState(); }
  }
  function getStage(value) {
    if (value.status === "complete") return "complete";
    if (value.status === "active" && value.evidence.length === EVIDENCE.length) return "report";
    if (value.status === "active") return "investigating";
    return "briefing";
  }

  let state = readState();
  const listeners = new Set();

  function getMission(appId) {
    if (!can(appId, READ_CAPABILITY[appId])) throw new Error("Permission denied: mission read access");
    return MISSION;
  }
  function getState(appId) {
    if (!can(appId, READ_CAPABILITY[appId])) throw new Error("Permission denied: story state read access");
    const snapshot = cloneState();
    return Object.freeze({ ...snapshot, stage:getStage(snapshot), progress:snapshot.evidence.length, total:EVIDENCE.length });
  }
  function subscribe(appId, listener) {
    if (!can(appId, READ_CAPABILITY[appId])) throw new Error("Permission denied: story subscription");
    if (typeof listener !== "function") throw new TypeError("Story listener must be a function");
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
  function startMission(appId) {
    if (!can(appId,"missions.progress.write")) return { ok:false, reason:"permission-denied" };
    if (state.status === "active") return { ok:true, reason:"already-active", state:getState(appId) };
    if (state.status === "complete") return { ok:false, reason:"mission-complete-reset-to-replay" };
    state = { missionId:MISSION.id, status:"active", evidence:[], outcome:null, startedAt:Date.now(), completedAt:null };
    persist();
    publish();
    return { ok:true, reason:"started", state:getState(appId) };
  }
  function recordEvidence(appId, evidenceId) {
    const expectedOwner = OWNER_BY_EVIDENCE[evidenceId];
    if (!expectedOwner || expectedOwner !== appId || !can(appId,"story.mission.record")) {
      return { ok:false, reason:"permission-denied" };
    }
    if (state.status !== "active") return { ok:false, reason:"mission-not-active" };
    if (state.evidence.includes(evidenceId)) return { ok:true, reason:"already-recorded", state:getState("phantom.mission-control") };
    state = { ...state, evidence:[...state.evidence,evidenceId] };
    persist();
    publish();
    return { ok:true, reason:"recorded", state:getState("phantom.mission-control") };
  }
  function chooseOutcome(appId, outcomeId) {
    if (!can(appId,"story.dialogue.write")) return { ok:false, reason:"permission-denied" };
    if (state.status !== "active" || state.evidence.length !== EVIDENCE.length) return { ok:false, reason:"evidence-incomplete" };
    if (!Object.hasOwn(MISSION.outcomes,outcomeId)) return { ok:false, reason:"invalid-outcome" };
    state = { ...state, status:"complete", outcome:outcomeId, completedAt:Date.now() };
    persist();
    publish();
    return { ok:true, reason:"completed", state:getState("phantom.shadow-comms") };
  }
  function reset(appId) {
    if (!can(appId,"saves.write")) return { ok:false, reason:"permission-denied" };
    state = blankState();
    try { global.localStorage.removeItem(STORAGE_KEY); } catch { /* in-memory reset still applies */ }
    publish();
    return { ok:true, reason:"reset", state:getState(appId) };
  }

  global.PhantomStoryEngine = Object.freeze({
    storageKey:STORAGE_KEY,
    getMission,
    getState,
    subscribe,
    startMission,
    recordEvidence,
    chooseOutcome,
    reset
  });
})(window);
