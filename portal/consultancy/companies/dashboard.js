const consultancyLoginPath = "/?userType=consultancy";
const authStorageKey = "portalLogin";
const consultancyCompaniesState = {
  refreshTimer: null,
  filters: {
    q: "",
    loginActivity: "",
  },
};

const welcomeNode = document.querySelector("#consultancy-companies-welcome");
const emailNode = document.querySelector("#consultancy-companies-email");
const lastSyncedNode = document.querySelector("#consultancy-companies-last-synced");
const liveStatusNode = document.querySelector("#consultancy-companies-live-status");
const totalCompaniesNode = document.querySelector("#consultancy-total-companies");
const filteredCompaniesNode = document.querySelector("#consultancy-filtered-companies");
const activeCompaniesNode = document.querySelector("#consultancy-active-companies");
const totalCompaniesCard = document.querySelector("#consultancy-total-companies-card");
const filteredCompaniesCard = document.querySelector("#consultancy-filtered-companies-card");
const activeCompaniesCard = document.querySelector("#consultancy-active-companies-card");
const storageTargetNode = document.querySelector("#consultancy-companies-storage-target");
const resultsSummaryNode = document.querySelector("#consultancy-companies-results-summary");
const resultsGrid = document.querySelector("#consultancy-companies-results-grid");
const emptyStateNode = document.querySelector("#consultancy-companies-empty-state");
const refreshButton = document.querySelector("#consultancy-companies-refresh-button");
const signOutButton = document.querySelector("#consultancy-companies-sign-out-button");
const filterForm = document.querySelector("#consultancy-companies-filter-form");
const resetFiltersButton = document.querySelector("#consultancy-companies-reset-filters-button");

function parseStoredSession() {
  return window.portalAuth?.readSession?.() || null;
}

function toDisplayName(session) {
  if (session?.name) {
    return session.name;
  }

  const emailPrefix = String(session?.email || "")
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .trim();

  if (!emailPrefix) {
    return "Consultancy Team";
  }

  return emailPrefix.replace(/\b\w/g, (character) => character.toUpperCase());
}

function requireConsultancySession() {
  const session = parseStoredSession();

  if (!session || session.role !== "consultancy") {
    window.location.replace(consultancyLoginPath);
    return null;
  }

  return session;
}

function setLiveStatus(message, state) {
  if (!liveStatusNode) {
    return;
  }

  liveStatusNode.textContent = message;
  liveStatusNode.dataset.state = state;
}

function formatCount(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value || 0));
}

function formatSyncTime(isoString) {
  if (!isoString) {
    return "Waiting for first sync";
  }

  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return "Sync time unavailable";
  }

  return `Synced ${new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)}`;
}

function formatDateTime(isoString) {
  if (!isoString) {
    return "Not available";
  }

  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function animateCard(node) {
  if (!node) {
    return;
  }

  node.classList.remove("is-pulse");
  void node.offsetWidth;
  node.classList.add("is-pulse");
}

function createTextValue(value, fallback = "Not provided") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function renderCompanies(companies) {
  if (!resultsGrid || !emptyStateNode) {
    return;
  }

  if (!Array.isArray(companies) || companies.length === 0) {
    resultsGrid.innerHTML = "";
    emptyStateNode.hidden = false;
    return;
  }

  emptyStateNode.hidden = true;

  resultsGrid.innerHTML = companies
    .map((company) => {
      const loginActivityClass =
        company.loginActivity === "logged-in" ? "is-live" : "is-idle";
      const loginActivityLabel =
        company.loginActivity === "logged-in"
          ? "Login activity recorded"
          : "No login activity yet";
      const nameNote = company.hasCustomName
        ? "This company account includes a saved name in the login record."
        : "This company account is being identified from its login email because no company name was saved yet.";

      return `
        <article class="company-account-card">
          <div class="company-account-header">
            <div>
              <span class="card-kicker">Company Login Account</span>
              <h3>${createTextValue(company.displayName, "Company Account")}</h3>
              <p class="company-account-subtitle">${createTextValue(company.email)}</p>
            </div>
            <div class="company-account-badges">
              <span class="company-account-badge ${loginActivityClass}">${loginActivityLabel}</span>
              <span class="company-account-badge">${formatDateTime(company.updatedAt)}</span>
            </div>
          </div>

          <p class="company-account-note">${nameNote}</p>

          <dl class="company-account-meta">
            <div>
              <dt>Stored Name</dt>
              <dd>${createTextValue(company.name, "Not saved")}</dd>
            </div>
            <div>
              <dt>Company Email</dt>
              <dd>${createTextValue(company.email)}</dd>
            </div>
            <div>
              <dt>Login Status</dt>
              <dd>${loginActivityLabel}</dd>
            </div>
          </dl>

          <dl class="company-account-stats">
            <div>
              <dt>Account Created</dt>
              <dd>${formatDateTime(company.createdAt)}</dd>
            </div>
            <div>
              <dt>Last Login</dt>
              <dd>${formatDateTime(company.lastLoginAt)}</dd>
            </div>
          </dl>
        </article>
      `;
    })
    .join("");
}

function updateDashboard(snapshot) {
  if (!snapshot) {
    return;
  }

  const previousTotal = Number(totalCompaniesNode?.dataset.value || "0");
  const previousFiltered = Number(filteredCompaniesNode?.dataset.value || "0");
  const previousActive = Number(activeCompaniesNode?.dataset.value || "0");
  const totalCompanies = Number(snapshot.totalCompanies || 0);
  const filteredCompanies = Number(snapshot.filteredCompanies || 0);
  const companiesWithLoginActivity = Number(snapshot.companiesWithLoginActivity || 0);

  if (totalCompaniesNode) {
    totalCompaniesNode.textContent = formatCount(totalCompanies);
    totalCompaniesNode.dataset.value = String(totalCompanies);
  }

  if (filteredCompaniesNode) {
    filteredCompaniesNode.textContent = formatCount(filteredCompanies);
    filteredCompaniesNode.dataset.value = String(filteredCompanies);
  }

  if (activeCompaniesNode) {
    activeCompaniesNode.textContent = formatCount(companiesWithLoginActivity);
    activeCompaniesNode.dataset.value = String(companiesWithLoginActivity);
  }

  if (lastSyncedNode) {
    lastSyncedNode.textContent = formatSyncTime(snapshot.syncedAt);
  }

  if (storageTargetNode && snapshot.storage?.databaseName && snapshot.storage?.collectionName) {
    storageTargetNode.textContent =
      `Company accounts are being read from ${snapshot.storage.databaseName}.${snapshot.storage.collectionName}.`;
  }

  if (resultsSummaryNode) {
    const totalSummary = `Showing ${formatCount(filteredCompanies)} result(s) out of ${formatCount(totalCompanies)} registered company account(s).`;
    const activitySummary = `${formatCount(companiesWithLoginActivity)} company account(s) have recorded login activity.`;
    resultsSummaryNode.textContent = `${totalSummary} ${activitySummary}`;
  }

  if (totalCompanies !== previousTotal) {
    animateCard(totalCompaniesCard);
  }

  if (filteredCompanies !== previousFiltered) {
    animateCard(filteredCompaniesCard);
  }

  if (companiesWithLoginActivity !== previousActive) {
    animateCard(activeCompaniesCard);
  }

  renderCompanies(snapshot.companies || []);
}

function buildDashboardUrl() {
  const params = new URLSearchParams();

  Object.entries(consultancyCompaniesState.filters).forEach(([key, value]) => {
    const normalizedValue = String(value || "").trim();

    if (normalizedValue) {
      params.set(key, normalizedValue);
    }
  });

  const queryString = params.toString();
  return queryString
    ? `/api/consultancy/companies?${queryString}`
    : "/api/consultancy/companies";
}

async function fetchDashboardSnapshot() {
  const response = await fetch(buildDashboardUrl(), {
    headers: {
      Accept: "application/json",
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Unable to load the consultancy company dashboard.");
  }

  updateDashboard(result);
  return result;
}

function startAutoRefresh() {
  if (consultancyCompaniesState.refreshTimer) {
    return;
  }

  consultancyCompaniesState.refreshTimer = window.setInterval(async () => {
    try {
      await fetchDashboardSnapshot();
      setLiveStatus("Consultancy company dashboard auto-refresh is active.", "live");
    } catch (error) {
      setLiveStatus(error.message, "error");
    }
  }, 15000);
}

function stopAutoRefresh() {
  if (!consultancyCompaniesState.refreshTimer) {
    return;
  }

  window.clearInterval(consultancyCompaniesState.refreshTimer);
  consultancyCompaniesState.refreshTimer = null;
}

function initializeHeader() {
  const session = requireConsultancySession();

  if (!session) {
    return false;
  }

  if (welcomeNode) {
    welcomeNode.textContent = `Welcome back, ${toDisplayName(session)}.`;
  }

  if (emailNode) {
    emailNode.textContent = `Signed in as ${session.email}`;
  }

  return true;
}

function syncFiltersFromForm() {
  if (!filterForm) {
    return;
  }

  const formData = new FormData(filterForm);
  consultancyCompaniesState.filters = {
    q: String(formData.get("q") || "").trim(),
    loginActivity: String(formData.get("loginActivity") || "").trim(),
  };
}

function resetFilters() {
  consultancyCompaniesState.filters = {
    q: "",
    loginActivity: "",
  };

  filterForm?.reset();
}

function cleanupDashboard() {
  stopAutoRefresh();
}

filterForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  syncFiltersFromForm();

  try {
    await fetchDashboardSnapshot();
    setLiveStatus("Company filters applied successfully.", "live");
  } catch (error) {
    setLiveStatus(error.message, "error");
  }
});

resetFiltersButton?.addEventListener("click", async () => {
  resetFilters();

  try {
    await fetchDashboardSnapshot();
    setLiveStatus("Company filters were cleared.", "live");
  } catch (error) {
    setLiveStatus(error.message, "error");
  }
});

refreshButton?.addEventListener("click", async () => {
  refreshButton.disabled = true;
  refreshButton.textContent = "Refreshing...";

  try {
    await fetchDashboardSnapshot();
    setLiveStatus("Consultancy company dashboard refreshed successfully.", "live");
  } catch (error) {
    setLiveStatus(error.message, "error");
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = "Refresh Companies";
  }
});

signOutButton?.addEventListener("click", () => {
  cleanupDashboard();
  window.portalAuth?.logout?.(consultancyLoginPath);
});

window.addEventListener("beforeunload", cleanupDashboard);

async function initializeDashboard() {
  const session = await window.portalAuth?.requireSession?.({
    requiredRole: "consultancy",
    loginPath: consultancyLoginPath,
  });

  if (!session) {
    return;
  }

  if (welcomeNode) {
    welcomeNode.textContent = `Welcome back, ${toDisplayName(session)}.`;
  }

  if (emailNode) {
    emailNode.textContent = `Signed in as ${session.email}`;
  }

  try {
    await fetchDashboardSnapshot();
    setLiveStatus("Consultancy company dashboard loaded. Auto-refresh is active.", "live");
  } catch (error) {
    setLiveStatus(error.message, "error");
  }

  startAutoRefresh();
}

initializeDashboard();
