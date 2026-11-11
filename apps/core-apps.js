/**
 * PhantomX Tier 1 core applications.
 * NetBrowser keeps mission intranet routes local and embeds user-requested public websites directly.
 */
(function (global) {
  "use strict";

  const kernel = global.PhantomKernel;
  const registry = global.PhantomAppRegistry;
  const byId = (id) => document.getElementById(id);

  // CyberPad: editor for files in the shared simulated VFS.
  const padFs = global.PhantomVFS.forApp("phantom.cyberpad");
  const padPath = byId("cyberpad-path");
  const padEditor = byId("cyberpad-editor");
  const padStatus = byId("cyberpad-status");
  const padLoad = byId("cyberpad-load");
  const padSave = byId("cyberpad-save");
  const defaultNote = "/home/mission-notes.md";
  if (!padFs.exists(defaultNote)) {
    padFs.writeFile(defaultNote, "# Mission notes\n\nUse this space for fictional mission observations.\n");
  }
  function loadPadFile() {
    const path = padFs.normalizePath(padPath.value || defaultNote, "/home");
    try {
      const content = padFs.readFile(path);
      padPath.value = path;
      padEditor.value = content;
      padStatus.textContent = "LOADED " + path;
    } catch (error) {
      padStatus.textContent = error.message.toUpperCase();
    }
  }
  padLoad?.addEventListener("click", loadPadFile);
  padSave?.addEventListener("click", () => {
    const path = padFs.normalizePath(padPath.value || defaultNote, "/home");
    try {
      padFs.writeFile(path, padEditor.value);
      padPath.value = path;
      padStatus.textContent = "SAVED TO VIRTUAL FILESYSTEM";
    } catch (error) {
      padStatus.textContent = error.message.toUpperCase();
    }
  });
  loadPadFile();

  // NetBrowser: fictional intranet plus direct, user-initiated public web navigation.
  const sites = {
    "intranet.phantom": {
      title: "Phantom Research Network",
      subtitle: "INTERNAL KNOWLEDGE PORTAL · SIMULATED",
      sections: [
        ["Welcome", "This fictional intranet is part of the PhantomX training environment."],
        ["Network bulletin", "Maintenance window scheduled for 23:00 local simulation time."],
        ["Available systems", "Research Wiki · Operations Board · Archive Terminal"]
      ],
      links: [{label:"Research Wiki",route:"wiki.phantom/"},{label:"Operations Board",route:"ops.phantom/"}]
    },
    "wiki.phantom": {
      title: "Research Wiki",
      subtitle: "DOCUMENTATION NODE · SIMULATED",
      sections: [
        ["Project Aster", "A fictional research program used to demonstrate evidence collection and mission reasoning."],
        ["Topology notes", "Gateway: 10.24.0.1 · Lab node: 10.24.0.18 · Archive: 10.24.0.42. These addresses exist only in this story."],
        ["Analyst reminder", "Treat all hostnames, addresses and records in this browser as fictional challenge data."]
      ],
      links: [{label:"Operations Board",route:"ops.phantom/"},{label:"Intranet home",route:"intranet.phantom/"}]
    },
    "ops.phantom": {
      title: "Operations Board",
      subtitle: "MISSION OPERATIONS · SIMULATED",
      sections: [
        ["Current notice", "A maintenance record was modified shortly before the scheduled outage."],
        ["Objective", "Compare the maintenance notice with the archived change log. Do not interact with real systems."],
        ["Contact", "Handler channel: ShadowComms (planned)."]
      ],
      links: [{label:"Research Wiki",route:"wiki.phantom/"},{label:"Intranet home",route:"intranet.phantom/"}]
    }
  };
  const address = byId("netbrowser-address");
  const page = byId("netbrowser-page");
  const browserStatus = byId("netbrowser-status");
  const frameWrap = byId("netbrowser-frame-wrap");
  const frame = byId("netbrowser-frame");
  const routeButtons = document.querySelectorAll("[data-netbrowser-route]");
  const browserHistory = [];
  let browserHistoryIndex = -1;
  let currentExternalUrl = "";

  function normalizeRoute(value) {
    let route = String(value || "intranet.phantom/").trim().toLowerCase();
    route = route.replace(/^https?:\/\//, "").split(/[?#]/)[0];
    route = route.replace(/\/+$/, "");
    return route || "intranet.phantom";
  }
  function showLocalSite(route, site) {
    currentExternalUrl = "";
    browserHistory.length = 0;
    browserHistoryIndex = -1;
    frame.src = "about:blank";
    frameWrap.hidden = true;
    page.hidden = false;
    address.value = route + "/";
    browserStatus.textContent = "LOCAL SIMULATION · " + route.toUpperCase();
    page.replaceChildren();
    const heading = document.createElement("div");
    heading.className = "netbrowser-page-heading";
    const title = document.createElement("h2");
    title.textContent = site.title;
    const subtitle = document.createElement("p");
    subtitle.textContent = site.subtitle;
    heading.append(title, subtitle);
    page.appendChild(heading);
    site.sections.forEach(([label, copy]) => {
      const section = document.createElement("section");
      section.className = "netbrowser-card";
      const h3 = document.createElement("h3");
      h3.textContent = label;
      const p = document.createElement("p");
      p.textContent = copy;
      section.append(h3, p);
      page.appendChild(section);
    });
    const nav = document.createElement("nav");
    nav.className = "netbrowser-local-links";
    nav.setAttribute("aria-label", "Fictional intranet links");
    site.links.forEach((link) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = link.label;
      button.dataset.netbrowserRoute = link.route;
      nav.appendChild(button);
    });
    page.appendChild(nav);
  }
  function loadExternalSite(value, addHistory = true) {
    let url;
    try {
      url = global.PhantomBrowserUtils.normalizeWebUrl(value);
    } catch (error) {
      browserStatus.textContent = "INVALID ADDRESS";
      page.hidden = false;
      frameWrap.hidden = true;
      page.replaceChildren();
      const notice = document.createElement("div");
      notice.className = "netbrowser-notice";
      notice.textContent = error.message;
      page.appendChild(notice);
      return false;
    }
    if (addHistory) {
      browserHistory.splice(browserHistoryIndex + 1);
      browserHistory.push(url);
      browserHistoryIndex = browserHistory.length - 1;
    }
    currentExternalUrl = url;
    address.value = url;
    page.hidden = true;
    frameWrap.hidden = false;
    browserStatus.textContent = "EXTERNAL WEBSITE · LOADING " + new URL(url).hostname.toUpperCase();
    frame.src = url;
    return true;
  }
  function navigate(value, addHistory = true) {
    const raw = String(value || "").trim();
    const route = normalizeRoute(raw);
    const site = sites[route];
    if (site) {
      showLocalSite(route, site);
      return true;
    }
    return loadExternalSite(raw, addHistory);
  }

  byId("netbrowser-go")?.addEventListener("click", () => navigate(address.value));
  address?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") navigate(address.value);
  });
  routeButtons.forEach((button) => button.addEventListener("click", () => navigate(button.dataset.netbrowserRoute)));
  page?.addEventListener("click", (event) => {
    const link = event.target.closest("[data-netbrowser-route]");
    if (link) navigate(link.dataset.netbrowserRoute);
  });
  byId("netbrowser-back")?.addEventListener("click", () => {
    if (browserHistoryIndex <= 0) return;
    browserHistoryIndex -= 1;
    loadExternalSite(browserHistory[browserHistoryIndex], false);
  });
  byId("netbrowser-forward")?.addEventListener("click", () => {
    if (browserHistoryIndex >= browserHistory.length - 1) return;
    browserHistoryIndex += 1;
    loadExternalSite(browserHistory[browserHistoryIndex], false);
  });
  byId("netbrowser-reload")?.addEventListener("click", () => {
    if (currentExternalUrl) frame.src = currentExternalUrl;
  });
  byId("netbrowser-open-external")?.addEventListener("click", () => {
    if (currentExternalUrl) global.open(currentExternalUrl, "_blank", "noopener,noreferrer");
  });
  frame?.addEventListener("load", () => {
    if (currentExternalUrl) browserStatus.textContent = "FRAME REQUEST COMPLETED · THE WEBSITE MAY STILL BLOCK EMBEDDING";
  });
  navigate("intranet.phantom/");

  global.PhantomCoreApps = Object.freeze({
    open(appId) {
      const app = registry.get(appId);
      if (!app || app.status !== "available") return {ok:false, reason:"not-implemented"};
      return registry.launch(appId);
    },
    navigateIntranet: navigate
  });
})(window);
