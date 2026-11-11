/**
 * PhantomX simulation suite.
 * Every network, packet, hash exercise and forensic record is fictional.
 * OpenCam reads only free public previews whose per-camera embed permission and
 * attribution are explicitly supplied by the public catalogue.
 */
(function (global) {
  "use strict";
  const data = global.PhantomSimulationData;
  const byId = (id) => document.getElementById(id);

  // NetRadar: static fictional topology rendered as SVG.
  const radar = byId("netradar-map");
  const radarInfo = byId("netradar-details");
  const ns = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs || {}).forEach(([key,value]) => el.setAttribute(key,String(value)));
    return el;
  }
  function renderRadar() {
    if (!radar) return;
    radar.replaceChildren();
    data.edges.forEach(([from,to]) => {
      const a=data.nodes.find((n)=>n.id===from), b=data.nodes.find((n)=>n.id===to);
      radar.appendChild(svg("line",{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:"radar-edge"}));
    });
    data.nodes.forEach((node) => {
      const group=svg("g",{class:"radar-node", "data-node-id":node.id,tabindex:"0",role:"button","aria-label":node.label});
      group.appendChild(svg("circle",{cx:node.x,cy:node.y,r:25,class:"radar-node-ring"}));
      group.appendChild(svg("circle",{cx:node.x,cy:node.y,r:5,class:"radar-node-core"}));
      const label=svg("text",{x:node.x,y:node.y+42,"text-anchor":"middle",class:"radar-node-label"});
      label.textContent=node.label;
      group.appendChild(label);
      const ip=svg("text",{x:node.x,y:node.y+55,"text-anchor":"middle",class:"radar-node-ip"});
      ip.textContent=node.ip;
      group.appendChild(ip);
      radar.appendChild(group);
    });
  }
  function selectRadarNode(id) {
    const node=data.nodes.find((item)=>item.id===id);
    if(!node||!radarInfo) return;
    radar.querySelectorAll(".radar-node").forEach((item)=>item.classList.toggle("is-selected",item.dataset.nodeId===id));
    radarInfo.replaceChildren();
    const title=document.createElement("strong"); title.textContent=node.label;
    const meta=document.createElement("span"); meta.textContent=node.role+" · "+node.ip;
    const detail=document.createElement("p"); detail.textContent=node.detail;
    const ports=document.createElement("div"); ports.className="radar-ports";
    node.ports.forEach((port)=>{
      const item=document.createElement("span");
      item.textContent=port.port+"/"+port.service+" · "+port.state.toUpperCase();
      item.className="radar-port "+port.state;
      ports.appendChild(item);
    });
    radarInfo.append(title,meta,detail,ports);
  }
  radar?.addEventListener("click",(event)=>{
    const node=event.target.closest("[data-node-id]");
    if(node) selectRadarNode(node.dataset.nodeId);
  });
  radar?.addEventListener("keydown",(event)=>{
    if(event.key!=="Enter"&&event.key!==" ") return;
    const node=event.target.closest("[data-node-id]");
    if(node){event.preventDefault();selectRadarNode(node.dataset.nodeId);}
  });
  renderRadar();
  selectRadarNode("gateway");

  // PacketSniffer: inspect and replay only local synthetic request fixtures.
  const packetList=byId("packet-list");
  const packetDetail=byId("packet-detail");
  const packetEditor=byId("packet-editor");
  const packetStatus=byId("packet-status");
  let selectedPacket=data.packets[0];
  function showPacket(packet) {
    selectedPacket=packet;
    packetList?.querySelectorAll("[data-packet-id]").forEach((row)=>row.classList.toggle("is-selected",row.dataset.packetId===packet.id));
    packetDetail.textContent=JSON.stringify({id:packet.id,time:packet.time,source:packet.source,destination:packet.destination,protocol:packet.protocol,method:packet.method,path:packet.path,status:packet.status,response:packet.response},null,2);
    packetEditor.value=JSON.stringify(packet.request,null,2);
    packetStatus.textContent="SYNTHETIC CAPTURE · "+packet.id;
  }
  if(packetList) {
    packetList.replaceChildren();
    data.packets.forEach((packet)=>{
      const row=document.createElement("button");
      row.type="button"; row.className="packet-row"; row.dataset.packetId=packet.id;
      [packet.time,packet.source,packet.destination,packet.method+" "+packet.path,String(packet.status)].forEach((value)=>{
        const cell=document.createElement("span"); cell.textContent=value; row.appendChild(cell);
      });
      packetList.appendChild(row);
    });
    packetList.addEventListener("click",(event)=>{
      const row=event.target.closest("[data-packet-id]");
      if(row){const packet=data.packets.find((item)=>item.id===row.dataset.packetId);if(packet)showPacket(packet);}
    });
    showPacket(selectedPacket);
  }
  byId("packet-replay")?.addEventListener("click",()=>{
    try {
      const parsed=JSON.parse(packetEditor.value);
      packetStatus.textContent="SANDBOX REPLAY COMPLETE · NO NETWORK REQUEST SENT";
      packetDetail.textContent=JSON.stringify({
        id:"SIM-"+selectedPacket.id,
        result:"synthetic-response",
        accepted:true,
        echoed_request:parsed,
        note:"This replay changed only the local simulation panel."
      },null,2);
    } catch {
      packetStatus.textContent="INVALID JSON · REQUEST NOT REPLAYED";
    }
  });

  // HashBreaker: reversible classroom ciphers and one-candidate SHA-256 checks.
  const hashInput=byId("hash-input");
  const hashOutput=byId("hash-output");
  const hashStatus=byId("hash-status");
  function encodeBase64(value) {
    const bytes=new TextEncoder().encode(value);
    let binary="";
    bytes.forEach((byte)=>binary+=String.fromCharCode(byte));
    return btoa(binary);
  }
  function decodeBase64(value) {
    const binary=atob(value.trim());
    const bytes=Uint8Array.from(binary,(char)=>char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  function caesar(value,shift) {
    const n=((Number(shift)||0)%26+26)%26;
    return value.replace(/[a-z]/gi,(char)=>{
      const base=char<="Z"?65:97;
      return String.fromCharCode((char.charCodeAt(0)-base+n+26)%26+base);
    });
  }
  byId("hash-b64-encode")?.addEventListener("click",()=>{
    try{hashOutput.value=encodeBase64(hashInput.value);hashStatus.textContent="BASE64 ENCODED · REVERSIBLE";}
    catch(error){hashStatus.textContent="ENCODING FAILED";}
  });
  byId("hash-b64-decode")?.addEventListener("click",()=>{
    try{hashOutput.value=decodeBase64(hashInput.value);hashStatus.textContent="BASE64 DECODED · REVERSIBLE";}
    catch(error){hashStatus.textContent="INVALID BASE64 INPUT";}
  });
  byId("hash-caesar-encode")?.addEventListener("click",()=>{
    hashOutput.value=caesar(hashInput.value,byId("hash-shift").value);
    hashStatus.textContent="CAESAR SHIFT APPLIED · REVERSIBLE";
  });
  byId("hash-caesar-decode")?.addEventListener("click",()=>{
    hashOutput.value=caesar(hashInput.value,-Number(byId("hash-shift").value||0));
    hashStatus.textContent="CAESAR SHIFT REVERSED · REVERSIBLE";
  });
  byId("hash-verify")?.addEventListener("click",async()=>{
    if(!global.crypto?.subtle){hashStatus.textContent="WEB CRYPTO UNAVAILABLE IN THIS CONTEXT";return;}
    const bytes=new TextEncoder().encode(hashInput.value);
    const digest=await global.crypto.subtle.digest("SHA-256",bytes);
    const hex=Array.from(new Uint8Array(digest),(byte)=>byte.toString(16).padStart(2,"0")).join("");
    const expected=data.hashChallenge.target;
    hashOutput.value=hex;
    hashStatus.textContent=hex===expected?"CANDIDATE MATCHES THE SHA-256 DIGEST":"NO MATCH · ONE CANDIDATE CHECKED";
  });
  byId("hash-load-challenge")?.addEventListener("click",()=>{
    byId("hash-target").textContent=data.hashChallenge.target;
    byId("hash-hint").textContent=data.hashChallenge.hint;
    hashInput.value="";
    hashOutput.value="";
    hashStatus.textContent="CHALLENGE READY · ENTER ONE CANDIDATE";
  });
  byId("hash-target").textContent=data.hashChallenge.target;
  byId("hash-hint").textContent=data.hashChallenge.hint;

  // HexScope: read-only inspection of existing virtual log files.
  const forensicFs=global.PhantomVFS.forApp("phantom.hexscope");
  const forensicFile=byId("hexscope-file");
  const forensicSearch=byId("hexscope-search");
  const forensicText=byId("hexscope-text");
  const forensicHex=byId("hexscope-hex");
  const forensicStatus=byId("hexscope-status");
  function renderForensics() {
    const path=forensicFile.value;
    try {
      const content=forensicFs.readFile(path);
      const query=forensicSearch.value.trim().toLowerCase();
      const lines=content.split("\n").map((line,index)=>({line,index})).filter((item)=>!query||item.line.toLowerCase().includes(query));
      forensicText.textContent=lines.map((item)=>String(item.index+1).padStart(3,"0")+"  "+item.line).join("\n")||"No matching lines.";
      const bytes=new TextEncoder().encode(content).slice(0,256);
      forensicHex.textContent=Array.from(bytes,(byte)=>byte.toString(16).padStart(2,"0")).join(" ");
      forensicStatus.textContent=lines.length+" MATCHING LINES · READ ONLY";
    } catch(error) {
      forensicText.textContent=error.message;
      forensicHex.textContent="";
      forensicStatus.textContent="FILE UNAVAILABLE";
    }
  }
  forensicFile?.addEventListener("change",renderForensics);
  forensicSearch?.addEventListener("input",renderForensics);
  renderForensics();

  // OpenCam: one user-initiated, anonymous request to the public featured catalog.
  const cameraEndpoint="https://api.openeye.cam/v1/catalog/featured";
  const cameraGrid=byId("opencam-grid");
  const cameraStatus=byId("opencam-status");
  const cameraCategory=byId("opencam-category");
  const cameraLoad=byId("opencam-load");
  let cameraItems=[];
  function safeExternalUrl(value) {
    try { const url=new URL(value); return url.protocol==="https:"?url.href:null; } catch { return null; }
  }
  function freshness(feed) {
    if(Number.isFinite(feed.last_frame_age_s)) {
      const seconds=Math.max(0,Math.floor(feed.last_frame_age_s));
      if(seconds<60)return "Updated "+seconds+"s ago";
      if(seconds<3600)return "Updated "+Math.floor(seconds/60)+"m ago";
      if(seconds<86400)return "Updated "+Math.floor(seconds/3600)+"h ago";
      return "Last image "+Math.floor(seconds/86400)+"d ago";
    }
    if(Number.isFinite(feed.frame_ts)) return "Captured "+new Date(feed.frame_ts).toLocaleString();
    return "Capture time not supplied";
  }
  function renderCameras() {
    if(!cameraGrid)return;
    cameraGrid.replaceChildren();
    const category=cameraCategory.value;
    const items=cameraItems.filter((feed)=>category==="all"||feed.category===category);
    if(!items.length) {
      const empty=document.createElement("p");
      empty.className="simulation-empty";
      empty.textContent="No currently embeddable free public previews in this category. Try another category or reload the public catalog.";
      cameraGrid.appendChild(empty);
      return;
    }
    items.forEach((feed)=>{
      const credit=feed.redistribution.attribution;
      const card=document.createElement("article");card.className="opencam-card";
      const image=document.createElement("img");
      image.loading="lazy";image.alt=feed.title+" public camera preview";
      image.src=feed.view.url;
      image.addEventListener("error",()=>{image.removeAttribute("src");image.alt="Public camera preview unavailable";card.classList.add("is-unavailable");});
      const media=document.createElement("div");media.className="opencam-media";media.appendChild(image);
      const body=document.createElement("div");body.className="opencam-card-body";
      const meta=document.createElement("div");meta.className="opencam-meta";
      const kind=document.createElement("span");kind.textContent=String(feed.category||"public").toUpperCase();
      const state=document.createElement("span");state.textContent=feed.live===true?"RECENT IMAGE":"STALE";
      meta.append(kind,state);
      const title=document.createElement("h3");title.textContent=feed.title||"Public camera";
      const updated=document.createElement("p");updated.textContent=freshness(feed);
      const attribution=document.createElement("a");attribution.textContent=credit.name;attribution.href=safeExternalUrl(credit.url);
      attribution.target="_blank";attribution.rel="noopener noreferrer";attribution.className="opencam-credit";
      body.append(meta,title,updated,attribution);card.append(media,body);cameraGrid.appendChild(card);
    });
  }
  async function loadCameras() {
    cameraLoad.disabled=true;cameraStatus.textContent="CONNECTING TO PUBLIC CAMERA CATALOG…";
    try {
      const response=await fetch(cameraEndpoint,{headers:{Accept:"application/json"}});
      if(!response.ok)throw new Error("Catalog returned HTTP "+response.status);
      const payload=await response.json();
      const items=Array.isArray(payload.items)?payload.items:[];
      cameraItems=items.filter((feed)=>global.PhantomOpenCamPolicy.isEmbeddableFreeFeed(feed));
      cameraStatus.textContent=cameraItems.length+" FREE PUBLIC PREVIEWS APPROVED FOR EMBEDDING · OPEN EYE CATALOG";
      renderCameras();
    } catch(error) {
      cameraItems=[];
      cameraGrid.replaceChildren();
      const message=document.createElement("p");message.className="simulation-empty";
      message.textContent="The public camera catalog could not be reached. No camera URLs are discovered or guessed. Try again later.";
      cameraGrid.appendChild(message);
      cameraStatus.textContent="PUBLIC CATALOG UNAVAILABLE · "+error.message.toUpperCase();
    } finally { cameraLoad.disabled=false; }
  }
  cameraLoad?.addEventListener("click",loadCameras);
  cameraCategory?.addEventListener("change",renderCameras);
  byId("opencam-open-catalog")?.addEventListener("click",()=>global.open("https://openeye.cam/","_blank","noopener,noreferrer"));

  // OpenCCTV: load only camera pages from the public OpenCCTV directory.
  const cameraPageInput=byId("opencam-video-url");
  const cameraPlayer=byId("opencam-player");
  const cameraPlayerEmpty=byId("opencam-player-empty");
  const cameraPlayerStatus=byId("opencam-status");
  let currentOpenCctvUrl="";
  function loadOpenCctvPage(value) {
    const url=global.PhantomBrowserUtils.normalizeWebUrl(value);
    if(!global.PhantomBrowserUtils.isOpenCctvUrl(url)) {
      throw new Error("Use an OpenCCTV.org public directory or camera page URL.");
    }
    currentOpenCctvUrl=url;
    cameraPageInput.value=url;
    cameraPlayer.hidden=false;
    cameraPlayerEmpty.hidden=true;
    cameraPlayer.src=url;
    cameraPlayerStatus.textContent="OPEN CCTV PAGE LOADING · " + new URL(url).pathname.toUpperCase();
  }
  byId("opencam-load-video")?.addEventListener("click",()=>{
    try { loadOpenCctvPage(cameraPageInput.value); }
    catch(error) { cameraPlayerStatus.textContent=error.message.toUpperCase(); }
  });
  cameraPageInput?.addEventListener("keydown",(event)=>{
    if(event.key==="Enter") {
      event.preventDefault();
      byId("opencam-load-video")?.click();
    }
  });
  byId("opencam-load-directory")?.addEventListener("click",()=>{
    try { loadOpenCctvPage("https://opencctv.org/open-cameras"); }
    catch(error) { cameraPlayerStatus.textContent=error.message.toUpperCase(); }
  });
  byId("opencam-open-video-tab")?.addEventListener("click",()=>{
    if(currentOpenCctvUrl) global.open(currentOpenCctvUrl,"_blank","noopener,noreferrer");
    else global.open("https://opencctv.org/open-cameras","_blank","noopener,noreferrer");
  });
  cameraPlayer?.addEventListener("load",()=>{
    if(currentOpenCctvUrl) cameraPlayerStatus.textContent="CAMERA PAGE REQUEST COMPLETED · VIDEO OR IMAGE AVAILABILITY IS CONTROLLED BY THE SOURCE";
  });

  global.PhantomSimulationTools = Object.freeze({selectRadarNode,loadCameras});
})(window);
