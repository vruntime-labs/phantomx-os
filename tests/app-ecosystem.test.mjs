import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function loadAppRuntime() {
  const opened=[];
  const window={
    PhantomKernel:{
      getWindow(id){return ["terminal-window","vfs-explorer-window","cyberpad-window","netbrowser-window","deck-settings-window","netradar-window","packetsniffer-window","hashbreaker-window","hexscope-window","opencam-window"].includes(id)?{id}:null;},
      openWindow(id){opened.push(id);return ["terminal-window","vfs-explorer-window","cyberpad-window","netbrowser-window","deck-settings-window","netradar-window","packetsniffer-window","hashbreaker-window","hexscope-window","opencam-window"].includes(id);}
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
  assert.equal(window.PhantomAppRegistry.get("phantom.cyberpad").status,"available");
  assert.equal(window.PhantomAppRegistry.get("phantom.netbrowser").status,"available");
  assert.equal(window.PhantomAppRegistry.get("phantom.deck-settings").status,"available");
  for (const id of ["phantom.netradar","phantom.packetsniffer","phantom.hashbreaker","phantom.hexscope","phantom.opencam"]) {
    assert.equal(window.PhantomAppRegistry.get(id).status,"available");
  }
  assert.equal(window.PhantomAppRegistry.get("phantom.mission-control").status,"planned");
});

test("registry launches only apps with an available registered window",()=>{
  const {window,opened}=loadAppRuntime();
  assert.equal(window.PhantomAppRegistry.launch("phantom.term").ok,true);
  assert.equal(window.PhantomAppRegistry.launch("phantom.vfs-explorer").ok,true);
  assert.equal(window.PhantomAppRegistry.launch("phantom.cyberpad").ok,true);
  assert.equal(window.PhantomAppRegistry.launch("phantom.netbrowser").ok,true);
  assert.equal(window.PhantomAppRegistry.launch("phantom.deck-settings").ok,true);
  for (const id of ["phantom.netradar","phantom.packetsniffer","phantom.hashbreaker","phantom.hexscope","phantom.opencam"]) {
    assert.equal(window.PhantomAppRegistry.launch(id).ok,true);
  }
  assert.equal(window.PhantomAppRegistry.launch("missing.app").reason,"unknown-app");
  assert.deepEqual(opened,["terminal-window","vfs-explorer-window","cyberpad-window","netbrowser-window","deck-settings-window","netradar-window","packetsniffer-window","hashbreaker-window","hexscope-window","opencam-window"]);
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

test("desktop shortcuts remain valid HTML text nodes, not escaped newline literals",()=>{
  const html=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
  assert.equal(html.includes("\\n          <button class=\"desktop-shortcut\""),false);
  for(const id of ["cyberpad-window","netbrowser-window","deck-settings-window","netradar-window","packetsniffer-window","hashbreaker-window","hexscope-window","opencam-window"]) {
    assert.ok(html.includes('id="'+id+'"'),"missing window "+id);
  }
});
