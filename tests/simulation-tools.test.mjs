import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

function loadFixtures() {
  const window={};
  vm.runInNewContext(fs.readFileSync(new URL("../apps/simulation-data.js",import.meta.url),"utf8"),{window,URL});
  return window;
}

test("simulation topology uses fictional private-address fixtures",()=>{
  const {PhantomSimulationData:data}=loadFixtures();
  assert.equal(data.nodes.length,4);
  assert.equal(data.edges.length,4);
  assert.ok(data.nodes.every((node)=>/^10\.24\.0\.\d+$/.test(node.ip)));
  assert.ok(data.packets.every((packet)=>packet.source.startsWith("10.24.0.")&&packet.destination.startsWith("10.24.0.")));
});

test("hash exercise is a SHA-256 candidate check, not a decryptor",()=>{
  const {PhantomSimulationData:data}=loadFixtures();
  assert.equal(data.hashChallenge.algorithm,"SHA-256");
  assert.equal(data.hashChallenge.expectedCandidate,"phantom-lab");
  assert.match(data.hashChallenge.target,/^[a-f0-9]{64}$/);
});

test("OpenCam policy accepts only free, recent, embeddable public preview records with HTTPS attribution",()=>{
  const {PhantomOpenCamPolicy:policy}=loadFixtures();
  const feed={
    is_free:true,live:true,category:"traffic",
    view:{render:"image",url_type:"image",url:"https://api.openeye.cam/v1/streams/example/preview.webp"},
    redistribution:{preview_embed:true,attribution:{name:"Public Transport Agency",url:"https://agency.example/cameras",required:true}}
  };
  assert.equal(policy.isEmbeddableFreeFeed(feed),true);
  assert.equal(policy.isEmbeddableFreeFeed({...feed,is_free:false}),false);
  assert.equal(policy.isEmbeddableFreeFeed({...feed,live:false}),false);
  assert.equal(policy.isEmbeddableFreeFeed({...feed,category:"city"}),false);
  assert.equal(policy.isEmbeddableFreeFeed({...feed,redistribution:{...feed.redistribution,preview_embed:false}}),false);
  assert.equal(policy.isEmbeddableFreeFeed({...feed,view:{...feed.view,url:"http://insecure.example/image.jpg"}}),false);
  assert.equal(policy.isEmbeddableFreeFeed({...feed,redistribution:{preview_embed:true,attribution:{name:"No link",url:"javascript:alert(1)"}}}),false);
});
