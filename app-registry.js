/**
 * App registry for the PhantomX browser desktop.
 * Each service checks the app's declared capabilities at its boundary.
 */
(function (global) {
  "use strict";
  const catalog=global.PhantomAppManifests;
  if(!catalog) throw new Error("Load app-manifests.js before app-registry.js");
  const apps=new Map(catalog.apps.map((app)=>[app.id,app]));
  function get(id){return apps.get(id)||null;}
  function list(options={}){return catalog.apps.filter((app)=>!options.tier||app.tier===options.tier);}
  function hasCapability(appId,capability) {
    const app=get(appId);
    return Boolean(app&&app.status===catalog.APP_STATUS.AVAILABLE&&app.permissions.includes(capability));
  }
  function launch(appId) {
    const app=get(appId);
    if(!app) return {ok:false,reason:"unknown-app"};
    if(app.status!==catalog.APP_STATUS.AVAILABLE) return {ok:false,reason:"not-implemented",app};
    if(!app.legacyWindowId||!global.PhantomKernel?.getWindow(app.legacyWindowId)) return {ok:false,reason:"window-not-registered",app};
    const opened=global.PhantomKernel.openWindow(app.legacyWindowId);
    return {ok:Boolean(opened),reason:opened?"launched":"window-unavailable",app};
  }
  function launchByWindowId(windowId) {
    const app=catalog.apps.find((item)=>item.legacyWindowId===windowId);
    return app?launch(app.id):{ok:Boolean(global.PhantomKernel?.openWindow(windowId)),reason:"legacy-window"};
  }
  global.PhantomAppRegistry=Object.freeze({get,list,launch,launchByWindowId,hasCapability});
})(window);
