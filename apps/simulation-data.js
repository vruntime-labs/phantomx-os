/**
 * Fictional-only datasets used by the PhantomX simulation suite.
 * All addresses, hosts, packet records and evidence below are story fixtures.
 */
(function (global) {
  "use strict";
  const nodes = Object.freeze([
    Object.freeze({id:"gateway",label:"EDGE GATEWAY",ip:"10.24.0.1",x:90,y:155,role:"Gateway",ports:[{port:443,service:"HTTPS",state:"open"},{port:22,service:"SSH",state:"filtered"}],detail:"Fictional entry node for the Project Aster lab."}),
    Object.freeze({id:"relay",label:"RELAY NODE",ip:"10.24.0.18",x:285,y:75,role:"Relay",ports:[{port:8080,service:"HTTP ALT",state:"open"},{port:9001,service:"MESSAGE BUS",state:"closed"}],detail:"Synthetic relay that forwards story events inside the sandbox."}),
    Object.freeze({id:"archive",label:"ARCHIVE VAULT",ip:"10.24.0.42",x:500,y:155,role:"Archive",ports:[{port:443,service:"HTTPS",state:"open"},{port:8443,service:"ADMIN CONSOLE",state:"filtered"}],detail:"Fictional evidence store used by the current training scenario."}),
    Object.freeze({id:"sensor",label:"SENSOR GRID",ip:"10.24.0.57",x:285,y:265,role:"Sensor",ports:[{port:1883,service:"MQTT",state:"open"},{port:161,service:"SNMP",state:"closed"}],detail:"Synthetic telemetry endpoint. No physical devices are contacted."})
  ]);
  const edges = Object.freeze([["gateway","relay"],["relay","archive"],["relay","sensor"],["gateway","sensor"]].map((edge)=>Object.freeze(edge)));
  const packets = Object.freeze([
    Object.freeze({id:"PKT-001",time:"14:02:11.024",source:"10.24.0.18",destination:"10.24.0.42",protocol:"HTTPS",method:"GET",path:"/archive/status",status:200,request:{accept:"application/json", "x-sim-session":"ASTER-01"},response:{state:"ready",archive:"aster-vault",revision:4}}),
    Object.freeze({id:"PKT-002",time:"14:02:12.811",source:"10.24.0.57",destination:"10.24.0.18",protocol:"MQTT",method:"PUBLISH",path:"/telemetry/heartbeat",status:202,request:{device:"SENSOR-07",sequence:1842,signal:"nominal"},response:{accepted:true,queue:"simulated-events"}}),
    Object.freeze({id:"PKT-003",time:"14:02:14.093",source:"10.24.0.1",destination:"10.24.0.42",protocol:"HTTPS",method:"POST",path:"/session/verify",status:401,request:{user:"analyst-guest",token:"[redacted-synthetic-token]"},response:{error:"session_expired",retry:false}}),
    Object.freeze({id:"PKT-004",time:"14:02:15.407",source:"10.24.0.18",destination:"10.24.0.1",protocol:"HTTPS",method:"GET",path:"/gateway/health",status:200,request:{detail:"compact"},response:{status:"nominal",uptime_s:7200}})
  ]);
  const hashChallenge = Object.freeze({
    algorithm:"SHA-256",
    target:"e1e7a14b721e2b102b17f5a8c9ffedc406f9783fdec514a2d167737d45b1dd59",
    hint:"The candidate is a short, fictional lab phrase.",
    expectedCandidate:"phantom-lab"
  });
  const allowedCameraCategories = Object.freeze(["traffic","weather","park","wildlife","ski","surf","volcano","aurora"]);
  function safeHttps(value) {
    try { return new URL(value).protocol === "https:"; } catch { return false; }
  }
  function isEmbeddableFreeFeed(feed) {
    if (!feed || feed.is_free !== true || feed.live !== true) return false;
    if (!allowedCameraCategories.includes(String(feed.category || "").toLowerCase())) return false;
    if (feed.view?.render !== "image" || feed.view?.url_type !== "image" || !safeHttps(feed.view?.url)) return false;
    if (feed.redistribution?.preview_embed !== true) return false;
    const credit = feed.redistribution?.attribution;
    if (!credit?.name || !safeHttps(credit.url)) return false;
    return true;
  }
  global.PhantomSimulationData = Object.freeze({nodes,edges,packets,hashChallenge,allowedCameraCategories});
  global.PhantomOpenCamPolicy = Object.freeze({isEmbeddableFreeFeed,safeHttps});
})(window);
