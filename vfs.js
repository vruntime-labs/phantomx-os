/**
 * PhantomX shared Virtual File System.
 * Browser-only simulated storage; never reads or writes host files.
 */
(function (global) {
  "use strict";
  const entries=new Map([
    ["/",{type:"dir"}],["/home",{type:"dir"}],["/sys",{type:"dir"}],["/logs",{type:"dir"}],
    ["/home/user_notes.txt",{type:"file",content:"Welcome to PhantomX OS.\nThis is an in-memory example file."}],
    ["/home/project_info.md",{type:"file",content:"# PhantomX OS\nA browser-first desktop and cyberdeck simulation."}],
    ["/sys/kernel.conf",{type:"file",content:"edition=browser\nmode=simulation\nversion=2.3.1"}],
    ["/sys/network.cfg",{type:"file",content:"network=simulated\nexternal_access=disabled"}],
    ["/logs/auth.log",{type:"file",content:"[system] No authentication service is configured."}],
    ["/logs/trace.log",{type:"file",content:"[system] Simulation trace initialized."}]
  ]);
  const listeners=new Set();
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
  function requireCapability(appId,capability) {
    if(!global.PhantomAppRegistry?.hasCapability(appId,capability)) throw new Error("Permission denied: "+appId+" requires "+capability);
  }
  function get(appId,path,currentPath="/") {
    requireCapability(appId,"vfs.read");
    const node=entries.get(normalizePath(path,currentPath));
    return node?Object.freeze({...node}):undefined;
  }
  function list(appId,path="/",currentPath="/") {
    requireCapability(appId,"vfs.read");
    const target=normalizePath(path,currentPath),node=entries.get(target);
    if(!node) throw new Error("No such path: "+target);
    if(node.type!=="dir") throw new Error("Not a directory: "+target);
    const prefix=target==="/"?"/":target+"/";
    return [...entries.entries()].filter(([entry])=>entry!==target&&entry.startsWith(prefix)&&!entry.slice(prefix.length).includes("/"))
      .map(([entry,value])=>Object.freeze({name:entry.split("/").pop(),path:entry,type:value.type,size:value.type==="file"?value.content.length:0}))
      .sort((a,b)=>a.name.localeCompare(b.name));
  }
  function mkdir(appId,path,currentPath="/") {
    requireCapability(appId,"vfs.write");
    const target=normalizePath(path,currentPath);
    if(target==="/"||entries.has(target)) throw new Error("Path already exists: "+target);
    const parent=target.slice(0,target.lastIndexOf("/"))||"/";
    if(entries.get(parent)?.type!=="dir") throw new Error("Parent directory does not exist: "+parent);
    entries.set(target,{type:"dir"});notify("mkdir",target);return target;
  }
  function touch(appId,path,currentPath="/") {
    requireCapability(appId,"vfs.write");
    const target=normalizePath(path,currentPath);
    if(target==="/"||entries.has(target)) throw new Error("Path already exists: "+target);
    const parent=target.slice(0,target.lastIndexOf("/"))||"/";
    if(entries.get(parent)?.type!=="dir") throw new Error("Parent directory does not exist: "+parent);
    entries.set(target,{type:"file",content:""});notify("create",target);return target;
  }
  function writeFile(appId,path,content,options={}) {
    requireCapability(appId,"vfs.write");
    const target=normalizePath(path,options.currentPath||"/");
    if(target==="/") throw new Error("Cannot write to root");
    const parent=target.slice(0,target.lastIndexOf("/"))||"/";
    if(entries.get(parent)?.type!=="dir") throw new Error("Parent directory does not exist: "+parent);
    const existing=entries.get(target);
    if(existing&&existing.type!=="file") throw new Error("Target is a directory: "+target);
    const value=String(content??"");
    entries.set(target,{type:"file",content:options.append&&existing?existing.content+value:value});
    notify(existing?"update":"create",target);return target;
  }
  function readFile(appId,path,currentPath="/") {
    requireCapability(appId,"vfs.read");
    const target=normalizePath(path,currentPath),node=entries.get(target);
    if(!node) throw new Error("No such file: "+target);
    if(node.type!=="file") throw new Error("Is a directory: "+target);
    return node.content;
  }
  function exists(appId,path,currentPath="/") {
    requireCapability(appId,"vfs.read");
    return entries.has(normalizePath(path,currentPath));
  }
  function isDirectory(appId,path,currentPath="/") {
    requireCapability(appId,"vfs.read");
    return entries.get(normalizePath(path,currentPath))?.type==="dir";
  }
  function subscribe(listener) {
    if(typeof listener!=="function") throw new TypeError("VFS subscriber must be a function");
    listeners.add(listener);return ()=>listeners.delete(listener);
  }
  function forApp(appId) {
    if(!global.PhantomAppRegistry?.get(appId)) throw new Error("Unknown PhantomX app: "+appId);
    return Object.freeze({
      normalizePath,
      get:(path,cwd)=>get(appId,path,cwd),
      list:(path,cwd)=>list(appId,path,cwd),
      mkdir:(path,cwd)=>mkdir(appId,path,cwd),
      touch:(path,cwd)=>touch(appId,path,cwd),
      writeFile:(path,value,options)=>writeFile(appId,path,value,options),
      readFile:(path,cwd)=>readFile(appId,path,cwd),
      exists:(path,cwd)=>exists(appId,path,cwd),
      isDirectory:(path,cwd)=>isDirectory(appId,path,cwd),
      subscribe
    });
  }
  global.PhantomVFS=Object.freeze({forApp,subscribe});
})(window);
