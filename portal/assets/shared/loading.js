(() => {
  const root = document.documentElement;
  const minimumVisibleMs = 220;
  let pendingRequests = 0;
  let pageLoaded = false;
  let readyTimer = null;

  root.classList.add("portal-page-loading");

  const styles = document.createElement("style");
  styles.textContent = `
    html.portal-page-loading body { overflow: hidden; }
    .portal-loading-overlay { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; padding: 24px; background: linear-gradient(135deg, #eef7f8 0%, #dbeaf2 48%, #f7f3ed 100%); opacity: 1; transition: opacity .24s ease, visibility .24s ease; }
    .portal-loading-overlay.is-hidden { opacity: 0; visibility: hidden; pointer-events: none; }
    .portal-loading-card { display: grid; justify-items: center; gap: 18px; min-width: 220px; color: #12354c; text-align: center; }
    .portal-loading-logo { width: 92px; height: 92px; object-fit: contain; border-radius: 22px; background: #fff; box-shadow: 0 14px 36px rgba(16, 78, 97, .16); padding: 12px; animation: portal-loading-pulse 1.25s ease-in-out infinite; }
    .portal-loading-ring { width: 40px; height: 40px; border: 4px solid rgba(10, 98, 112, .18); border-top-color: #086977; border-radius: 50%; animation: portal-loading-spin .72s linear infinite; }
    .portal-loading-label { margin: -6px 0 0; font: 700 14px/1.35 Arial, sans-serif; letter-spacing: .02em; }
    @keyframes portal-loading-spin { to { transform: rotate(360deg); } }
    @keyframes portal-loading-pulse { 50% { transform: scale(1.045); box-shadow: 0 18px 42px rgba(16, 78, 97, .25); } }
  `;
  document.head.append(styles);

  function mountOverlay() {
    if (!document.body || document.querySelector(".portal-loading-overlay")) return;
    const overlay = document.createElement("div");
    overlay.className = "portal-loading-overlay";
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-label", "Loading portal content");
    overlay.innerHTML = `<div class="portal-loading-card"><img class="portal-loading-logo" src="/assets/logo/portal-logo-secondary.png" alt="OneQuickSolutions" /><div class="portal-loading-ring" aria-hidden="true"></div><p class="portal-loading-label">Loading your workspace…</p></div>`;
    document.body.prepend(overlay);
  }

  function hideWhenReady() {
    if (!pageLoaded || pendingRequests > 0) return;
    window.clearTimeout(readyTimer);
    readyTimer = window.setTimeout(() => {
      if (!pageLoaded || pendingRequests > 0) return;
      document.querySelector(".portal-loading-overlay")?.classList.add("is-hidden");
      root.classList.remove("portal-page-loading");
    }, minimumVisibleMs);
  }

  const originalFetch = window.fetch?.bind(window);
  if (originalFetch) {
    window.fetch = (...args) => {
      pendingRequests += 1;
      return originalFetch(...args).finally(() => {
        pendingRequests = Math.max(0, pendingRequests - 1);
        hideWhenReady();
      });
    };
  }

  if (document.body) mountOverlay();
  else document.addEventListener("DOMContentLoaded", mountOverlay, { once: true });
  window.addEventListener("load", () => {
    pageLoaded = true;
    hideWhenReady();
  }, { once: true });
})();
