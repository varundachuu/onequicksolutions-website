(() => {
  const loginPath = "/?userType=candidate";
  const form = document.querySelector("#change-password-form");
  const status = document.querySelector("#password-status");
  const setStatus = (message, kind = "") => { status.hidden = !message; status.textContent = message; status.className = `submit-status ${kind ? `is-${kind}` : ""}`; };
  const formatDate = (value) => value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value)) : "Not available";
  async function init() {
    const session = await window.portalAuth?.requireSession?.({ requiredRole: "candidate", loginPath, requireConsent: true });
    if (!session) return;
    const response = await fetch("/api/candidate/account", { headers: { Accept: "application/json" } });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { document.querySelector("#account-summary").textContent = result.message || "Unable to load account details."; return; }
    const account = result.account;
    document.querySelector("#account-summary").textContent = `${account.name || account.email} · ${account.profileStatus.replace(/_/g, " ")}`;
    const entries = [["Registered email", account.email], ["Candidate type", account.candidateType || "Profile not created"], ["Consent", account.consent ? "Approved" : "Pending"], ["Profile status", account.profileStatus.replace(/_/g, " ")], ["Account created", formatDate(account.createdAt)], ["Last password update", formatDate(account.lastPasswordUpdatedAt)]];
    document.querySelector("#account-details").replaceChildren(...entries.map(([label, value]) => { const row = document.createElement("div"); const term = document.createElement("dt"); const description = document.createElement("dd"); term.textContent = label; description.textContent = value; row.append(term, description); return row; }));
  }
  document.querySelectorAll("[data-toggle]").forEach((button) => button.addEventListener("click", () => { const input = form.elements.namedItem(button.dataset.toggle); input.type = input.type === "password" ? "text" : "password"; button.textContent = input.type === "password" ? "Show" : "Hide"; }));
  form.addEventListener("input", () => { const a = form.elements.newPassword.value; const b = form.elements.confirmPassword.value; if (b && a !== b) setStatus("New password confirmation does not match.", "error"); else if (status.textContent.includes("does not match")) setStatus(""); });
  form.addEventListener("submit", async (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(form)); if (data.newPassword !== data.confirmPassword) { setStatus("New password confirmation does not match.", "error"); return; } const button = form.querySelector("button[type=submit]"); button.disabled = true; button.textContent = "Changing…"; try { const response = await fetch("/api/candidate/account/password", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const result = await response.json().catch(() => ({})); if (!response.ok) throw new Error(result.message || "Unable to change password."); setStatus(result.message, "success"); window.setTimeout(() => window.location.replace(loginPath), 900); } catch (error) { setStatus(error.message, "error"); button.disabled = false; button.textContent = "Change password"; } });
  document.querySelector("#account-signout").addEventListener("click", () => window.portalAuth.logout(loginPath)); init();
})();
