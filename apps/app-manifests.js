/**
 * PhantomX application catalog.
 * Metadata only: an app is launchable only when status is "available"
 * and its window has been wired into the browser runtime.
 */
(function (global) {
  "use strict";
  const APP_STATUS = Object.freeze({ AVAILABLE:"available", IN_DEVELOPMENT:"in-development", PLANNED:"planned" });
  const defaults = Object.freeze({ width:860, height:560, minWidth:420, minHeight:280, resizable:true, minimizable:true, maximizable:true });
  const defineApp = (app) => Object.freeze({ ...app, window:Object.freeze({ ...defaults, ...app.window }), permissions:Object.freeze([...(app.permissions || [])]) });
  const apps = Object.freeze([
    defineApp({id:"phantom.term",name:"PhantomTerm",description:"A command interface for PhantomX simulation environments.",tier:1,category:"Core",icon:"terminal",status:APP_STATUS.AVAILABLE,legacyWindowId:"terminal-window",window:{width:820,height:520,minWidth:460,minHeight:280},permissions:["vfs.read","vfs.write","apps.launch","session.read"]}),
    defineApp({id:"phantom.vfs-explorer",name:"VFS Explorer",description:"Browse and inspect the shared PhantomX virtual filesystem.",tier:1,category:"Core",icon:"folder",status:APP_STATUS.AVAILABLE,legacyWindowId:"vfs-explorer-window",window:{width:900,height:580},permissions:["vfs.read","vfs.write"]}),
    defineApp({id:"phantom.cyberpad",name:"CyberPad",description:"Edit simulation notes, fictional payloads and virtual files.",tier:1,category:"Core",icon:"file-edit",status:APP_STATUS.PLANNED,window:{width:900,height:620},permissions:["vfs.read","vfs.write"]}),
    defineApp({id:"phantom.netbrowser",name:"NetBrowser",description:"Browse fictional, locally hosted mission intranet sites.",tier:1,category:"Core",icon:"globe",status:APP_STATUS.PLANNED,window:{width:1020,height:680,minWidth:520,minHeight:360},permissions:["mission-sites.read","session.read"]}),
    defineApp({id:"phantom.deck-settings",name:"DeckSettings",description:"Configure PhantomX appearance, sound and local save data.",tier:1,category:"Core",icon:"settings",status:APP_STATUS.PLANNED,window:{width:760,height:560},permissions:["settings.read","settings.write","saves.manage"]}),
    defineApp({id:"phantom.netradar",name:"NetRadar",description:"Explore fictional network topologies and simulated ports.",tier:2,category:"Simulation",icon:"network",status:APP_STATUS.PLANNED,window:{width:980,height:640,minWidth:560,minHeight:380},permissions:["simulation.network.read","simulation.network.write"]}),
    defineApp({id:"phantom.packetsniffer",name:"PacketSniffer",description:"Inspect synthetic packets and fictional request/response data.",tier:2,category:"Simulation",icon:"activity",status:APP_STATUS.PLANNED,window:{width:1020,height:660,minWidth:580,minHeight:380},permissions:["simulation.traffic.read","simulation.traffic.write"]}),
    defineApp({id:"phantom.hashbreaker",name:"HashBreaker",description:"Solve offline encoding and hash-verification challenges.",tier:2,category:"Simulation",icon:"key-round",status:APP_STATUS.PLANNED,window:{width:900,height:620},permissions:["vfs.read","simulation.crypto.read","simulation.crypto.write"]}),
    defineApp({id:"phantom.hexscope",name:"HexScope",description:"Analyze fictional logs, metadata and forensic challenge files.",tier:2,category:"Simulation",icon:"scan-search",status:APP_STATUS.PLANNED,window:{width:1020,height:660},permissions:["vfs.read","simulation.forensics.read"]}),
    defineApp({id:"phantom.opencam",name:"OpenCam Viewer",description:"View intentionally public traffic, weather and scenic camera feeds.",tier:2,category:"Situational Awareness",icon:"cctv",status:APP_STATUS.PLANNED,window:{width:1040,height:680,minWidth:560,minHeight:400},permissions:["public-cameras.catalog.read","public-cameras.preview.read"],dataPolicy:"Public operator-published feeds only; no camera discovery, private feeds, recording or surveillance of individuals."}),
    defineApp({id:"phantom.mission-control",name:"MissionControl",description:"Select fictional contracts, objectives and simulation environments.",tier:3,category:"Story",icon:"target",status:APP_STATUS.PLANNED,window:{width:1000,height:660},permissions:["missions.read","missions.progress.write","saves.read","saves.write"]}),
    defineApp({id:"phantom.shadow-comms",name:"ShadowComms",description:"Read fictional handler messages and branching character dialogue.",tier:3,category:"Story",icon:"message-square",status:APP_STATUS.PLANNED,window:{width:760,height:580},permissions:["story.dialogue.read","story.dialogue.write"]}),
    defineApp({id:"phantom.sysguard",name:"SysGuard",description:"Monitor simulated session health, trace level and resource load.",tier:3,category:"Story",icon:"shield-check",status:APP_STATUS.PLANNED,window:{width:720,height:500},permissions:["simulation.status.read"]})
  ]);
  global.PhantomAppManifests = Object.freeze({ APP_STATUS, apps, getById(id){return apps.find((app)=>app.id===id)||null;}, getByTier(tier){return apps.filter((app)=>app.tier===tier);} });
})(window);
