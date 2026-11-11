import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function loadAppRuntime() {
  const opened=[];
  const window={
    PhantomKernel:{
      getWindow(id){return id==="terminal-window"||id==="vfs-explorer-window"?{id}:null;},
      openWindow(id){opened.push(id);return id==="terminal-window"||id==="vfs-explorer-window";}
    }
  };
  const context={window,console};
  for(const path of ["../apps/app-manifests.js","../app-registry.js","../vfs.js"]) {
    vm.runInNewContext(fs.readFileSync(new URL(path,import.meta.url),"utf8"),context);
  }
  return {window,opened};
}

test("catalog registers the complete requested app ecosystem",()=>{
  const {window}=loadAppRuntime();
  assert.equal(window.PhantomAppRegistry.list().length,13);
  assert.equal(window.PhantomAppRegistry.get("phantom.term").status,"available");
  assert.equal(window.PhantomAppRegistry.get("phantom.vfs-explorer").status,"available");
  assert.equal(window.PhantomAppRegistry.get("phantom.opencam").status,"planned");
});

test("registry launches only apps with an available registered window",()=>{
  const {window,opened}=loadAppRuntime();
  assert.equal(window.PhantomAppRegistry.launch("phantom.term").ok,true);
  assert.equal(window.PhantomAppRegistry.launch("phantom.vfs-explorer").ok,true);
  assert.equal(window.PhantomAppRegistry.launch("phantom.cyberpad").reason,"not-implemented");
  assert.equal(window.PhantomAppRegistry.launch("missing.app").reason,"unknown-app");
  assert.deepEqual(opened,["terminal-window","vfs-explorer-window"]);
});

test("Terminal and VFS Explorer share the same virtual files",()=>{
  const {window}=loadAppRuntime();
  const terminal=window.PhantomVFS.forApp("phantom.term");
  const explorer=window.PhantomVFS.forApp("phantom.vfs-explorer");
  terminal.mkdir("/home/shared");
  terminal.writeFile("/home/shared/mission.txt","mission data");
  assert.equal(explorer.readFile("/home/shared/mission.txt"),"mission data");
  explorer.writeFile("/home/shared/mission.txt","updated by explorer");
  assert.equal(terminal.readFile("/home/shared/mission.txt"),"updated by explorer");
  assert.equal(explorer.list("/home/shared")[0].name,"mission.txt");
});

test("VFS denies capabilities not declared by the calling app",()=>{
  const {window}=loadAppRuntime();
  const browser=window.PhantomVFS.forApp("phantom.netbrowser");
  assert.throws(()=>browser.list("/"),/Permission denied/);
  assert.throws(()=>browser.writeFile("/home/blocked.txt","nope"),/Permission denied/);
  const camera=window.PhantomVFS.forApp("phantom.opencam");
  assert.throws(()=>camera.list("/"),/Permission denied/);
});

test("VFS normalizes relative paths and rejects missing parent directories",()=>{
  const {window}=loadAppRuntime();
  const terminal=window.PhantomVFS.forApp("phantom.term");
  assert.equal(terminal.normalizePath("../logs/trace.log","/home"),"/logs/trace.log");
  assert.throws(()=>terminal.touch("/missing/file.txt"),/Parent directory does not exist/);
});
