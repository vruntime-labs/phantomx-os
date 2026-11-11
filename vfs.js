/**
 * PhantomX shared Virtual File System.
 * Browser-only simulated storage; never reads or writes host files.
 */
(function (global) {
  "use strict";
  const entries = new Map([
    ["/",{type:"dir"}],["/home",{type:"dir"}],["/sys",{type:"dir"}],["/logs",{type:"dir"}],
    ["/home/user_notes.txt",{type:"file",content:"Welcome to PhantomX OS.\nThis is an in-memory example file."}],
    ["/home/project_info.md",{type:"file",content:"# PhantomX OS\nA browser-first desktop and cyberdeck simulation."}],
    ["/sys/kernel.conf",{type:"file",content:"edition=browser\nmode=simulation\nversion=2.3.1"}],
    ["/sys/network.cfg",{type:"file",content:"network=simulated\nexternal_access=disabled"}],
    ["/logs/auth.log",{type:"file",content:"[system] No authentication service is configured."}],
    ["/logs/trace.log",{type:"file",content:"[system] Simulation trace initialized."}]
  ]);
  const listeners = new Set();
  function normalizePath(path,currentPath="/") {
    const value=String(path||".");
    const source=value==="~"?"/home":value.startsWith("~/")?"/home/"+value.slice(2):value;
    const resolved=[];
    for(const part of (source.startsWith("/")?source:currentPath+"/"+source).split("/")) {
      if(!part||part===".") continue;
      if(part==="..") resolved.pop(); else resolved.push(part);
    }
    return "/"+resolved.join("/");
  }
  function notify(type,path) {
    const event=Object.freeze({type,path,timestamp:Date.now()});
    listeners.forEach((listener)=>{try{listener(event);}catch(error){console.error("PhantomX VFS listener error:",error);}});
  }
  function get(path,currentPath="/"){return entries.get(normalizePath(path,currentPath));}
  function list(path="/",currentPath="/") {
    const target=normalizePath(path,currentPath), node=entries.get(target);
    if(!node) throw new Error("No such path: "+target);
    if(node.type!=="dir") throw new Error("Not a directory: "+target);
    const prefix=target==="/"?"/":target+"/";
    return [...entries.entries()].filter(([entry])=>entry!==target&&entry.startsWith(prefix)&&!entry.slice(prefix.length).includes("/"))
      .map(([entry,value])=>Object.freeze({name:entry.split("/").pop(),path:entry,type:value.type,size:value.type==="file"?value.content.length:0}))
      .sort((a,b)=>a.name.localeCompare(b.name));
  }
  function mkdir(path,currentPath="/") {
    const target=normalizePath(path,currentPath);
    if(target==="/"||entries.has(target)) throw new Error("Path already exists: "+target);
    const parent=target.slice(0,target.lastIndexOf("/"))||"/";
    if(entries.get(parent)?.type!=="dir") throw new Error("Parent directory does not exist: "+parent);
    entries.set(target,{type:"dir"}); notify("mkdir",target); return target;
  }
  function touch(path,currentPath="/") {
    const target=normalizePath(path,currentPath);
    if(target==="/"||entries.has(target)) throw new Error("Path already exists: "+target);
    const parent=target.slice(0,target.lastIndexOf("/"))||"/";
    if(entries.get(parent)?.type!=="dir") throw new Error("Parent directory does not exist: "+parent);
    entries.set(target,{type:"file",content:""}); notify("create",target); return target;
  }
  function writeFile(path,content,options={}) {
    const target=normalizePath(path,options.currentPath||"/");
    if(target==="/") throw new Error("Cannot write to root");
    const parent=target.slice(0,target.lastIndexOf("/"))||"/";
    if(entries.get(parent)?.type!=="dir") throw new Error("Parent directory does not exist: "+parent);
    const existing=entries.get(target);
    if(existing&&existing.type!=="file") throw new Error("Target is a directory: "+target);
    const value=String(content??"");
    entries.set(target,{type:"file",content:options.append&&existing?existing.content+value:value});
    notify(existing?"update":"create",target); return target;
  }
  function readFile(path,currentPath="/") {
    const target=normalizePath(path,currentPath), node=entries.get(target);
    if(!node) throw new Error("No such file: "+target);
    if(node.type!=="file") throw new Error("Is a directory: "+target);
    return node.content;
  }
  function exists(path,currentPath="/"){return entries.has(normalizePath(path,currentPath));}
  function isDirectory(path,currentPath="/"){return entries.get(normalizePath(path,currentPath))?.type==="dir";}
  function subscribe(listener) {
    if(typeof listener!=="function") throw new TypeError("VFS subscriber must be a function");
    listeners.add(listener); return ()=>listeners.delete(listener);
  }
  global.PhantomVFS=Object.freeze({normalizePath,get,list,mkdir,touch,writeFile,readFile,exists,isDirectory,subscribe});
})(window);
