(() => {
  const key = "portalTheme";
  const apply = (theme) => {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const dark = theme === "dark";
      button.textContent = dark ? "Light mode" : "Dark mode";
      button.setAttribute("aria-pressed", String(dark));
    });
  };
  const saved = localStorage.getItem(key);
  apply(saved === "dark" ? "dark" : "light");
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-theme-toggle]");
    if (!button) return;
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(key, next);
    apply(next);
  });
  function notify(message, kind = "info") {
    let region = document.querySelector("#portal-notifications");
    if (!region) { region = document.createElement("div"); region.id = "portal-notifications"; region.setAttribute("aria-live", "polite"); document.body.append(region); }
    const toast = document.createElement("div"); toast.className = `portal-toast portal-toast--${kind}`; toast.textContent = message; region.append(toast); window.setTimeout(() => toast.remove(), 4500);
  }
  window.portalUi = { notify };
})();
