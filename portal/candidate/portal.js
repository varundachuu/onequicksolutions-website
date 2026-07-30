const candidateAudiences = {
  fresher: {
    greeting: "Welcome back. Let's build your first strong candidate profile.",
    heroTitle: "Start your career with a page that feels ready.",
    heroCopy:
      "Fill your details, explore fresher-friendly roles, and begin applying to opportunities that match your education, skills, and goals.",
    metricOneTitle: "Profile Steps",
    metricOneCopy: "Add education, projects, certifications, and skills",
    metricTwoTitle: "Search Focus",
    metricTwoCopy: "Find internships, trainee roles, and entry-level openings",
    metricThreeTitle: "First Action",
    metricThreeCopy: "Complete your profile and begin your first applications",
    focusTitle: "Build a strong first impression.",
    focusCopy:
      "A complete fresher profile helps recruiters understand your potential even if your experience is still growing.",
  },
  experienced: {
    greeting: "Welcome back. Let's prepare your next career move with clarity.",
    heroTitle: "Change jobs with focus, not pressure.",
    heroCopy:
      "Keep your experience, current role, notice period, and preferred opportunities updated so you can move toward stronger roles with confidence.",
    metricOneTitle: "Profile Steps",
    metricOneCopy: "Add experience highlights, tools, domain knowledge, and impact",
    metricTwoTitle: "Search Focus",
    metricTwoCopy: "Target better roles, stronger teams, and long-term growth",
    metricThreeTitle: "First Action",
    metricThreeCopy: "Update your profile before applying for your next switch",
    focusTitle: "Shape a smarter job change.",
    focusCopy:
      "Your profile should clearly show the value you bring so role changes feel intentional and well-timed.",
  },
};
const candidateLoginPath = "/?userType=candidate";
const candidateConsentPath = "/candidate/consent/";
const candidateDashboardPath = "/candidate/";
const candidateApplyPath = "/candidate/apply/";
const authStorageKey = "portalLogin";
const candidateDraftKey = "candidateApplicationDraft";
const candidateProfileFlashKey = "candidateProfileFlash";
const applicationTypeContent = {
  fresher: {
    label: "Fresher",
    selectedTitle: "Fresher form selected. Build your first strong profile.",
    selectedCopy:
      "Share education, projects, internships, certifications, and the entry-level role you want to start with.",
    draftMessage:
      "Fresher draft saved on this device. You can continue editing it later from the same browser.",
    submitMessage:
      "Fresher application details are ready to be stored in MongoDB and shown in the dashboard quick view.",
  },
  experienced: {
    label: "Experienced",
    selectedTitle: "Experienced form selected. Show your work impact clearly.",
    selectedCopy:
      "Share role history, total experience, notice period, compensation, and the type of switch you want to make next.",
    draftMessage:
      "Experienced draft saved on this device. You can continue editing it later from the same browser.",
    submitMessage:
      "Experienced application details are ready to be stored in MongoDB and shown in the dashboard quick view.",
  },
};

function getSavedSession() {
  if (window.portalAuth?.readSession) {
    return window.portalAuth.readSession();
  }

  return null;
}

function clearSavedSession() {
  window.portalAuth?.clearSession?.();
}

function setSavedSession(session) {
  window.portalAuth?.saveSession?.(session);
}

function requireCandidateSession() {
  const session = getSavedSession();

  if (!session || session.role !== "candidate") {
    clearSavedSession();
    window.location.replace(candidateLoginPath);
    return null;
  }

  return session;
}

function hasCandidateConsent(session) {
  return session?.consent === true || Boolean(session?.consentAcceptedAt);
}

function requireCandidateConsent(session) {
  if (hasCandidateConsent(session)) {
    return true;
  }

  window.location.replace(candidateConsentPath);
  return false;
}

function safeQuery(id) {
  return document.querySelector(id);
}

function normalizeAuthErrorMessage(message, fallbackMessage) {
  const text = String(message || "").trim();
  return text || fallbackMessage;
}

function setCandidateProfileFlash(message, kind = "success") {
  sessionStorage.setItem(
    candidateProfileFlashKey,
    JSON.stringify({
      message,
      kind,
      createdAt: new Date().toISOString(),
    }),
  );
}

function consumeCandidateProfileFlash() {
  const rawFlash = sessionStorage.getItem(candidateProfileFlashKey);

  if (!rawFlash) {
    return null;
  }

  sessionStorage.removeItem(candidateProfileFlashKey);

  try {
    return JSON.parse(rawFlash);
  } catch (_error) {
    return null;
  }
}

function formatPortalDateTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatCount(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value || 0));
}

function getProfileValueByPath(profile, path) {
  return String(path || "")
    .split(".")
    .filter(Boolean)
    .reduce((currentValue, key) => currentValue?.[key], profile);
}

function getProfileFormValue(profile, fieldName) {
  if (!profile || !fieldName) {
    return "";
  }

  if (profile[fieldName] !== undefined && profile[fieldName] !== null) {
    return profile[fieldName];
  }

  if (profile.fresherDetails && profile.fresherDetails[fieldName] !== undefined) {
    return profile.fresherDetails[fieldName];
  }

  if (profile.experiencedDetails && profile.experiencedDetails[fieldName] !== undefined) {
    return profile.experiencedDetails[fieldName];
  }

  return "";
}

function formatProfileFieldValue(fieldName, value) {
  if (fieldName === "candidateType") {
    return applicationTypeContent[String(value || "").trim().toLowerCase()]?.label || "Not set";
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Not provided";
  }

  const text = String(value ?? "").trim();
  return text || "Not provided";
}

function setNodeState(node, message, kind = "") {
  if (!node) {
    return;
  }

  node.hidden = false;
  node.textContent = message;
  node.classList.remove("is-success", "is-error");

  if (kind === "success") {
    node.classList.add("is-success");
  }

  if (kind === "error") {
    node.classList.add("is-error");
  }
}

function syncCandidateSessionProfile(profile) {
  const savedSession = getSavedSession();

  if (!savedSession || !profile) {
    return;
  }

  setSavedSession({
    ...savedSession,
    name: profile.fullName || savedSession.name,
  });
}

function fillCandidateGreeting(session) {
  const greetingNode = safeQuery("#personal-greeting");

  if (!greetingNode) {
    return;
  }
  if (session?.name) {
    greetingNode.textContent = `Welcome ${session.name}. Let's keep your profile and career plans updated.`;
    return;
  }

  if (session?.email) {
    greetingNode.textContent = `Welcome ${session.email}. Let's keep your profile and career plans updated.`;
  }
}

function fillCandidateHeaderProfile(session) {
  const nameNode = safeQuery("#candidate-profile-name");
  const emailNode = safeQuery("#candidate-profile-email");
  const avatarNode = safeQuery("#candidate-profile-avatar");
  const sidebarNameNode = safeQuery("#candidate-sidebar-name");
  const sidebarAvatarNode = safeQuery("#candidate-sidebar-avatar");
  const sidebarTagNode = safeQuery("#candidate-sidebar-tag");
  const consentNode = safeQuery("#candidate-profile-consent");
  const displayName = String(session?.name || "")
    .trim();
  const displayEmail = String(session?.email || "")
    .trim()
    .toLowerCase();
  const resolvedName = displayName || (displayEmail ? displayEmail.split("@")[0] : "Candidate");
  const initials = resolvedName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "C";

  if (nameNode) {
    nameNode.textContent = resolvedName;
  }

  if (emailNode) {
    emailNode.textContent = displayEmail || "candidate@onequicksolutions.com";
  }

  if (avatarNode) {
    avatarNode.textContent = initials;
  }

  if (sidebarNameNode) {
    sidebarNameNode.textContent = "Candidate desk";
  }

  if (sidebarAvatarNode) {
    sidebarAvatarNode.textContent = initials;
  }

  if (sidebarTagNode) {
    sidebarTagNode.textContent = session?.consent === true || session?.consentAcceptedAt
      ? "Verified access"
      : "Access pending";
  }

  if (consentNode) {
    consentNode.textContent = session?.consent === true || session?.consentAcceptedAt
      ? "Consent verified"
      : "Consent pending";
  }
}

function initializeConsentToggle() {
  const consentButton = safeQuery("#candidate-profile-consent");

  if (!consentButton) {
    return;
  }

  const session = getSavedSession();
  const hasConsent = session?.consent === true || Boolean(session?.consentAcceptedAt);

  consentButton.addEventListener("click", () => {
    window.location.assign(candidateConsentPath);
  });

  if (!hasConsent) {
    consentButton.textContent = "Consent pending";
    return;
  }

  const labels = ["Consent verified", "View consent"];
  let activeLabelIndex = 0;

  consentButton.textContent = labels[activeLabelIndex];

  window.setInterval(() => {
    activeLabelIndex = activeLabelIndex === 0 ? 1 : 0;
    consentButton.textContent = labels[activeLabelIndex];
  }, 3000);
}

function setAudience(audience, session = getSavedSession()) {
  const content = candidateAudiences[audience];

  if (!content) {
    return;
  }

  const audienceButtons = document.querySelectorAll("[data-audience]");

  audienceButtons.forEach((button) => {
    const isActive = button.dataset.audience === audience;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  const mapping = {
    "#hero-title": content.heroTitle,
    "#hero-copy": content.heroCopy,
    "#metric-one-title": content.metricOneTitle,
    "#metric-one-copy": content.metricOneCopy,
    "#metric-two-title": content.metricTwoTitle,
    "#metric-two-copy": content.metricTwoCopy,
    "#metric-three-title": content.metricThreeTitle,
    "#metric-three-copy": content.metricThreeCopy,
    "#focus-title": content.focusTitle,
    "#focus-copy": content.focusCopy,
  };

  Object.entries(mapping).forEach(([selector, value]) => {
    const node = safeQuery(selector);

    if (node) {
      node.textContent = value;
    }
  });

  const greetingNode = safeQuery("#personal-greeting");

  if (greetingNode) {
    greetingNode.textContent = session?.name
      ? `Welcome ${session.name}. ${content.greeting.replace(/^Welcome back\. /, "")}`
      : session?.email
        ? `Welcome ${session.email}. ${content.greeting.replace(/^Welcome back\. /, "")}`
        : content.greeting;
  }
}

function initializeAudienceSwitch() {
  const audienceButtons = document.querySelectorAll("[data-audience]");

  if (audienceButtons.length === 0) {
    return;
  }

  audienceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setAudience(button.dataset.audience);
    });
  });

  setAudience("fresher");
}

function initializeSignOut() {
  const signOutButtons = document.querySelectorAll(
    "#candidate-sign-out-button, [data-candidate-sign-out]",
  );

  if (signOutButtons.length === 0) {
    return;
  }

  signOutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      window.portalAuth?.logout?.(candidateLoginPath);
    });
  });
}

function initializeProfileFormLinks() {
  const profileFormLinks = document.querySelectorAll("[data-open-profile-form]");

  if (profileFormLinks.length === 0) {
    return;
  }

  profileFormLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.assign(candidateApplyPath);
    });
  });
}

function initializeCandidateProfileDashboard() {
  const session = getSavedSession();
  const profileDashboardShell = safeQuery("#profile-dashboard-shell");
  const profileEmptyState = safeQuery("#profile-empty-state");
  const profileDashboardStatus = safeQuery("#profile-dashboard-status");
  const profileVisibilityBadge = safeQuery("#profile-visibility-badge");
  const profileSummaryTitle = safeQuery("#profile-summary-title");
  const profileSummaryCopy = safeQuery("#profile-summary-copy");
  const editProfileButton = safeQuery("#edit-profile-button");
  const toggleProfileStatusButton = safeQuery("#toggle-profile-status-button");
  const deleteProfileButton = safeQuery("#delete-profile-button");
  const profileEditShell = safeQuery("#profile-edit-shell");
  const profileEditForm = safeQuery("#profile-edit-form");
  const profileEditStatus = safeQuery("#profile-edit-status");
  const profileEditNote = safeQuery("#profile-edit-note");
  const profileEditTypeInput = safeQuery("#profile-edit-type-input");
  const profileEditTypeNote = safeQuery("#profile-edit-type-note");
  const profileEditFieldsShell = safeQuery("#profile-edit-fields-shell");
  const cancelEditProfileButton = safeQuery("#cancel-edit-profile-button");
  const profileEditTypeButtons = document.querySelectorAll("[data-profile-edit-type]");
  const profileEditSections = document.querySelectorAll("[data-profile-edit-section]");
  const fresherQuickView = safeQuery("#fresher-quick-view");
  const experiencedQuickView = safeQuery("#experienced-quick-view");

  if (
    !profileDashboardShell ||
    !profileEmptyState ||
    !profileDashboardStatus ||
    !profileEditShell ||
    !profileEditForm ||
    !profileEditStatus ||
    !profileEditNote ||
    !profileEditTypeInput ||
    !profileEditTypeNote ||
    !profileEditFieldsShell ||
    !editProfileButton ||
    !toggleProfileStatusButton ||
    !deleteProfileButton ||
    !cancelEditProfileButton
  ) {
    return;
  }

  const quickViewFields = Array.from(document.querySelectorAll("[data-profile-field]"));
  const editFields = Array.from(profileEditForm.elements).filter((element) => element.name);
  let currentProfile = null;
  let activeEditType = "";

  function setDashboardStatus(message, kind = "") {
    setNodeState(profileDashboardStatus, message, kind);
  }

  function setEditStatus(message, kind = "") {
    setNodeState(profileEditStatus, message, kind);
    profileEditStatus.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  function setProfileEditType(type, { preserveNote = false } = {}) {
    const normalizedType = String(type || "").trim().toLowerCase();
    const content = applicationTypeContent[normalizedType];
    activeEditType = content ? normalizedType : "";

    profileEditTypeInput.value = activeEditType;

    profileEditTypeButtons.forEach((button) => {
      const isActive = button.dataset.profileEditType === activeEditType;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    profileEditSections.forEach((section) => {
      const isActiveSection = section.dataset.profileEditSection === activeEditType;
      section.hidden = !isActiveSection;

      section.querySelectorAll("input, textarea, select").forEach((field) => {
        field.disabled = !isActiveSection;
      });
    });

    profileEditFieldsShell.hidden = !content;

    if (!preserveNote) {
      if (content) {
        setNodeState(
          profileEditTypeNote,
          `${content.label} edit mode selected. Update the fields below and save your changes.`,
          "success",
        );
      } else {
        setNodeState(
          profileEditTypeNote,
          "Choose whether this saved profile should be handled as fresher or experienced.",
        );
      }
    }
  }

  function populateProfileQuickView(profile) {
    quickViewFields.forEach((node) => {
      node.textContent = formatProfileFieldValue(
        node.dataset.profileField,
        getProfileValueByPath(profile, node.dataset.profileField),
      );
    });

    if (profileVisibilityBadge) {
      profileVisibilityBadge.textContent = profile.isVisibleForHiring
        ? "Visible for hiring"
        : "Profile deactivated";
      profileVisibilityBadge.classList.toggle("is-inactive", !profile.isVisibleForHiring);
    }

    if (profileSummaryTitle) {
      profileSummaryTitle.textContent =
        profile.candidateType === "experienced"
          ? "Experienced candidate quick view"
          : "Fresher candidate quick view";
    }

    if (profileSummaryCopy) {
      profileSummaryCopy.textContent = profile.isVisibleForHiring
        ? `Profile saved on ${formatPortalDateTime(profile.createdAt)} and last updated on ${formatPortalDateTime(profile.updatedAt)}. This profile is currently visible for hiring.`
        : `Profile saved on ${formatPortalDateTime(profile.createdAt)} and last updated on ${formatPortalDateTime(profile.updatedAt)}. It is currently hidden from hiring.`;
    }

    if (fresherQuickView) {
      fresherQuickView.hidden = profile.candidateType !== "fresher";
    }

    if (experiencedQuickView) {
      experiencedQuickView.hidden = profile.candidateType !== "experienced";
    }

    toggleProfileStatusButton.textContent = profile.isVisibleForHiring
      ? "Deactivate Profile"
      : "Activate Profile";
  }

  function populateProfileEditForm(profile) {
    editFields.forEach((field) => {
      field.value = getProfileFormValue(profile, field.name);
    });

    setProfileEditType(profile.candidateType, { preserveNote: true });
    profileEditStatus.hidden = true;
  }

  function showProfileState(profile) {
    profileEmptyState.hidden = true;
    profileDashboardShell.hidden = false;
    populateProfileQuickView(profile);
    populateProfileEditForm(profile);
    setAudience(profile.candidateType, getSavedSession());
  }

  function showEmptyState(message = "") {
    profileDashboardShell.hidden = true;
    profileEditShell.hidden = true;
    profileEmptyState.hidden = false;
    currentProfile = null;

    if (message) {
      setDashboardStatus(message);
    }
  }

  async function loadProfile() {
    const response = await fetch(
      `/api/candidate/profile?email=${encodeURIComponent(session?.email || "")}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    const result = await response.json().catch(() => ({}));

    if (response.status === 404) {
      showEmptyState(result.message || "Save your profile once to unlock the quick view dashboard.");
      return null;
    }

    if (!response.ok) {
      throw new Error(result.message || "Unable to load your candidate profile right now.");
    }

    currentProfile = result.profile;
    syncCandidateSessionProfile(currentProfile);
    fillCandidateGreeting(getSavedSession());
    showProfileState(currentProfile);
    return currentProfile;
  }

  profileEditTypeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setProfileEditType(button.dataset.profileEditType);
    });
  });

  editProfileButton.addEventListener("click", () => {
    if (!currentProfile) {
      return;
    }

    populateProfileEditForm(currentProfile);
    profileEditShell.hidden = false;
    setDashboardStatus("Edit mode opened. Save changes here to overwrite your saved profile.");
    profileEditShell.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  cancelEditProfileButton.addEventListener("click", () => {
    profileEditShell.hidden = true;
    profileEditStatus.hidden = true;
  });

  profileEditForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!activeEditType || !applicationTypeContent[activeEditType]) {
      setEditStatus(
        "Choose whether this saved profile should be handled as fresher or experienced before saving.",
        "error",
      );
      return;
    }

    const payload = {};

    editFields.forEach((field) => {
      if (field.disabled) {
        return;
      }

      payload[field.name] = field.value;
    });

    payload.email = session?.email || payload.email;

    const saveButton = profileEditForm.querySelector('button[type="submit"]');

    if (saveButton) {
      saveButton.disabled = true;
      saveButton.textContent = "Saving...";
    }

    setEditStatus("Saving your updated profile now. Please wait.");

    try {
      const response = await fetch("/api/candidate/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          normalizeAuthErrorMessage(
            result.message,
            "Unable to save your updated candidate profile right now.",
          ),
        );
      }

      currentProfile = result.profile;
      syncCandidateSessionProfile(currentProfile);
      fillCandidateGreeting(getSavedSession());
      showProfileState(currentProfile);
      profileEditShell.hidden = true;
      setDashboardStatus(
        `${result.message} Your quick view has been refreshed with the latest details.`,
        "success",
      );
    } catch (error) {
      setEditStatus(
        normalizeAuthErrorMessage(
          error.message,
          "Unable to save your updated candidate profile right now.",
        ),
        "error",
      );
    } finally {
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.textContent = "Save Changes";
      }
    }
  });

  toggleProfileStatusButton.addEventListener("click", async () => {
    if (!currentProfile) {
      return;
    }

    const nextVisibility = !currentProfile.isVisibleForHiring;
    const confirmMessage = nextVisibility
      ? "Do you want to activate this candidate profile for hiring again?"
      : "Do you want to deactivate this candidate profile so it is hidden from hiring?";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    toggleProfileStatusButton.disabled = true;

    try {
      const response = await fetch("/api/candidate/profile/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.email,
          isVisibleForHiring: nextVisibility,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          normalizeAuthErrorMessage(
            result.message,
            "Unable to update your candidate profile visibility right now.",
          ),
        );
      }

      currentProfile = result.profile;
      showProfileState(currentProfile);
      profileEditShell.hidden = true;
      setDashboardStatus(result.message, "success");
    } catch (error) {
      setDashboardStatus(
        normalizeAuthErrorMessage(
          error.message,
          "Unable to update your candidate profile visibility right now.",
        ),
        "error",
      );
    } finally {
      toggleProfileStatusButton.disabled = false;
    }
  });

  deleteProfileButton.addEventListener("click", async () => {
    if (!currentProfile) {
      return;
    }

    const isConfirmed = window.confirm(
      "Do you want to delete this profile completely? This will remove your candidate login and the saved profile from MongoDB.",
    );

    if (!isConfirmed) {
      return;
    }

    deleteProfileButton.disabled = true;

    try {
      const response = await fetch("/api/candidate/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.email,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          normalizeAuthErrorMessage(
            result.message,
            "Unable to delete your candidate profile right now.",
          ),
        );
      }

      localStorage.removeItem(candidateDraftKey);
      clearSavedSession();
      window.alert("Your candidate profile and login have been deleted successfully.");
      window.location.replace(`${candidateLoginPath}&profile=deleted`);
    } catch (error) {
      deleteProfileButton.disabled = false;
      setDashboardStatus(
        normalizeAuthErrorMessage(
          error.message,
          "Unable to delete your candidate profile right now.",
        ),
        "error",
      );
    }
  });

  loadProfile()
    .then(() => {
      const flash = consumeCandidateProfileFlash();

      if (flash?.message) {
        setDashboardStatus(flash.message, flash.kind || "success");
      }
    })
    .catch((error) => {
      showEmptyState(
        normalizeAuthErrorMessage(
          error.message,
          "Unable to load your candidate profile right now.",
        ),
      );
      setDashboardStatus(
        normalizeAuthErrorMessage(
          error.message,
          "Unable to load your candidate profile right now.",
        ),
        "error",
      );
    });
}

function initializeDraftForm() {
  const session = getSavedSession();
  const form = safeQuery("#application-form-element");
  const draftNote = safeQuery("#draft-note");
  const submitStatus = safeQuery("#submit-status");
  const submissionModal = safeQuery("#submission-modal");
  const submissionModalCopy = safeQuery("#submission-modal-copy");
  const submissionModalDoneButton = safeQuery("#submission-modal-done-button");
  const saveDraftButton = safeQuery("#save-draft-button");
  const submitButton = form?.querySelector('button[type="submit"]');
  const applicationTypeInput = safeQuery("#candidate-type-input");
  const applicationTypeButtons = document.querySelectorAll("[data-application-type]");
  const applicationFieldsShell = safeQuery("#application-fields-shell");
  const applicationTypeNote = safeQuery("#application-type-note");
  const applicationSelectedTitle = safeQuery("#application-selected-title");
  const applicationSelectedCopy = safeQuery("#application-selected-copy");
  const applicationTypeSections = document.querySelectorAll("[data-application-section]");

  if (!form || !draftNote || !saveDraftButton || !submitStatus) {
    return;
  }

  const fields = Array.from(form.elements).filter((element) => element.name);
  let activeApplicationType = "";

  function setNoteState(node, message, kind = "") {
    setNodeState(node, message, kind);
  }

  function setSubmitStatus(message, kind = "") {
    submitStatus.hidden = false;
    setNoteState(submitStatus, message, kind);
    submitStatus.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  function closeSubmissionModal() {
    if (!submissionModal) {
      return;
    }

    submissionModal.hidden = true;
    document.body.style.overflow = "";
  }

  function openSubmissionModal(profile) {
    if (!submissionModal || !submissionModalDoneButton) {
      window.location.href = `${candidateDashboardPath}#profile-dashboard`;
      return;
    }

    if (submissionModalCopy) {
      submissionModalCopy.textContent =
        `Your candidate details for ${profile?.email || session?.email || "this account"} are stored for job applications. Keep your resume updated and ready. Once you are shortlisted, our HR team will contact you by phone and email to collect the resume and continue the process.`;
    }

    submissionModal.hidden = false;
    document.body.style.overflow = "hidden";

    submissionModalDoneButton.focus();
  }

  function setApplicationType(type, { preserveNote = false } = {}) {
    const content = applicationTypeContent[type];
    activeApplicationType = content ? type : "";

    if (applicationTypeInput) {
      applicationTypeInput.value = activeApplicationType;
    }

    applicationTypeButtons.forEach((button) => {
      const isActive = button.dataset.applicationType === activeApplicationType;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    applicationTypeSections.forEach((section) => {
      const isActiveSection = section.dataset.applicationSection === activeApplicationType;
      section.hidden = !isActiveSection;

      section
        .querySelectorAll("input, textarea, select")
        .forEach((field) => {
          field.disabled = !isActiveSection;
        });
    });

    if (applicationFieldsShell) {
      applicationFieldsShell.hidden = !content;
    }

    if (applicationSelectedTitle) {
      applicationSelectedTitle.textContent = content
        ? content.selectedTitle
        : "Complete your profile details.";
    }

    if (applicationSelectedCopy) {
      applicationSelectedCopy.textContent = content
        ? content.selectedCopy
        : "Choose a candidate type above to continue with the right form.";
    }

    if (!preserveNote) {
      if (content) {
        setNoteState(
          applicationTypeNote,
          `${content.label} form selected. Continue with the fields below.`,
          "success",
        );
      } else {
        setNoteState(
          applicationTypeNote,
          "Select your candidate type to open the correct application form.",
        );
      }
    }
  }

  function ensureApplicationTypeSelected() {
    if (activeApplicationType && applicationTypeContent[activeApplicationType]) {
      return true;
    }

    setNoteState(
      applicationTypeNote,
      "Choose whether you are a fresher or an experienced candidate before continuing.",
      "error",
    );
    return false;
  }

  const savedDraft = localStorage.getItem(candidateDraftKey);

  if (session) {
    const fullNameField = form.elements.namedItem("fullName");
    const emailField = form.elements.namedItem("email");

    if (fullNameField && "value" in fullNameField && !String(fullNameField.value || "").trim()) {
      fullNameField.value = session.name || "";
    }

    if (emailField && "value" in emailField && !String(emailField.value || "").trim()) {
      emailField.value = session.email || "";
    }
  }

  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft);
      fields.forEach((field) => {
        if (draft[field.name] !== undefined && draft[field.name] !== null) {
          field.value = draft[field.name];
        }
      });
      const savedType = String(draft.candidateType || "").trim().toLowerCase();
      setApplicationType(savedType, { preserveNote: true });
      setNoteState(
        draftNote,
        savedType && applicationTypeContent[savedType]
          ? `${applicationTypeContent[savedType].label} draft loaded. You can continue from where you left off.`
          : "Saved draft loaded. You can continue editing from where you left off.",
        "success",
      );
    } catch (_error) {
      localStorage.removeItem(candidateDraftKey);
    }
  }

  applicationTypeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setApplicationType(button.dataset.applicationType);
    });
  });

  setApplicationType(String(applicationTypeInput?.value || "").trim().toLowerCase(), {
    preserveNote: Boolean(savedDraft),
  });

  saveDraftButton.addEventListener("click", () => {
    if (!ensureApplicationTypeSelected()) {
      return;
    }

    const draft = {};

    fields.forEach((field) => {
      draft[field.name] = field.value;
    });

    localStorage.setItem(candidateDraftKey, JSON.stringify(draft));
    setNoteState(
      draftNote,
      applicationTypeContent[activeApplicationType]?.draftMessage ||
        "Draft saved on this device.",
      "success",
    );
    submitStatus.hidden = true;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!ensureApplicationTypeSelected()) {
      return;
    }

    const payload = {};

    fields.forEach((field) => {
      if (field.disabled) {
        return;
      }

      payload[field.name] = field.value;
    });

    if (session?.email && payload.email && payload.email.trim().toLowerCase() !== session.email) {
      setSubmitStatus(
        "Use the same email address as your candidate login to submit your profile details.",
        "error",
      );
      setNoteState(
        draftNote,
        "Use the same email address as your candidate login to submit your profile details.",
        "error",
      );
      return;
    }

    if (session?.email && !payload.email) {
      payload.email = session.email;
    }

    if (session?.name && !payload.fullName) {
      payload.fullName = session.name;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    setSubmitStatus(
      "Submitting your candidate profile now. Please wait while we save it to our database.",
    );

    try {
      const response = await fetch("/api/candidate/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          normalizeAuthErrorMessage(
            result.message,
            "Unable to save candidate details right now.",
          ),
        );
      }

      localStorage.removeItem(candidateDraftKey);
      setCandidateProfileFlash(
        `${result.message} Your dashboard is ready with the latest quick view details.`,
        "success",
      );
      setSubmitStatus(
        `${result.message} Candidate email: ${result.profile.email}. Saved in ${result.storage.databaseName}.${result.storage.collectionName}. Redirecting you to the dashboard now.`,
        "success",
      );
      setNoteState(
        draftNote,
        `${result.message} Stored in ${result.storage.databaseName}.${result.storage.collectionName}.`,
        "success",
      );
      openSubmissionModal(result.profile);
    } catch (error) {
      setSubmitStatus(
        normalizeAuthErrorMessage(
          error.message,
          "Unable to save candidate details right now.",
        ),
        "error",
      );
      setNoteState(
        draftNote,
        normalizeAuthErrorMessage(
          error.message,
          "Unable to save candidate details right now.",
        ),
        "error",
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Application";
      }
    }
  });

  submissionModalDoneButton?.addEventListener("click", () => {
    closeSubmissionModal();
    window.location.href = `${candidateDashboardPath}#profile-dashboard`;
  });

  // Browsers can restore the last-open success modal from cached page state.
  // Always reopen the candidate form in a clean state when this page loads again.
  closeSubmissionModal();
  window.addEventListener("pageshow", closeSubmissionModal);
}

function formatJobDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

function initializeCandidateRecruitmentWorkspace() {
  const jobFilterForm = safeQuery("#candidate-job-filter-form");
  const jobFilterResetButton = safeQuery("#candidate-job-filter-reset-button");
  const jobStatusNode = safeQuery("#candidate-job-status");
  const jobResultsGrid = safeQuery("#candidate-job-results-grid");
  const jobEmptyState = safeQuery("#candidate-job-empty-state");
  const applicationResultsGrid = safeQuery("#candidate-application-results-grid");
  const applicationEmptyState = safeQuery("#candidate-application-empty-state");
  const applicationTotalCountNode = safeQuery("#candidate-application-total-count");
  const applicationActiveCountNode = safeQuery("#candidate-application-active-count");
  const applicationInterviewCountNode = safeQuery("#candidate-application-interview-count");
  const notificationList = safeQuery("#candidate-notification-list");
  const notificationsSummaryNode = safeQuery("#candidate-notifications-summary");
  const markAllNotificationsButton = safeQuery("#candidate-mark-all-notifications-button");
  const notificationsStatusNode = safeQuery("#candidate-notifications-status");

  if (
    !jobFilterForm ||
    !jobResultsGrid ||
    !jobEmptyState ||
    !applicationResultsGrid ||
    !applicationEmptyState ||
    !notificationList
  ) {
    return;
  }

  const workspaceState = {
    applications: [],
    jobs: [],
  };

  function setJobStatus(message, kind = "") {
    setNodeState(jobStatusNode, message, kind);
  }

  function setNotificationsStatus(message, kind = "") {
    setNodeState(notificationsStatusNode, message, kind);
  }

  function updateNotificationsSummary(unreadCount = 0, totalCount = 0) {
    if (notificationsSummaryNode) {
      notificationsSummaryNode.textContent =
        totalCount > 0
          ? `${formatCount(unreadCount)} unread of ${formatCount(totalCount)} recruitment updates`
          : "No recruitment updates yet.";
    }

    if (markAllNotificationsButton) {
      markAllNotificationsButton.disabled = unreadCount === 0;
    }
  }

  function renderJobCards(jobs) {
    if (!Array.isArray(jobs) || jobs.length === 0) {
      jobResultsGrid.innerHTML = "";
      jobEmptyState.hidden = false;
      return;
    }

    jobEmptyState.hidden = true;
    jobResultsGrid.innerHTML = jobs
      .map((job) => {
        const tagItems = [
          ...(job.requiredSkills || []).slice(0, 4).map((skill) => `<span>${skill}</span>`),
          ...(job.isApplied
            ? [
                `<span>${job.applicationReference ? `Applied as ${job.applicationReference}` : "Applied"}</span>`,
              ]
            : []),
          ...(!job.isApplied && job.isInterestRegistered
            ? ["<span>Interest registered</span>"]
            : []),
        ].join("");

        return `
          <article class="dashboard-record-card">
            <span class="section-kicker">Anonymous Job</span>
            <h3>${job.title}</h3>
            <div class="dashboard-record-meta">
              <span>${job.jobReference}</span>
              <span>${job.location || "Location not shared"}</span>
              <span>${job.workMode || "Work mode not shared"}</span>
              <span>${job.employmentType || "Employment type not shared"}</span>
            </div>
            <p class="dashboard-record-description">${job.description || "No description shared yet."}</p>
            ${tagItems ? `<div class="dashboard-record-tags">${tagItems}</div>` : ""}
          </article>
        `;
      })
      .join("");
  }

  function renderApplications(applications) {
    workspaceState.applications = Array.isArray(applications) ? applications : [];

    if (applicationTotalCountNode) {
      applicationTotalCountNode.textContent = String(workspaceState.applications.length);
    }

    if (applicationActiveCountNode) {
      applicationActiveCountNode.textContent = String(
        workspaceState.applications.filter(
          (application) =>
            !["consultancy_rejected", "company_rejected", "not_selected", "selected", "joined", "application_withdrawn", "job_closed"].includes(
              application.currentStatus,
            ),
        ).length,
      );
    }

    if (applicationInterviewCountNode) {
      applicationInterviewCountNode.textContent = String(
        workspaceState.applications.filter((application) =>
          ["company_selected_for_interview", "interview_coordination", "interview_scheduled", "interview_completed"].includes(
            application.currentStatus,
          ),
        ).length,
      );
    }

    if (workspaceState.applications.length === 0) {
      applicationResultsGrid.innerHTML = "";
      applicationEmptyState.hidden = false;
      return;
    }

    applicationEmptyState.hidden = true;
    applicationResultsGrid.innerHTML = workspaceState.applications
      .map((application) => {
        const canWithdraw = ![
          "consultancy_rejected",
          "company_rejected",
          "not_selected",
          "selected",
          "joined",
          "application_withdrawn",
          "job_closed",
        ].includes(application.currentStatus);

        return `
          <article class="dashboard-record-card">
            <span class="section-kicker">Application Status</span>
            <h3>${application.job?.title || application.jobReference}</h3>
            <div class="dashboard-record-meta">
              <span>${application.applicationReference}</span>
              <span>${application.statusLabel}</span>
              <span>${formatJobDate(application.appliedAt)}</span>
            </div>
            <p class="dashboard-record-description">
              ${application.job?.location || "Location shared on the job card"} •
              ${application.job?.workMode || "Work mode shared on the job card"} •
              ${application.job?.employmentType || "Employment type shared on the job card"}
            </p>
            ${
              canWithdraw
                ? `
                  <div class="dashboard-record-actions">
                    <button
                      class="ghost-button large-button"
                      type="button"
                      data-withdraw-application="${application.applicationReference}"
                    >
                      Withdraw Application
                    </button>
                  </div>
                `
                : ""
            }
          </article>
        `;
      })
      .join("");

    applicationResultsGrid
      .querySelectorAll("[data-withdraw-application]")
      .forEach((button) => {
        button.addEventListener("click", async () => {
          const applicationReference = button.getAttribute("data-withdraw-application");

          if (!window.confirm("Do you want to withdraw this application?")) {
            return;
          }

          button.disabled = true;

          try {
            const response = await fetch(
              `/api/candidate/applications/${encodeURIComponent(applicationReference)}/withdraw`,
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
                normalizeAuthErrorMessage(
                  result.message,
                  "Unable to withdraw the application right now.",
                ),
              );
            }

            setJobStatus(result.message, "success");
            await Promise.all([loadApplications(), loadNotifications(), loadJobs()]);
          } catch (error) {
            setJobStatus(
              normalizeAuthErrorMessage(
                error.message,
                "Unable to withdraw the application right now.",
              ),
              "error",
            );
          } finally {
            button.disabled = false;
          }
        });
      });
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
    const rows = Array.isArray(notifications) ? notifications : [];
    updateNotificationsSummary(meta.unreadCount || 0, meta.totalCount || rows.length);

    if (rows.length === 0) {
      notificationList.innerHTML = `
        <article class="dashboard-record-card">
          <h3>No notifications yet</h3>
          <p class="dashboard-record-description">
            Consultancy updates for your interests, applications, and interview progress will appear here.
          </p>
        </article>
      `;
      return;
    }

    notificationList.innerHTML = rows
      .map(
        (notification) => `
          <article class="dashboard-record-card ${notification.isRead ? "is-read" : ""}">
            <span class="section-kicker">${notification.type.replace(/_/g, " ")}</span>
            <h3>${notification.title}</h3>
            <p class="dashboard-record-description">${notification.message}</p>
            <div class="dashboard-record-meta">
              <span class="dashboard-record-badge ${notification.isRead ? "" : "dashboard-record-badge--unread"}">
                ${notification.isRead ? "Read" : "Unread"}
              </span>
              <span>${notification.entityReference || "Recruitment update"}</span>
              <span>${formatPortalDateTime(notification.createdAt)}</span>
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

    notificationList.querySelectorAll("[data-mark-notification]").forEach((button) => {
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

  function buildJobListUrl() {
    const params = new URLSearchParams(new FormData(jobFilterForm));
    const query = params.toString();
    return query ? `/api/candidate/jobs?${query}` : "/api/candidate/jobs";
  }

  async function loadJobs() {
    const response = await fetch(buildJobListUrl(), {
      headers: {
        Accept: "application/json",
      },
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        normalizeAuthErrorMessage(result.message, "Unable to load anonymous jobs right now."),
      );
    }

    workspaceState.jobs = result.jobs || [];
    renderJobCards(workspaceState.jobs);
  }

  async function loadApplications() {
    const response = await fetch("/api/candidate/applications", {
      headers: {
        Accept: "application/json",
      },
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        normalizeAuthErrorMessage(
          result.message,
          "Unable to load your applications right now.",
        ),
      );
    }

    renderApplications(result.applications || []);
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
  }

  jobFilterForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      await loadJobs();
      setJobStatus("Candidate job filters applied successfully.", "success");
    } catch (error) {
      setJobStatus(
        normalizeAuthErrorMessage(error.message, "Unable to load anonymous jobs right now."),
        "error",
      );
    }
  });

  jobFilterResetButton?.addEventListener("click", async () => {
    jobFilterForm.reset();

    try {
      await loadJobs();
      setJobStatus("Candidate job filters were cleared.", "success");
    } catch (error) {
      setJobStatus(
        normalizeAuthErrorMessage(error.message, "Unable to load anonymous jobs right now."),
        "error",
      );
    }
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

  Promise.all([loadJobs(), loadApplications(), loadNotifications()]).catch((error) => {
    setJobStatus(
      normalizeAuthErrorMessage(error.message, "Unable to load candidate recruitment data."),
      "error",
    );
  });
}

async function initializeCandidatePortal() {
  const session = await window.portalAuth?.requireSession?.({
    requiredRole: "candidate",
    loginPath: candidateLoginPath,
    requireConsent: true,
    consentPath: candidateConsentPath,
  });

  if (!session) {
    return;
  }

  fillCandidateGreeting(session);
  fillCandidateHeaderProfile(session);
  setSavedSession(session);
  initializeSignOut();
  initializeConsentToggle();
  initializeProfileFormLinks();
  initializeAudienceSwitch();
  initializeCandidateProfileDashboard();
  initializeDraftForm();
  initializeCandidateRecruitmentWorkspace();
}

initializeCandidatePortal();
