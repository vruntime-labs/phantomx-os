/**
 * PhantomX Tier 3 story applications.
 * The campaign is a local, fictional investigation with no live targets.
 */
(function (global) {
  "use strict";
  const engine = global.PhantomStoryEngine;
  const registry = global.PhantomAppRegistry;
  const byId = (id) => document.getElementById(id);
  if (!engine || !registry) return;

  // MissionControl: launch the evidence tools and track their story events.
  const missionStatus = byId("mission-control-status");
  const missionProgress = byId("mission-progress");
  const missionProgressLabel = byId("mission-progress-label");
  const missionObjectives = byId("mission-objectives");
  const missionStart = byId("mission-start");
  const missionReset = byId("mission-reset");
  const missionResult = byId("mission-result");
  const mission = engine.getMission("phantom.mission-control");

  function renderMission(state) {
    if (!missionObjectives) return;
    missionObjectives.replaceChildren();
    mission.evidence.forEach((objective,index)=>{
      const complete = state.evidence.includes(objective.id);
      const card = document.createElement("article");
      card.className = "story-objective" + (complete ? " is-complete" : "");
      const marker = document.createElement("span");
      marker.className = "story-objective-marker";
      marker.textContent = complete ? "✓" : String(index+1).padStart(2,"0");
      const copy = document.createElement("div");
      copy.className = "story-objective-copy";
      const title = document.createElement("strong");
      title.textContent = objective.label;
      const hint = document.createElement("p");
      hint.textContent = complete ? "EVIDENCE ADDED TO CASE FILE" : objective.hint;
      const source = document.createElement("small");
      source.textContent = objective.source.toUpperCase();
      copy.append(title,hint,source);
      const launch = document.createElement("button");
      launch.type = "button";
      launch.className = "story-open-tool";
      launch.textContent = complete ? "REVIEW" : "OPEN TOOL";
      launch.addEventListener("click",()=>{
        const result = registry.launch(objective.appId);
        if (!result.ok && missionStatus) missionStatus.textContent = "TOOL UNAVAILABLE · " + result.reason.toUpperCase();
      });
      card.append(marker,copy,launch);
      missionObjectives.appendChild(card);
    });
    const progress = state.evidence.length;
    if (missionProgress) missionProgress.value = progress;
    if (missionProgressLabel) missionProgressLabel.textContent = progress + " / " + mission.evidence.length + " EVIDENCE ITEMS";
    if (missionStart) {
      missionStart.disabled = state.status === "active" || state.status === "complete";
      missionStart.textContent = state.status === "active" ? "MISSION IN PROGRESS" : state.status === "complete" ? "MISSION COMPLETE" : "ACCEPT CONTRACT";
    }
    if (missionReset) missionReset.hidden = state.status === "idle";
    if (missionResult) {
      missionResult.hidden = state.status !== "complete";
      missionResult.textContent = state.status === "complete" ? mission.outcomes[state.outcome].title + " — " + mission.outcomes[state.outcome].body : "";
    }
    if (missionStatus) {
      missionStatus.textContent = state.status === "complete" ? "CONTRACT CLOSED · " + state.outcome.toUpperCase() :
        state.status === "active" ? (state.evidence.length === mission.evidence.length ? "EVIDENCE COMPLETE · REPORT TO SHADOWCOMMS" : "INVESTIGATION ACTIVE · COLLECT THE REMAINING EVIDENCE") :
        "CONTRACT AVAILABLE · AWAITING ACCEPTANCE";
    }
  }
  function currentMissionState() { return engine.getState("phantom.mission-control"); }
  missionStart?.addEventListener("click",()=>{
    const result = engine.startMission("phantom.mission-control");
    if (missionStatus) missionStatus.textContent = result.ok ? "CONTRACT ACCEPTED · BEGIN EVIDENCE REVIEW" : result.reason.toUpperCase();
  });
  missionReset?.addEventListener("click",()=>{
    if (!global.confirm("Reset this local campaign and clear its saved evidence?")) return;
    engine.reset("phantom.mission-control");
  });
  engine.subscribe("phantom.mission-control",renderMission);
  renderMission(currentMissionState());

  // ShadowComms: handler dialogue and the final case classification.
  const commsFeed = byId("shadow-comms-feed");
  const commsChoices = byId("shadow-comms-choices");
  const commsStatus = byId("shadow-comms-status");
  function addMessage(speaker,message,kind) {
    const item = document.createElement("article");
    item.className = "comms-message " + (kind || "");
    const label = document.createElement("small");
    label.textContent = speaker;
    const body = document.createElement("p");
    body.textContent = message;
    item.append(label,body);
    commsFeed.appendChild(item);
  }
  function renderComms(state) {
    if (!commsFeed || !commsChoices) return;
    commsFeed.replaceChildren();
    commsChoices.replaceChildren();
    if (state.status === "idle") {
      addMessage("HANDLER / ECHO","Channel is open. Accept the Project Aster contract in MissionControl and I will guide the review.","handler");
      commsStatus.textContent = "STANDBY · ENCRYPTION IS FICTIONAL";
      return;
    }
    if (state.status === "complete") {
      const ending = mission.outcomes[state.outcome];
      addMessage("HANDLER / ECHO","I have your report. The case is now closed in this simulation.","handler");
      addMessage("CASE OUTCOME",ending.title + ". " + ending.body,"outcome");
      commsStatus.textContent = "CHANNEL CLOSED · CAMPAIGN CHAPTER COMPLETE";
      return;
    }
    addMessage("HANDLER / ECHO","Keep this review evidence-led. We are working from the local Project Aster fixtures only.","handler");
    if (state.evidence.includes("relay-topology")) addMessage("YOU","Relay topology reviewed. The relay is a synthetic node in the lab map.","operator");
    if (state.evidence.includes("expired-session")) addMessage("YOU","Packet PKT-003 records a rejected analyst session with session_expired.","operator");
    if (state.evidence.includes("trace-anomaly")) addMessage("YOU","The local trace records a maintenance acknowledgement from relay-node-18.","operator");
    if (state.evidence.length === mission.evidence.length) {
      addMessage("HANDLER / ECHO","That is the full case file. Classify the event: routine maintenance, or an anomaly that needs escalation?","handler");
      [
        ["maintenance","CLASSIFY AS SCHEDULED MAINTENANCE"],
        ["anomaly","ESCALATE THE SESSION ANOMALY"]
      ].forEach(([id,label])=>{
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.addEventListener("click",()=>{
          const result = engine.chooseOutcome("phantom.shadow-comms",id);
          if (commsStatus) commsStatus.textContent = result.ok ? "REPORT SUBMITTED" : result.reason.toUpperCase();
        });
        commsChoices.appendChild(button);
      });
      commsStatus.textContent = "REPORT READY · CHOOSE A CLASSIFICATION";
    } else {
      addMessage("HANDLER / ECHO","Case progress: " + state.evidence.length + " of " + mission.evidence.length + " evidence items. MissionControl shows the next tools to review.","handler");
      commsStatus.textContent = "FIELD CHANNEL ACTIVE · " + state.evidence.length + "/" + mission.evidence.length + " EVIDENCE";
    }
  }
  engine.subscribe("phantom.shadow-comms",renderComms);
  renderComms(engine.getState("phantom.shadow-comms"));

  // SysGuard: deterministic fictional telemetry derived only from campaign progress.
  const sysStatus = byId("sysguard-status");
  const sysStage = byId("sysguard-stage");
  const sysMeters = {
    cpu:{bar:byId("sysguard-cpu-bar"),value:byId("sysguard-cpu-value")},
    memory:{bar:byId("sysguard-memory-bar"),value:byId("sysguard-memory-value")},
    trace:{bar:byId("sysguard-trace-bar"),value:byId("sysguard-trace-value")}
  };
  function renderSysGuard(state) {
    const count = state.evidence.length;
    const values = {cpu:state.status === "idle" ? 8 : 16 + count*8,memory:state.status === "idle" ? 28 : 34 + count*7,trace:state.status === "idle" ? 0 : Math.min(82,10 + count*21)};
    Object.entries(values).forEach(([key,value])=>{
      const meter = sysMeters[key];
      if (meter.bar) meter.bar.style.width = value + "%";
      if (meter.value) meter.value.textContent = value + "%";
    });
    if (sysStage) sysStage.textContent = state.status === "complete" ? "CHAPTER COMPLETE" : state.status === "active" ? state.evidence.length === mission.evidence.length ? "AWAITING REPORT" : "FIELD INVESTIGATION" : "IDLE / NO CONTRACT";
    if (sysStatus) sysStatus.textContent = "SIMULATED SESSION · " + (state.status === "active" ? "ACTIVE" : state.status === "complete" ? "CLOSED" : "STANDBY");
  }
  engine.subscribe("phantom.sysguard",renderSysGuard);
  renderSysGuard(engine.getState("phantom.sysguard"));
})(window);
