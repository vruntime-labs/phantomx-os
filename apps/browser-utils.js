(function (global) {
  "use strict";

  function normalizeWebUrl(value) {
    const raw = String(value || "").trim();
    if (!raw) throw new Error("Enter a website address.");
    const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : "https://" + raw;
    let url;
    try { url = new URL(candidate); } catch { throw new Error("Enter a valid website address."); }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Only HTTP and HTTPS websites are supported.");
    }
    if (!url.hostname || url.username || url.password) {
      throw new Error("This website address is not allowed.");
    }
    return url.href;
  }

  function isOpenCctvUrl(value) {
    try {
      const url = new URL(normalizeWebUrl(value));
      const trustedHost = url.hostname === "opencctv.org" || url.hostname === "www.opencctv.org";
      const directory = url.pathname === "/open-cameras" || url.pathname === "/open-cameras/";
      const cameraPage = url.pathname.startsWith("/cameras/");
      return trustedHost && (directory || cameraPage);
    } catch {
      return false;
    }
  }

  global.PhantomBrowserUtils = Object.freeze({ normalizeWebUrl, isOpenCctvUrl });
})(window);
