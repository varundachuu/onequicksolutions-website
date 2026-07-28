const consultancyLoginPath = "/?userType=consultancy";
const consultancyState = {
  applicationDetailCache: new Map(),
  filters: {
    candidate: {
      q: "",
      candidateType: "",
      preferredRole: "",
      location: "",
    },
    jobs: {
      q: "",
      status: "",
      company: "",
    },
    applications: {
      q: "",
      status: "",
      candidateType: "",
      company: "",
      job: "",
      preferredRole: "",
    },
  },
  refreshTimer: null,
};

const welcomeNode = document.querySelector("#consultancy-welcome");
const emailNode = document.querySelector("#consultancy-email");
const lastSyncedNode = document.querySelector("#consultancy-last-synced");
const liveStatusNode = document.querySelector("#consultancy-live-status");
const totalCandidatesNode = document.querySelector("#consultancy-total-candidates");
const filteredCandidatesNode = document.querySelector("#consultancy-filtered-candidates");
const totalCard = document.querySelector("#consultancy-total-card");
const filteredCard = document.querySelector("#consultancy-filtered-card");
const storageTargetNode = document.querySelector("#consultancy-storage-target");
const resultsSummaryNode = document.querySelector("#consultancy-results-summary");
const resultsGrid = document.querySelector("#consultancy-results-grid");
const emptyStateNode = document.querySelector("#consultancy-empty-state");
const refreshButton = document.querySelector("#consultancy-refresh-button");
const signOutButton = document.querySelector("#consultancy-sign-out-button");
const filterForm = document.querySelector("#consultancy-filter-form");
const resetFiltersButton = document.querySelector("#consultancy-reset-filters-button");
const jobsFilterForm = document.querySelector("#consultancy-jobs-filter-form");
const jobsResetButton = document.querySelector("#consultancy-jobs-reset-button");
const jobsGrid = document.querySelector("#consultancy-jobs-grid");
const applicationsFilterForm = document.querySelector("#consultancy-applications-filter-form");
const applicationsResetButton = document.querySelector("#consultancy-applications-reset-button");
const applicationsGrid = document.querySelector("#consultancy-applications-grid");
const notificationsGrid = document.querySelector("#consultancy-notifications-grid");
const notificationsSummaryNode = document.querySelector("#consultancy-notifications-summary");
const markAllNotificationsButton = document.querySelector("#consultancy-mark-all-notifications-button");
const notificationsStatusNode = document.querySelector("#consultancy-notifications-status");
const summaryNodes = {
  jobsPendingApproval: document.querySelector("#consultancy-summary-pending-jobs"),
  publishedJobs: document.querySelector("#consultancy-summary-published-jobs"),
  newApplications: document.querySelector("#consultancy-summary-new-applications"),
  pendingScreening: document.querySelector("#consultancy-summary-pending-screening"),
  shortlistedCandidates: document.querySelector("#consultancy-summary-shortlisted"),
  interviewsInProgress: document.querySelector("#consultancy-summary-interviews"),
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
    return "Consultancy Team";
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

function createProfileValue(value, fallback = "Not provided") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function normalizeAuthErrorMessage(message, fallbackMessage) {
  const text = String(message || "").trim();
  return text || fallbackMessage;
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

function animateCard(node) {
  if (!node) {
    return;
  }

  node.classList.remove("is-pulse");
  void node.offsetWidth;
  node.classList.add("is-pulse");
}

function createProfileDetailRows(details = {}) {
  return Object.entries(details)
    .map(
      ([label, value]) => `
        <div>
          <dt>${label}</dt>
          <dd>${createProfileValue(value)}</dd>
        </div>
      `,
    )
    .join("");
}

function renderCandidates(candidates) {
  if (!resultsGrid || !emptyStateNode) {
    return;
  }

  if (!Array.isArray(candidates) || candidates.length === 0) {
    resultsGrid.innerHTML = "";
    emptyStateNode.hidden = false;
    return;
  }

  emptyStateNode.hidden = true;

  resultsGrid.innerHTML = candidates
    .map((candidate) => {
      const isFresher = candidate.candidateType === "fresher";
      const detailRows = isFresher
        ? createProfileDetailRows({
            "Highest Qualification": candidate.fresherDetails?.highestQualification,
            Specialization: candidate.fresherDetails?.specialization,
            "College or Institute": candidate.fresherDetails?.collegeName,
            "Graduation Year": candidate.fresherDetails?.graduationYear,
            "Internship or Training": candidate.fresherDetails?.internshipTraining,
            "Preferred Starting Role": candidate.fresherDetails?.fresherPreferredRole,
            "Academic Projects": candidate.fresherDetails?.projectHighlights,
            "Certifications and Courses": candidate.fresherDetails?.certifications,
          })
        : createProfileDetailRows({
            "Current Company": candidate.experiencedDetails?.currentCompany,
            "Current Role": candidate.experiencedDetails?.currentRole,
            "Total Experience": candidate.experiencedDetails?.totalExperience,
            "Relevant Experience": candidate.experiencedDetails?.relevantExperience,
            "Current CTC": candidate.experiencedDetails?.currentCtc,
            "Expected CTC": candidate.experiencedDetails?.expectedCtc,
            "Notice Period": candidate.experiencedDetails?.noticePeriod,
            "Industry or Domain": candidate.experiencedDetails?.industryDomain,
            "Key Achievements": candidate.experiencedDetails?.careerAchievements,
            "Reason for Change": candidate.experiencedDetails?.reasonForChange,
          });

      return `
        <article class="consultancy-profile-card">
          <div class="consultancy-profile-header">
            <div>
              <span class="card-kicker">${isFresher ? "Fresher Candidate" : "Experienced Candidate"}</span>
              <h3>${createProfileValue(candidate.fullName)}</h3>
              <p class="consultancy-profile-subtitle">${createProfileValue(candidate.preferredRole)}</p>
            </div>
            <div class="consultancy-profile-badges">
              <span class="consultancy-profile-badge">${createProfileValue(candidate.location)}</span>
              <span class="consultancy-profile-badge is-gold">${formatDateTime(candidate.updatedAt)}</span>
            </div>
          </div>

          <p class="consultancy-profile-summary">${createProfileValue(candidate.summary)}</p>

          <dl class="consultancy-profile-meta">
            <div>
              <dt>Email</dt>
              <dd>${createProfileValue(candidate.email)}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>${createProfileValue(candidate.phone)}</dd>
            </div>
            <div>
              <dt>Work Location</dt>
              <dd>${createProfileValue(candidate.preferredWorkLocation)}</dd>
            </div>
            <div>
              <dt>Skills</dt>
              <dd>${createProfileValue(candidate.skills)}</dd>
            </div>
          </dl>

          <div class="consultancy-profile-detail-grid">
            <article class="consultancy-profile-block">
              <span class="card-kicker">Profile Details</span>
              <h4>${isFresher ? "Education and fresher highlights" : "Experience and switch details"}</h4>
              <dl>${detailRows}</dl>
            </article>
          </div>
        </article>
      `;
    })
    .join("");
}

function updateCandidateDashboard(snapshot) {
  if (!snapshot) {
    return;
  }

  const previousTotal = Number(totalCandidatesNode?.dataset.value || "0");
  const previousFiltered = Number(filteredCandidatesNode?.dataset.value || "0");
  const totalCandidates = Number(snapshot.totalCandidates || 0);
  const filteredCandidates = Number(snapshot.filteredCandidates || 0);

  if (totalCandidatesNode) {
    totalCandidatesNode.textContent = formatCount(totalCandidates);
    totalCandidatesNode.dataset.value = String(totalCandidates);
  }

  if (filteredCandidatesNode) {
    filteredCandidatesNode.textContent = formatCount(filteredCandidates);
    filteredCandidatesNode.dataset.value = String(filteredCandidates);
  }

  if (lastSyncedNode) {
    lastSyncedNode.textContent = formatSyncTime(snapshot.syncedAt);
  }

  if (storageTargetNode && snapshot.storage?.databaseName && snapshot.storage?.collectionName) {
    storageTargetNode.textContent =
      `Candidate profiles are being read from ${snapshot.storage.databaseName}.${snapshot.storage.collectionName}.`;
  }

  if (resultsSummaryNode) {
    resultsSummaryNode.textContent =
      filteredCandidates === totalCandidates
        ? `Showing all ${formatCount(totalCandidates)} active candidate profiles visible for hiring.`
        : `Showing ${formatCount(filteredCandidates)} filtered results out of ${formatCount(totalCandidates)} active candidate profiles.`;
  }

  if (totalCandidates !== previousTotal) {
    animateCard(totalCard);
  }

  if (filteredCandidates !== previousFiltered) {
    animateCard(filteredCard);
  }

  renderCandidates(snapshot.candidates || []);
}

function updateRecruitmentSummary(jobSummary = {}, applicationSummary = {}) {
  const summaryValues = {
    jobsPendingApproval: jobSummary.jobsPendingApproval || 0,
    publishedJobs: jobSummary.publishedJobs || 0,
    newApplications: applicationSummary.totalApplications || jobSummary.newApplications || 0,
    pendingScreening:
      applicationSummary.pendingScreening || jobSummary.pendingScreening || 0,
    shortlistedCandidates:
      applicationSummary.shortlistedCandidates || jobSummary.shortlistedCandidates || 0,
    interviewsInProgress:
      applicationSummary.interviewsInProgress || jobSummary.interviewsInProgress || 0,
  };

  Object.entries(summaryValues).forEach(([key, value]) => {
    if (summaryNodes[key]) {
      summaryNodes[key].textContent = formatCount(value);
    }
  });
}

function updateNotificationsSummary(unreadCount = 0, totalCount = 0) {
  if (notificationsSummaryNode) {
    notificationsSummaryNode.textContent =
      totalCount > 0
        ? `${formatCount(unreadCount)} unread of ${formatCount(totalCount)} operational alerts`
        : "No operational alerts yet.";
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
  if (!notificationsGrid) {
    return;
  }

  const rows = Array.isArray(notifications) ? notifications : [];
  updateNotificationsSummary(meta.unreadCount || 0, meta.totalCount || rows.length);

  if (rows.length === 0) {
    notificationsGrid.innerHTML = `
      <article class="dashboard-record-card">
        <h3>No notifications yet</h3>
        <p>No consultancy notifications are waiting right now.</p>
      </article>
    `;
    return;
  }

  notificationsGrid.innerHTML = rows
    .map(
      (notification) => `
        <article class="dashboard-record-card ${notification.isRead ? "is-read" : ""}">
          <span class="card-kicker">${notification.type.replace(/_/g, " ")}</span>
          <h3>${notification.title}</h3>
          <p>${notification.message}</p>
          <div class="dashboard-record-meta">
            <span class="dashboard-record-badge ${notification.isRead ? "" : "dashboard-record-badge--unread"}">
              ${notification.isRead ? "Read" : "Unread"}
            </span>
            <span>${notification.entityReference || "Recruitment update"}</span>
            <span>${formatDateTime(notification.createdAt)}</span>
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

  notificationsGrid.querySelectorAll("[data-mark-notification]").forEach((button) => {
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

function renderJobs(jobs) {
  if (!jobsGrid) {
    return;
  }

  const rows = Array.isArray(jobs) ? jobs : [];

  if (rows.length === 0) {
    jobsGrid.innerHTML = `
      <article class="dashboard-record-card">
        <h3>No jobs matched the current filters</h3>
        <p>Try widening the status or company search to load more submitted jobs.</p>
      </article>
    `;
    return;
  }

  jobsGrid.innerHTML = rows
    .map(
      (job) => `
        <article class="dashboard-record-card">
          <span class="card-kicker">${job.statusLabel}</span>
          <h3>${job.title}</h3>
          <div class="dashboard-record-meta">
            <span>${job.jobReference}</span>
            <span>${job.companyDisplayName || "Company"}</span>
            <span>${job.companyEmail || "Email unavailable"}</span>
          </div>
          <p>${job.description || "No description available."}</p>
          <div class="dashboard-record-stats">
            <span>Interests: ${formatCount(job.metrics?.interestCount || 0)}</span>
            <span>Applications: ${formatCount(job.metrics?.applicationCount || 0)}</span>
            <span>Shortlisted: ${formatCount(job.metrics?.shortlistedCount || 0)}</span>
            <span>Interviews: ${formatCount(job.metrics?.interviewCount || 0)}</span>
          </div>
          ${
            job.identityRiskDetected
              ? `<p><strong>Identity warning:</strong> Public publication may still contain identifying details. Review carefully before publishing.</p>`
              : ""
          }
          <div class="dashboard-record-actions">
            <button class="ghost-button" type="button" data-job-review="approve" data-job-reference="${job.jobReference}">Approve</button>
            <button class="ghost-button" type="button" data-job-review="request_changes" data-job-reference="${job.jobReference}">Request Changes</button>
            <button class="ghost-button" type="button" data-job-review="reject" data-job-reference="${job.jobReference}">Reject</button>
            <button class="ghost-button" type="button" data-job-publish="${job.jobReference}">Publish</button>
            <button class="ghost-button" type="button" data-job-status="paused" data-job-reference="${job.jobReference}">Pause</button>
            <button class="ghost-button" type="button" data-job-status="closed" data-job-reference="${job.jobReference}">Close</button>
            <button class="ghost-button" type="button" data-job-status="archived" data-job-reference="${job.jobReference}">Archive</button>
          </div>
          ${job.publicView ? `<p><strong>Public preview:</strong> ${job.publicView.title} • ${job.publicView.location} • ${job.publicView.workMode}</p>` : ""}
        </article>
      `,
    )
    .join("");

  jobsGrid.querySelectorAll("[data-job-review]").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.getAttribute("data-job-review");
      const jobReference = button.getAttribute("data-job-reference");
      const note = window.prompt(
        "Add an optional review note for the company.",
        "",
      );

      button.disabled = true;

      try {
        const response = await fetch(
          `/api/consultancy/jobs/${encodeURIComponent(jobReference)}/review`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              action,
              note: note || "",
            }),
          },
        );
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            normalizeAuthErrorMessage(result.message, "Unable to update the job review."),
          );
        }

        setLiveStatus(result.message, "live");
        await loadRecruitmentJobs();
        await loadNotifications();
      } catch (error) {
        setLiveStatus(
          normalizeAuthErrorMessage(error.message, "Unable to update the job review."),
          "error",
        );
      } finally {
        button.disabled = false;
      }
    });
  });

  jobsGrid.querySelectorAll("[data-job-publish]").forEach((button) => {
    button.addEventListener("click", async () => {
      const jobReference = button.getAttribute("data-job-publish");
      button.disabled = true;

      try {
        const response = await fetch(
          `/api/consultancy/jobs/${encodeURIComponent(jobReference)}/publish`,
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
            normalizeAuthErrorMessage(result.message, "Unable to publish the job."),
          );
        }

        setLiveStatus(result.message, "live");
        await loadRecruitmentJobs();
        await loadNotifications();
      } catch (error) {
        setLiveStatus(
          normalizeAuthErrorMessage(error.message, "Unable to publish the job."),
          "error",
        );
      } finally {
        button.disabled = false;
      }
    });
  });

  jobsGrid.querySelectorAll("[data-job-status]").forEach((button) => {
    button.addEventListener("click", async () => {
      const status = button.getAttribute("data-job-status");
      const jobReference = button.getAttribute("data-job-reference");
      button.disabled = true;

      try {
        const response = await fetch(
          `/api/consultancy/jobs/${encodeURIComponent(jobReference)}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              status,
            }),
          },
        );
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            normalizeAuthErrorMessage(result.message, "Unable to update the job status."),
          );
        }

        setLiveStatus(result.message, "live");
        await loadRecruitmentJobs();
        await loadNotifications();
      } catch (error) {
        setLiveStatus(
          normalizeAuthErrorMessage(error.message, "Unable to update the job status."),
          "error",
        );
      } finally {
        button.disabled = false;
      }
    });
  });
}

function renderApplicationDetail(detail) {
  const candidateProfile = detail?.candidateProfile;

  if (!detail) {
    return "<p>Full application details are not available right now.</p>";
  }

  return `
    <div class="dashboard-record-qa">
      <strong>Candidate Profile</strong>
      <span>${candidateProfile?.fullName || "Candidate name unavailable"} • ${candidateProfile?.email || "Email unavailable"} • ${candidateProfile?.phone || "Phone unavailable"}</span>
      <span>${candidateProfile?.preferredRole || detail.candidateProfileSnapshot?.preferredRole || "Preferred role unavailable"} • ${candidateProfile?.location || detail.candidateProfileSnapshot?.location || "Location unavailable"}</span>
      <span>${candidateProfile?.skills || detail.candidateProfileSnapshot?.skills || "Skills unavailable"}</span>
    </div>
    ${
      Array.isArray(detail.screeningAnswers) && detail.screeningAnswers.length > 0
        ? `
          <div class="dashboard-record-qa">
            <strong>Screening Answers</strong>
            ${detail.screeningAnswers
              .map(
                (item) =>
                  `<span>${item.question}: ${item.answer}</span>`,
              )
              .join("")}
          </div>
        `
        : ""
    }
    ${
      detail.anonymousProfile
        ? `
          <div class="dashboard-record-qa">
            <strong>Anonymous Summary</strong>
            <span>${detail.anonymousProfile.anonymousCandidateReference}</span>
            <span>${detail.anonymousProfile.consultancyScreeningResult || "Screening result not added"}</span>
            <span>${detail.anonymousProfile.approvedComment || "No company-facing note yet."}</span>
          </div>
        `
        : ""
    }
    ${
      Array.isArray(detail.notes) && detail.notes.length > 0
        ? `
          <div class="dashboard-record-qa">
            <strong>Internal Notes</strong>
            ${detail.notes
              .map((note) => `<span>${formatDateTime(note.createdAt)}: ${note.note}</span>`)
              .join("")}
          </div>
        `
        : ""
    }
    ${
      Array.isArray(detail.interviews) && detail.interviews.length > 0
        ? `
          <div class="dashboard-record-qa">
            <strong>Interviews</strong>
            ${detail.interviews
              .map(
                (interview) =>
                  `<span>${interview.interviewReference} • ${interview.status} • ${formatDateTime(interview.scheduledAt)}</span>`,
              )
              .join("")}
          </div>
        `
        : ""
    }
  `;
}

function renderApplications(applications) {
  if (!applicationsGrid) {
    return;
  }

  const rows = Array.isArray(applications) ? applications : [];

  if (rows.length === 0) {
    applicationsGrid.innerHTML = `
      <article class="dashboard-record-card">
        <h3>No applications matched the current filters</h3>
        <p>Try widening the application search or status filter to load more results.</p>
      </article>
    `;
    return;
  }

  applicationsGrid.innerHTML = rows
    .map(
      (application) => `
        <article class="dashboard-record-card">
          <span class="card-kicker">${application.statusLabel}</span>
          <h3>${application.applicationReference}</h3>
          <div class="dashboard-record-meta">
            <span>${application.jobReference}</span>
            <span>${application.jobTitle}</span>
            <span>${application.companyDisplayName}</span>
          </div>
          <p>${application.preferredRole || "Preferred role unavailable"} • ${application.location || "Location unavailable"} • ${application.candidateType || "Candidate type unavailable"}</p>
          <div class="dashboard-record-stats">
            <span>${application.skills || "Skills unavailable"}</span>
            <span>${application.hasAnonymousSummary ? "Anonymous summary ready" : "Summary pending"}</span>
            <span>${application.sharedWithCompany ? "Shared with company" : "Not shared yet"}</span>
          </div>
          <div class="dashboard-record-actions">
            <button class="ghost-button" type="button" data-view-application="${application.applicationReference}">View Details</button>
            <button class="ghost-button" type="button" data-status-application="${application.applicationReference}" data-next-status="consultancy_shortlisted">Shortlist</button>
            <button class="ghost-button" type="button" data-status-application="${application.applicationReference}" data-next-status="consultancy_rejected">Reject</button>
            <button class="ghost-button" type="button" data-note-application="${application.applicationReference}">Add Note</button>
            <button class="ghost-button" type="button" data-anonymize-application="${application.applicationReference}">Anonymize</button>
            <button class="ghost-button" type="button" data-share-application="${application.applicationReference}">Share</button>
            <button class="ghost-button" type="button" data-interview-application="${application.applicationReference}">Interview</button>
          </div>
          <div class="dashboard-record-detail" id="application-detail-${application.applicationReference}"></div>
        </article>
      `,
    )
    .join("");

  applicationsGrid.querySelectorAll("[data-view-application]").forEach((button) => {
    button.addEventListener("click", async () => {
      const applicationReference = button.getAttribute("data-view-application");
      const detailTarget = document.querySelector(`#application-detail-${applicationReference}`);

      if (!detailTarget) {
        return;
      }

      button.disabled = true;
      detailTarget.innerHTML = "<p>Loading full application details...</p>";

      try {
        if (!consultancyState.applicationDetailCache.has(applicationReference)) {
          const response = await fetch(
            `/api/consultancy/applications/${encodeURIComponent(applicationReference)}`,
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
                "Unable to load the application details.",
              ),
            );
          }

          consultancyState.applicationDetailCache.set(applicationReference, result.application);
        }

        detailTarget.innerHTML = renderApplicationDetail(
          consultancyState.applicationDetailCache.get(applicationReference),
        );
      } catch (error) {
        detailTarget.innerHTML = `<p>${normalizeAuthErrorMessage(error.message, "Unable to load the application details.")}</p>`;
      } finally {
        button.disabled = false;
      }
    });
  });

  applicationsGrid.querySelectorAll("[data-status-application]").forEach((button) => {
    button.addEventListener("click", async () => {
      const applicationReference = button.getAttribute("data-status-application");
      const nextStatus = button.getAttribute("data-next-status");
      const note = window.prompt("Add an optional status update note.", "");

      button.disabled = true;

      try {
        const response = await fetch(
          `/api/consultancy/applications/${encodeURIComponent(applicationReference)}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              status: nextStatus,
              note: note || "",
            }),
          },
        );
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            normalizeAuthErrorMessage(
              result.message,
              "Unable to update the application status.",
            ),
          );
        }

        setLiveStatus(result.message, "live");
        consultancyState.applicationDetailCache.delete(applicationReference);
        await loadApplications();
        await loadNotifications();
      } catch (error) {
        setLiveStatus(
          normalizeAuthErrorMessage(
            error.message,
            "Unable to update the application status.",
          ),
          "error",
        );
      } finally {
        button.disabled = false;
      }
    });
  });

  applicationsGrid.querySelectorAll("[data-note-application]").forEach((button) => {
    button.addEventListener("click", async () => {
      const applicationReference = button.getAttribute("data-note-application");
      const note = window.prompt("Add an internal consultancy note.", "");

      if (!note) {
        return;
      }

      button.disabled = true;

      try {
        const response = await fetch(
          `/api/consultancy/applications/${encodeURIComponent(applicationReference)}/notes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              note,
            }),
          },
        );
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            normalizeAuthErrorMessage(result.message, "Unable to save the note."),
          );
        }

        setLiveStatus(result.message, "live");
        consultancyState.applicationDetailCache.delete(applicationReference);
      } catch (error) {
        setLiveStatus(
          normalizeAuthErrorMessage(error.message, "Unable to save the note."),
          "error",
        );
      } finally {
        button.disabled = false;
      }
    });
  });

  applicationsGrid.querySelectorAll("[data-anonymize-application]").forEach((button) => {
    button.addEventListener("click", async () => {
      const applicationReference = button.getAttribute("data-anonymize-application");
      const screeningResult = window.prompt(
        "Add a consultancy screening result for the anonymous summary.",
        "Strong shortlist",
      );
      const approvedComment = window.prompt(
        "Add a company-facing summary note.",
        "",
      );

      button.disabled = true;

      try {
        const response = await fetch(
          `/api/consultancy/applications/${encodeURIComponent(applicationReference)}/anonymize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              screeningResult: screeningResult || "",
              approvedComment: approvedComment || "",
            }),
          },
        );
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            normalizeAuthErrorMessage(
              result.message,
              "Unable to prepare the anonymous summary.",
            ),
          );
        }

        setLiveStatus(result.message, "live");
        consultancyState.applicationDetailCache.delete(applicationReference);
        await loadApplications();
      } catch (error) {
        setLiveStatus(
          normalizeAuthErrorMessage(
            error.message,
            "Unable to prepare the anonymous summary.",
          ),
          "error",
        );
      } finally {
        button.disabled = false;
      }
    });
  });

  applicationsGrid.querySelectorAll("[data-share-application]").forEach((button) => {
    button.addEventListener("click", async () => {
      const applicationReference = button.getAttribute("data-share-application");
      button.disabled = true;

      try {
        const response = await fetch(
          `/api/consultancy/applications/${encodeURIComponent(applicationReference)}/share`,
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
            normalizeAuthErrorMessage(result.message, "Unable to share the anonymous profile."),
          );
        }

        setLiveStatus(result.message, "live");
        consultancyState.applicationDetailCache.delete(applicationReference);
        await loadApplications();
        await loadNotifications();
      } catch (error) {
        setLiveStatus(
          normalizeAuthErrorMessage(
            error.message,
            "Unable to share the anonymous profile.",
          ),
          "error",
        );
      } finally {
        button.disabled = false;
      }
    });
  });

  applicationsGrid.querySelectorAll("[data-interview-application]").forEach((button) => {
    button.addEventListener("click", async () => {
      const applicationReference = button.getAttribute("data-interview-application");
      const scheduledAt = window.prompt(
        "Enter the interview schedule in YYYY-MM-DDTHH:MM format, or leave blank to start coordination only.",
        "",
      );
      const mode = window.prompt(
        "Enter the interview mode or coordination note.",
        "Consultancy coordination",
      );

      button.disabled = true;

      try {
        const response = await fetch("/api/consultancy/interviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            applicationReference,
            scheduledAt: scheduledAt || "",
            mode: mode || "",
          }),
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            normalizeAuthErrorMessage(
              result.message,
              "Unable to create the interview update.",
            ),
          );
        }

        setLiveStatus(result.message, "live");
        consultancyState.applicationDetailCache.delete(applicationReference);
        await loadApplications();
        await loadNotifications();
      } catch (error) {
        setLiveStatus(
          normalizeAuthErrorMessage(
            error.message,
            "Unable to create the interview update.",
          ),
          "error",
        );
      } finally {
        button.disabled = false;
      }
    });
  });
}

function buildCandidateDashboardUrl() {
  const params = new URLSearchParams(consultancyState.filters.candidate);
  const queryString = params.toString();
  return queryString ? `/api/consultancy/dashboard?${queryString}` : "/api/consultancy/dashboard";
}

function buildJobsUrl() {
  const params = new URLSearchParams(consultancyState.filters.jobs);
  const queryString = params.toString();
  return queryString ? `/api/consultancy/jobs?${queryString}` : "/api/consultancy/jobs";
}

function buildApplicationsUrl() {
  const params = new URLSearchParams(consultancyState.filters.applications);
  const queryString = params.toString();
  return queryString
    ? `/api/consultancy/applications?${queryString}`
    : "/api/consultancy/applications";
}

async function fetchCandidateDashboardSnapshot() {
  const response = await fetch(buildCandidateDashboardUrl(), {
    headers: {
      Accept: "application/json",
    },
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Unable to load the consultancy dashboard.");
  }

  updateCandidateDashboard(result);
  return result;
}

async function loadRecruitmentJobs() {
  const response = await fetch(buildJobsUrl(), {
    headers: {
      Accept: "application/json",
    },
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Unable to load consultancy jobs.");
  }

  updateRecruitmentSummary(result.summary || {}, null);
  renderJobs(result.jobs || []);
  return result;
}

async function loadApplications() {
  const response = await fetch(buildApplicationsUrl(), {
    headers: {
      Accept: "application/json",
    },
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Unable to load consultancy applications.");
  }

  updateRecruitmentSummary(null, result.summary || {});
  renderApplications(result.applications || []);
  return result;
}

async function loadNotifications() {
  const response = await fetch("/api/notifications?limit=10", {
    headers: {
      Accept: "application/json",
    },
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Unable to load notifications.");
  }

  renderNotifications(result.notifications || [], result);
  setNotificationsStatus("", "");
  return result;
}

function startAutoRefresh() {
  if (consultancyState.refreshTimer) {
    return;
  }

  consultancyState.refreshTimer = window.setInterval(async () => {
    try {
      await Promise.all([
        fetchCandidateDashboardSnapshot(),
        loadRecruitmentJobs(),
        loadApplications(),
        loadNotifications(),
      ]);
      setLiveStatus("Consultancy dashboard auto-refresh is active.", "live");
    } catch (error) {
      setLiveStatus(error.message, "error");
    }
  }, 20000);
}

function stopAutoRefresh() {
  if (!consultancyState.refreshTimer) {
    return;
  }

  window.clearInterval(consultancyState.refreshTimer);
  consultancyState.refreshTimer = null;
}

function initializeHeader(session) {
  if (welcomeNode) {
    welcomeNode.textContent = `Welcome back, ${toDisplayName(session)}.`;
  }

  if (emailNode) {
    emailNode.textContent = `Signed in as ${session.email}`;
  }
}

function syncCandidateFiltersFromForm() {
  if (!filterForm) {
    return;
  }

  const formData = new FormData(filterForm);
  consultancyState.filters.candidate = {
    q: String(formData.get("q") || "").trim(),
    candidateType: String(formData.get("candidateType") || "").trim(),
    preferredRole: String(formData.get("preferredRole") || "").trim(),
    location: String(formData.get("location") || "").trim(),
  };
}

function syncJobFiltersFromForm() {
  if (!jobsFilterForm) {
    return;
  }

  const formData = new FormData(jobsFilterForm);
  consultancyState.filters.jobs = {
    q: String(formData.get("q") || "").trim(),
    status: String(formData.get("status") || "").trim(),
    company: String(formData.get("company") || "").trim(),
  };
}

function syncApplicationFiltersFromForm() {
  if (!applicationsFilterForm) {
    return;
  }

  const formData = new FormData(applicationsFilterForm);
  consultancyState.filters.applications = {
    q: String(formData.get("q") || "").trim(),
    status: String(formData.get("status") || "").trim(),
    candidateType: String(formData.get("candidateType") || "").trim(),
    company: String(formData.get("company") || "").trim(),
    job: String(formData.get("job") || "").trim(),
    preferredRole: String(formData.get("preferredRole") || "").trim(),
  };
}

async function initializeDashboard() {
  const session = await window.portalAuth?.requireSession?.({
    requiredRole: "consultancy",
    loginPath: consultancyLoginPath,
  });

  if (!session) {
    return;
  }

  initializeHeader(session);

  filterForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    syncCandidateFiltersFromForm();

    try {
      await fetchCandidateDashboardSnapshot();
      setLiveStatus("Candidate filters applied successfully.", "live");
    } catch (error) {
      setLiveStatus(error.message, "error");
    }
  });

  resetFiltersButton?.addEventListener("click", async () => {
    consultancyState.filters.candidate = {
      q: "",
      candidateType: "",
      preferredRole: "",
      location: "",
    };
    filterForm?.reset();

    try {
      await fetchCandidateDashboardSnapshot();
      setLiveStatus("Candidate filters were cleared.", "live");
    } catch (error) {
      setLiveStatus(error.message, "error");
    }
  });

  jobsFilterForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    syncJobFiltersFromForm();

    try {
      await loadRecruitmentJobs();
      setLiveStatus("Job approval filters applied successfully.", "live");
    } catch (error) {
      setLiveStatus(error.message, "error");
    }
  });

  jobsResetButton?.addEventListener("click", async () => {
    consultancyState.filters.jobs = {
      q: "",
      status: "",
      company: "",
    };
    jobsFilterForm?.reset();

    try {
      await loadRecruitmentJobs();
      setLiveStatus("Job approval filters were cleared.", "live");
    } catch (error) {
      setLiveStatus(error.message, "error");
    }
  });

  applicationsFilterForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    syncApplicationFiltersFromForm();

    try {
      await loadApplications();
      setLiveStatus("Application filters applied successfully.", "live");
    } catch (error) {
      setLiveStatus(error.message, "error");
    }
  });

  applicationsResetButton?.addEventListener("click", async () => {
    consultancyState.filters.applications = {
      q: "",
      status: "",
      candidateType: "",
      company: "",
      job: "",
      preferredRole: "",
    };
    applicationsFilterForm?.reset();

    try {
      await loadApplications();
      setLiveStatus("Application filters were cleared.", "live");
    } catch (error) {
      setLiveStatus(error.message, "error");
    }
  });

  refreshButton?.addEventListener("click", async () => {
    refreshButton.disabled = true;
    refreshButton.textContent = "Refreshing...";

    try {
      await Promise.all([
        fetchCandidateDashboardSnapshot(),
        loadRecruitmentJobs(),
        loadApplications(),
        loadNotifications(),
      ]);
      setLiveStatus("Consultancy dashboard refreshed successfully.", "live");
    } catch (error) {
      setLiveStatus(error.message, "error");
    } finally {
      refreshButton.disabled = false;
      refreshButton.textContent = "Refresh Profiles";
    }
  });

  signOutButton?.addEventListener("click", () => {
    stopAutoRefresh();
    window.portalAuth?.logout?.(consultancyLoginPath);
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
    await Promise.all([
      fetchCandidateDashboardSnapshot(),
      loadRecruitmentJobs(),
      loadApplications(),
      loadNotifications(),
    ]);
    setLiveStatus("Consultancy dashboard loaded. Auto-refresh is active.", "live");
  } catch (error) {
    setLiveStatus(error.message, "error");
  }

  startAutoRefresh();
}

initializeDashboard();
