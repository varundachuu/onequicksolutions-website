const companyLoginPath = "/?userType=company";
const dashboardState = {
  editingJobReference: "",
  jobs: [],
  refreshTimer: null,
  selectedAnonymousJobReference: "",
};

const welcomeNode = document.querySelector("#company-welcome");
const emailNode = document.querySelector("#company-email");
const lastSyncedNode = document.querySelector("#last-synced");
const liveStatusNode = document.querySelector("#live-status");
const candidateCountNode = document.querySelector("#candidate-count-value");
const countCard = document.querySelector("#count-card");
const storageTargetNode = document.querySelector("#storage-target");
const refreshButton = document.querySelector("#refresh-count-button");
const signOutButton = document.querySelector("#sign-out-button");
const jobForm = document.querySelector("#company-job-form");
const jobReferenceInput = document.querySelector("#company-job-reference");
const jobFormStatus = document.querySelector("#company-job-form-status");
const jobDraftButton = document.querySelector("#company-job-draft-button");
const jobSaveButton = document.querySelector("#company-job-save-button");
const jobSubmitButton = document.querySelector("#company-job-submit-button");
const jobResetButton = document.querySelector("#company-job-reset-button");
const jobsGrid = document.querySelector("#company-jobs-grid");
const jobsEmptyState = document.querySelector("#company-jobs-empty-state");
const anonymousCandidatesTitle = document.querySelector("#company-anonymous-candidates-title");
const anonymousCandidatesGrid = document.querySelector("#company-anonymous-candidates-grid");
const notificationsList = document.querySelector("#company-notifications-list");
const notificationsSummaryNode = document.querySelector("#company-notifications-summary");
const markAllNotificationsButton = document.querySelector("#company-mark-all-notifications-button");
const notificationsStatusNode = document.querySelector("#company-notifications-status");
const summaryNodes = {
  activeJobs: document.querySelector("#company-summary-active-jobs"),
  pendingJobs: document.querySelector("#company-summary-pending-jobs"),
  jobsRequiringChanges: document.querySelector("#company-summary-change-jobs"),
  totalCandidateInterests: document.querySelector("#company-summary-interests"),
  totalApplications: document.querySelector("#company-summary-applications"),
  shortlisted: document.querySelector("#company-summary-shortlisted"),
  interviewStage: document.querySelector("#company-summary-interviews"),
  selected: document.querySelector("#company-summary-selected"),
};

function getSavedSession() {
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
    return "Company Team";
  }

  return emailPrefix.replace(/\b\w/g, (character) => character.toUpperCase());
}

function setLiveStatus(message, state) {
  if (!liveStatusNode) {
    return;
  }

  liveStatusNode.textContent = message;
  liveStatusNode.dataset.state = state;
}

function setJobFormStatus(message, kind = "") {
  if (!jobFormStatus) {
    return;
  }

  jobFormStatus.hidden = false;
  jobFormStatus.textContent = message;
  jobFormStatus.classList.remove("is-success", "is-error");

  if (kind === "success") {
    jobFormStatus.classList.add("is-success");
  }

  if (kind === "error") {
    jobFormStatus.classList.add("is-error");
  }
}

function setNotificationsStatus(message, kind = "") {
  if (!notificationsStatusNode) {
    return;
  }

  notificationsStatusNode.hidden = !message;
  notificationsStatusNode.textContent = message;
  notificationsStatusNode.classList.remove("is-success", "is-error");

  if (kind === "success") {
    notificationsStatusNode.classList.add("is-success");
  }

  if (kind === "error") {
    notificationsStatusNode.classList.add("is-error");
  }
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

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

function normalizeAuthErrorMessage(message, fallbackMessage) {
  const text = String(message || "").trim();
  return text || fallbackMessage;
}

function animateCountCard() {
  if (!countCard) {
    return;
  }

  countCard.classList.remove("is-pulse");
  void countCard.offsetWidth;
  countCard.classList.add("is-pulse");
}

function updateDashboard(snapshot) {
  if (!snapshot || typeof snapshot.totalCandidates !== "number") {
    return;
  }

  const previousValue = Number(candidateCountNode?.dataset.value || "0");
  const nextValue = snapshot.totalCandidates;

  if (candidateCountNode) {
    candidateCountNode.textContent = formatCount(nextValue);
    candidateCountNode.dataset.value = String(nextValue);
  }

  if (lastSyncedNode) {
    lastSyncedNode.textContent = formatSyncTime(snapshot.syncedAt);
  }

  if (storageTargetNode && snapshot.storage?.databaseName && snapshot.storage?.collectionName) {
    storageTargetNode.textContent =
      `Active candidate profiles are being read from ${snapshot.storage.databaseName}.${snapshot.storage.collectionName}.`;
  }

  if (nextValue !== previousValue) {
    animateCountCard();
  }
}

function resetJobForm() {
  if (!jobForm) {
    return;
  }

  jobForm.reset();
  dashboardState.editingJobReference = "";

  if (jobReferenceInput) {
    jobReferenceInput.value = "";
  }

  if (jobFormStatus) {
    jobFormStatus.hidden = true;
  }
}

function populateJobForm(job) {
  if (!jobForm || !job) {
    return;
  }

  resetJobForm();

  dashboardState.editingJobReference = job.jobReference;

  if (jobReferenceInput) {
    jobReferenceInput.value = job.jobReference;
  }

  const fields = {
    title: job.title || "",
    department: job.department || "",
    description: job.description || "",
    responsibilities: Array.isArray(job.responsibilities)
      ? job.responsibilities.join("\n")
      : "",
    requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills.join(", ") : "",
    preferredSkills: Array.isArray(job.preferredSkills) ? job.preferredSkills.join(", ") : "",
    minimumExperience: job.minimumExperience ?? "",
    maximumExperience: job.maximumExperience ?? "",
    qualification: job.qualification || "",
    location: job.location || "",
    workMode: job.workMode || "onsite",
    employmentType: job.employmentType || "full-time",
    salaryMinimum: job.salaryMinimum ?? "",
    salaryMaximum: job.salaryMaximum ?? "",
    openings: job.openings ?? 1,
    candidateAudience: job.candidateAudience || "all",
    shiftDetails: job.shiftDetails || "",
    noticePeriodPreference: job.noticePeriodPreference || "",
    applicationDeadline: job.applicationDeadline
      ? new Date(job.applicationDeadline).toISOString().slice(0, 10)
      : "",
    industry: job.industry || "",
    screeningQuestions: Array.isArray(job.screeningQuestions)
      ? job.screeningQuestions.map((question) => question.question || question).join("\n")
      : "",
    additionalInformation: job.additionalInformation || "",
    internalCompanyNote: job.internalCompanyNote || "",
  };

  Object.entries(fields).forEach(([name, value]) => {
    const field = jobForm.elements.namedItem(name);

    if (field && "value" in field) {
      field.value = value;
    }
  });

  setJobFormStatus(
    `Loaded ${job.jobReference} into the form. Update the details and save them back to the same job.`,
    "success",
  );
  jobForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildJobPayload() {
  const formData = new FormData(jobForm);
  return Object.fromEntries(formData.entries());
}

function updateNotificationsSummary(unreadCount = 0, totalCount = 0) {
  if (notificationsSummaryNode) {
    notificationsSummaryNode.textContent =
      totalCount > 0
        ? `${formatCount(unreadCount)} unread of ${formatCount(totalCount)} updates`
        : "No consultancy updates yet.";
  }

  if (markAllNotificationsButton) {
    markAllNotificationsButton.disabled = unreadCount === 0;
  }
}

async function markNotificationAsRead(notificationId) {
  const response = await fetch(
    `/api/notifications/${encodeURIComponent(notificationId)}/read`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
      },
    },
  );
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      normalizeAuthErrorMessage(result.message, "Unable to mark the notification as read."),
    );
  }

  return result;
}

async function markAllNotificationsAsRead() {
  const response = await fetch("/api/notifications/read-all", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      normalizeAuthErrorMessage(
        result.message,
        "Unable to update all notifications right now.",
      ),
    );
  }

  return result;
}

function renderNotifications(notifications, meta = {}) {
  if (!notificationsList) {
    return;
  }

  const rows = Array.isArray(notifications) ? notifications : [];
  updateNotificationsSummary(meta.unreadCount || 0, meta.totalCount || rows.length);

  if (rows.length === 0) {
    notificationsList.innerHTML = `
      <article class="dashboard-record-card">
        <h3>No consultancy updates yet</h3>
        <p>Notifications about approvals, changes, publications, and anonymous application activity will appear here.</p>
      </article>
    `;
    return;
  }

  notificationsList.innerHTML = rows
    .map(
      (notification) => `
        <article class="dashboard-record-card ${notification.isRead ? "is-read" : ""}">
          <span class="card-kicker">Consultancy Update</span>
          <h3>${notification.title}</h3>
          <p>${notification.message}</p>
          <div class="dashboard-record-meta">
            <span class="dashboard-record-badge ${notification.isRead ? "" : "dashboard-record-badge--unread"}">
              ${notification.isRead ? "Read" : "Unread"}
            </span>
            <span>${notification.entityReference || "Recruitment update"}</span>
            <span>${formatSyncTime(notification.createdAt).replace("Synced ", "")}</span>
          </div>
          ${
            notification.isRead
              ? ""
              : `
                <div class="dashboard-record-actions">
                  <button class="ghost-button" type="button" data-mark-notification="${notification.id}">
                    Mark As Read
                  </button>
                </div>
              `
          }
        </article>
      `,
    )
    .join("");

  notificationsList.querySelectorAll("[data-mark-notification]").forEach((button) => {
    button.addEventListener("click", async () => {
      const notificationId = button.getAttribute("data-mark-notification");
      button.disabled = true;

      try {
        const result = await markNotificationAsRead(notificationId);
        setNotificationsStatus(result.message, "success");
        await loadNotifications();
      } catch (error) {
        setNotificationsStatus(
          normalizeAuthErrorMessage(
            error.message,
            "Unable to mark the notification as read.",
          ),
          "error",
        );
      } finally {
        button.disabled = false;
      }
    });
  });
}

function renderSummary(summary = {}) {
  const mapping = {
    activeJobs: "activeJobs",
    pendingJobs: "pendingJobs",
    jobsRequiringChanges: "jobsRequiringChanges",
    totalCandidateInterests: "totalCandidateInterests",
    totalApplications: "totalApplications",
    shortlisted: "shortlisted",
    interviewStage: "interviewStage",
    selected: "selected",
  };

  Object.entries(mapping).forEach(([key, summaryKey]) => {
    if (summaryNodes[key]) {
      summaryNodes[key].textContent = formatCount(summary[summaryKey] || 0);
    }
  });
}

function renderAnonymousCandidates(jobReference, candidates) {
  if (!anonymousCandidatesGrid || !anonymousCandidatesTitle) {
    return;
  }

  dashboardState.selectedAnonymousJobReference = jobReference;
  anonymousCandidatesTitle.textContent = `${jobReference} shared anonymous candidate summaries`;

  if (!Array.isArray(candidates) || candidates.length === 0) {
    anonymousCandidatesGrid.innerHTML = `
      <article class="dashboard-record-card">
        <h3>No anonymous summaries shared yet</h3>
        <p>The consultancy has not yet shared any anonymous candidate summaries for this job.</p>
      </article>
    `;
    return;
  }

  anonymousCandidatesGrid.innerHTML = candidates
    .map(
      (candidate) => `
        <article class="dashboard-record-card">
          <span class="card-kicker">Anonymous Candidate</span>
          <h3>${candidate.anonymousCandidateReference}</h3>
          <div class="dashboard-record-meta">
            <span>${candidate.candidateType || "Candidate type not shared"}</span>
            <span>${candidate.preferredRole || "Preferred role not shared"}</span>
            <span>${candidate.currentStatus || "Status not shared"}</span>
          </div>
          <p>${candidate.approvedComment || candidate.consultancyScreeningResult || "Consultancy summary will appear here."}</p>
          <div class="dashboard-record-stats">
            <span>${candidate.experienceRange || "Experience not shared"}</span>
            <span>${candidate.currentLocation || "Location not shared"}</span>
            <span>${candidate.noticePeriod || "Notice period not shared"}</span>
          </div>
          <div class="dashboard-record-actions">
            <button class="ghost-button" type="button" data-company-action="request_interview" data-application-reference="${candidate.applicationReference}">
              Request Interview
            </button>
            <button class="ghost-button" type="button" data-company-action="request_more_information" data-application-reference="${candidate.applicationReference}">
              Need More Info
            </button>
            <button class="ghost-button" type="button" data-company-action="put_on_hold" data-application-reference="${candidate.applicationReference}">
              Put On Hold
            </button>
            <button class="ghost-button" type="button" data-company-action="reject_candidate" data-application-reference="${candidate.applicationReference}">
              Reject
            </button>
          </div>
        </article>
      `,
    )
    .join("");

  anonymousCandidatesGrid.querySelectorAll("[data-company-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const shareReference = button.getAttribute("data-application-reference");
      const match = candidates.find(
        (candidate) => candidate.applicationReference === shareReference,
      );

      if (!match) {
        return;
      }

      const note = window.prompt(
        "Add an optional note for the consultancy team before sending this decision.",
        "",
      );

      button.disabled = true;

      try {
        const response = await fetch(
          `/api/company/applications/${encodeURIComponent(match.applicationReference || shareReference)}/decision`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              action: button.getAttribute("data-company-action"),
              note: note || "",
            }),
          },
        );
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            normalizeAuthErrorMessage(result.message, "Unable to record the company decision."),
          );
        }

        setLiveStatus(result.message, "live");
        await Promise.all([
          loadJobsWorkspace(),
          loadAnonymousCandidates(dashboardState.selectedAnonymousJobReference),
        ]);
      } catch (error) {
        setLiveStatus(
          normalizeAuthErrorMessage(error.message, "Unable to record the company decision."),
          "error",
        );
      } finally {
        button.disabled = false;
      }
    });
  });
}

async function loadAnonymousCandidates(jobReference) {
  const response = await fetch(
    `/api/company/jobs/${encodeURIComponent(jobReference)}/anonymous-candidates`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      normalizeAuthErrorMessage(
        result.message,
        "Unable to load anonymous candidate summaries right now.",
      ),
    );
  }

  renderAnonymousCandidates(jobReference, result.candidates || []);
}

function renderJobs(jobs) {
  if (!jobsGrid || !jobsEmptyState) {
    return;
  }

  dashboardState.jobs = Array.isArray(jobs) ? jobs : [];

  if (dashboardState.jobs.length === 0) {
    jobsGrid.innerHTML = "";
    jobsEmptyState.hidden = false;
    return;
  }

  jobsEmptyState.hidden = true;
  jobsGrid.innerHTML = dashboardState.jobs
    .map(
      (job) => `
        <article class="dashboard-record-card">
          <span class="card-kicker">${job.statusLabel}</span>
          <h3>${job.title}</h3>
          <div class="dashboard-record-meta">
            <span>${job.jobReference}</span>
            <span>${job.location || "Location not set"}</span>
            <span>${job.workMode || "Work mode not set"}</span>
            <span>${job.employmentType || "Employment type not set"}</span>
          </div>
          <div class="dashboard-record-stats">
            <span>Interests: ${formatCount(job.metrics?.interestCount || 0)}</span>
            <span>Applications: ${formatCount(job.metrics?.applicationCount || 0)}</span>
            <span>Shortlisted: ${formatCount(job.metrics?.shortlistedCount || 0)}</span>
            <span>Interviews: ${formatCount(job.metrics?.interviewCount || 0)}</span>
          </div>
          <p>${job.reviewComments || "No consultancy comments yet."}</p>
          <div class="dashboard-record-actions">
            <button class="ghost-button" type="button" data-edit-job="${job.jobReference}">
              Edit Job
            </button>
            <button class="ghost-button" type="button" data-load-anonymous-job="${job.jobReference}">
              View Anonymous Candidates
            </button>
            <button class="ghost-button" type="button" data-submit-job="${job.jobReference}">
              Submit To Consultancy
            </button>
            <button class="ghost-button" type="button" data-close-job="${job.jobReference}">
              Request Closure
            </button>
          </div>
          <div class="dashboard-record-meta">
            <span>Created: ${formatDate(job.createdAt)}</span>
            <span>Deadline: ${formatDate(job.applicationDeadline)}</span>
          </div>
        </article>
      `,
    )
    .join("");

  jobsGrid.querySelectorAll("[data-edit-job]").forEach((button) => {
    button.addEventListener("click", async () => {
      const jobReference = button.getAttribute("data-edit-job");

      try {
        const response = await fetch(`/api/company/jobs/${encodeURIComponent(jobReference)}`, {
          headers: {
            Accept: "application/json",
          },
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            normalizeAuthErrorMessage(result.message, "Unable to load the job details."),
          );
        }

        populateJobForm(result.job);
      } catch (error) {
        setJobFormStatus(
          normalizeAuthErrorMessage(error.message, "Unable to load the job details."),
          "error",
        );
      }
    });
  });

  jobsGrid.querySelectorAll("[data-load-anonymous-job]").forEach((button) => {
    button.addEventListener("click", async () => {
      const jobReference = button.getAttribute("data-load-anonymous-job");
      button.disabled = true;

      try {
        await loadAnonymousCandidates(jobReference);
        setLiveStatus(`Loaded anonymous candidates for ${jobReference}.`, "live");
      } catch (error) {
        setLiveStatus(
          normalizeAuthErrorMessage(
            error.message,
            "Unable to load anonymous candidate summaries.",
          ),
          "error",
        );
      } finally {
        button.disabled = false;
      }
    });
  });

  jobsGrid.querySelectorAll("[data-submit-job]").forEach((button) => {
    button.addEventListener("click", async () => {
      const jobReference = button.getAttribute("data-submit-job");
      button.disabled = true;

      try {
        const response = await fetch(
          `/api/company/jobs/${encodeURIComponent(jobReference)}/submit`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
          },
        );
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            normalizeAuthErrorMessage(result.message, "Unable to submit this job right now."),
          );
        }

        setLiveStatus(result.message, "live");
        await loadJobsWorkspace();
      } catch (error) {
        setLiveStatus(
          normalizeAuthErrorMessage(error.message, "Unable to submit this job right now."),
          "error",
        );
      } finally {
        button.disabled = false;
      }
    });
  });

  jobsGrid.querySelectorAll("[data-close-job]").forEach((button) => {
    button.addEventListener("click", async () => {
      const jobReference = button.getAttribute("data-close-job");
      const reason = window.prompt(
        "Add an optional reason for the closure request.",
        "",
      );

      button.disabled = true;

      try {
        const response = await fetch(
          `/api/company/jobs/${encodeURIComponent(jobReference)}/close-request`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              reason: reason || "",
            }),
          },
        );
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            normalizeAuthErrorMessage(result.message, "Unable to request job closure."),
          );
        }

        setLiveStatus(result.message, "live");
      } catch (error) {
        setLiveStatus(
          normalizeAuthErrorMessage(error.message, "Unable to request job closure."),
          "error",
        );
      } finally {
        button.disabled = false;
      }
    });
  });
}

async function fetchDashboardSnapshot() {
  const response = await fetch("/api/company/dashboard", {
    headers: {
      Accept: "application/json",
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Unable to load the company dashboard.");
  }

  updateDashboard(result);
  return result;
}

async function loadJobsWorkspace() {
  const response = await fetch("/api/company/jobs", {
    headers: {
      Accept: "application/json",
    },
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      normalizeAuthErrorMessage(result.message, "Unable to load company jobs right now."),
    );
  }

  renderSummary(result.summary || {});
  renderJobs(result.jobs || []);
  return result;
}

async function loadNotifications() {
  const response = await fetch("/api/notifications?limit=8", {
    headers: {
      Accept: "application/json",
    },
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      normalizeAuthErrorMessage(result.message, "Unable to load notifications right now."),
    );
  }

  renderNotifications(result.notifications || [], result);
  setNotificationsStatus("", "");
  return result;
}

async function saveJob(intent = "draft") {
  const payload = buildJobPayload();
  const isEditing = Boolean(dashboardState.editingJobReference);
  const endpoint = isEditing
    ? `/api/company/jobs/${encodeURIComponent(dashboardState.editingJobReference)}`
    : "/api/company/jobs";
  const method = isEditing ? "PUT" : "POST";

  if (!isEditing) {
    payload.intent = intent;
  }

  const response = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      normalizeAuthErrorMessage(result.message, "Unable to save the company job right now."),
    );
  }

  return result;
}

function startAutoRefresh() {
  if (dashboardState.refreshTimer) {
    return;
  }

  dashboardState.refreshTimer = window.setInterval(async () => {
    try {
      await Promise.all([fetchDashboardSnapshot(), loadJobsWorkspace(), loadNotifications()]);
      setLiveStatus("Dashboard auto-refresh is active.", "live");
    } catch (error) {
      setLiveStatus(error.message, "error");
    }
  }, 20000);
}

function stopAutoRefresh() {
  if (!dashboardState.refreshTimer) {
    return;
  }

  window.clearInterval(dashboardState.refreshTimer);
  dashboardState.refreshTimer = null;
}

function initializeHeader(session) {
  if (welcomeNode) {
    welcomeNode.textContent = `Welcome back, ${toDisplayName(session)}.`;
  }

  if (emailNode) {
    emailNode.textContent = `Signed in as ${session.email}`;
  }
}

async function initializeDashboard() {
  const session = await window.portalAuth?.requireSession?.({
    requiredRole: "company",
    loginPath: companyLoginPath,
  });

  if (!session) {
    return;
  }

  initializeHeader(session);

  jobForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    jobSaveButton.disabled = true;
    jobSaveButton.textContent = "Saving...";

    try {
      const result = await saveJob("draft");
      setJobFormStatus(result.message, "success");
      await Promise.all([loadJobsWorkspace(), loadNotifications()]);
    } catch (error) {
      setJobFormStatus(
        normalizeAuthErrorMessage(error.message, "Unable to save the company job."),
        "error",
      );
    } finally {
      jobSaveButton.disabled = false;
      jobSaveButton.textContent = "Save Changes";
    }
  });

  jobDraftButton?.addEventListener("click", async () => {
    jobDraftButton.disabled = true;
    jobDraftButton.textContent = "Saving...";

    try {
      const result = await saveJob("draft");
      setJobFormStatus(result.message, "success");
      await Promise.all([loadJobsWorkspace(), loadNotifications()]);
    } catch (error) {
      setJobFormStatus(
        normalizeAuthErrorMessage(error.message, "Unable to save the company job."),
        "error",
      );
    } finally {
      jobDraftButton.disabled = false;
      jobDraftButton.textContent = "Save Draft";
    }
  });

  jobSubmitButton?.addEventListener("click", async () => {
    jobSubmitButton.disabled = true;
    jobSubmitButton.textContent = "Submitting...";

    try {
      if (dashboardState.editingJobReference) {
        const saveResult = await saveJob("draft");
        setJobFormStatus(saveResult.message, "success");
        const response = await fetch(
          `/api/company/jobs/${encodeURIComponent(dashboardState.editingJobReference)}/submit`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
          },
        );
        const submitResult = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            normalizeAuthErrorMessage(
              submitResult.message,
              "Unable to submit the company job right now.",
            ),
          );
        }

        setJobFormStatus(submitResult.message, "success");
      } else {
        const result = await saveJob("submitted");
        setJobFormStatus(result.message, "success");
      }

      await Promise.all([loadJobsWorkspace(), loadNotifications()]);
    } catch (error) {
      setJobFormStatus(
        normalizeAuthErrorMessage(error.message, "Unable to submit the company job."),
        "error",
      );
    } finally {
      jobSubmitButton.disabled = false;
      jobSubmitButton.textContent = "Submit To Consultancy";
    }
  });

  jobResetButton?.addEventListener("click", () => {
    resetJobForm();
    setJobFormStatus("Job form reset. You can now create a fresh requirement.", "success");
  });

  refreshButton?.addEventListener("click", async () => {
    refreshButton.disabled = true;
    refreshButton.textContent = "Refreshing...";

    try {
      await Promise.all([fetchDashboardSnapshot(), loadJobsWorkspace(), loadNotifications()]);
      setLiveStatus("Dashboard refreshed successfully.", "live");
    } catch (error) {
      setLiveStatus(error.message, "error");
    } finally {
      refreshButton.disabled = false;
      refreshButton.textContent = "Refresh Count";
    }
  });

  signOutButton?.addEventListener("click", () => {
    stopAutoRefresh();
    window.portalAuth?.logout?.(companyLoginPath);
  });

  markAllNotificationsButton?.addEventListener("click", async () => {
    markAllNotificationsButton.disabled = true;

    try {
      const result = await markAllNotificationsAsRead();
      setNotificationsStatus(result.message, "success");
      await loadNotifications();
    } catch (error) {
      setNotificationsStatus(
        normalizeAuthErrorMessage(
          error.message,
          "Unable to update all notifications right now.",
        ),
        "error",
      );
    } finally {
      markAllNotificationsButton.disabled = false;
    }
  });

  window.addEventListener("beforeunload", stopAutoRefresh);

  try {
    await Promise.all([fetchDashboardSnapshot(), loadJobsWorkspace(), loadNotifications()]);
    setLiveStatus("Dashboard loaded. Auto-refresh is active.", "live");
  } catch (error) {
    setLiveStatus(error.message, "error");
  }

  startAutoRefresh();
}

initializeDashboard();
