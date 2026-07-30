const candidateLoginPath = "/?userType=candidate";
const candidateLandingPath = "/candidate/";
const authStorageKey = "portalLogin";

const approveButton = document.querySelector("#candidate-approve-button");
const declineButton = document.querySelector("#candidate-decline-button");
const reviewButton = document.querySelector("#candidate-review-button");
const consentHomeLink = document.querySelector("#candidate-consent-home-link");
const consentStatus = document.querySelector("#consent-status");
const consentName = document.querySelector("#consent-name");
const consentEmail = document.querySelector("#consent-email");
const consentGreeting = document.querySelector("#consent-greeting");

function getSavedSession() {
  return window.portalAuth?.readSession?.() || null;
}

function saveSession(session) {
  window.portalAuth?.saveSession?.(session);
}

function clearSavedSession() {
  window.portalAuth?.clearSession?.();
}

function normalizeAuthErrorMessage(message, fallbackMessage) {
  const text = String(message || "").trim();
  return text || fallbackMessage;
}

function setStatus(message, kind) {
  if (!consentStatus) {
    return;
  }

  consentStatus.textContent = message;
  consentStatus.classList.remove("is-success", "is-error");

  if (kind === "success") {
    consentStatus.classList.add("is-success");
  }

  if (kind === "error") {
    consentStatus.classList.add("is-error");
  }
}

function requireCandidateSession() {
  const session = getSavedSession();

  if (!session || session.role !== "candidate" || !session.email) {
    clearSavedSession();
    window.location.replace(candidateLoginPath);
    return null;
  }

  return session;
}

function fillCandidateDetails(session) {
  if (consentName) {
    consentName.textContent = session.name || "Candidate";
  }

  if (consentEmail) {
    consentEmail.textContent = session.email;
  }

  if (consentGreeting) {
    consentGreeting.textContent = session.name
      ? `${session.name}, please review and approve candidate data storage before continuing.`
      : `Please review and approve candidate data storage for ${session.email} before continuing.`;
  }
}

function showApprovedConsentView(session) {
  if (consentGreeting) {
    consentGreeting.textContent = session.name
      ? `${session.name}, your candidate consent is already recorded. You can review it here and return to the dashboard when ready.`
      : `Your candidate consent is already recorded for ${session.email}. You can review it here and return to the dashboard when ready.`;
  }

  if (consentHomeLink) {
    consentHomeLink.href = candidateLandingPath;
    consentHomeLink.textContent = "Back to Dashboard";
  }

  if (declineButton) {
    declineButton.hidden = true;
  }

  if (approveButton) {
    approveButton.hidden = true;
    approveButton.disabled = true;
  }

  if (reviewButton) {
    reviewButton.textContent = "Return to Dashboard";
    reviewButton.addEventListener("click", () => {
      window.location.assign(candidateLandingPath);
    });
  }

  setStatus(
    "Consent has already been approved for this candidate account. Review the notice and return to the dashboard when ready.",
    "success",
  );
}

async function submitCandidateConsent(session) {
  if (!approveButton) {
    return;
  }

  approveButton.disabled = true;
  approveButton.textContent = "Saving Consent...";
  setStatus("Recording your approval securely...", "");

  try {
    const response = await fetch("/api/auth/candidate-consent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "candidate",
        email: session.email,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        normalizeAuthErrorMessage(
          result.message,
          "Unable to save candidate consent right now.",
        ),
      );
    }

    const nextSession = {
      ...session,
      id: result?.credential?.id || session.id || "",
      name: result?.credential?.name || session.name || "",
      consent: result?.credential?.consent === true,
      consentAcceptedAt: result?.credential?.consentAcceptedAt || new Date().toISOString(),
      consentVersion: result?.credential?.consentVersion || null,
      consentSource: result?.credential?.consentSource || null,
    };

    saveSession(nextSession);
    setStatus(`${result.message} Redirecting to your candidate workspace...`, "success");

    window.setTimeout(() => {
      window.location.replace(candidateLandingPath);
    }, 800);
  } catch (error) {
    setStatus(
      normalizeAuthErrorMessage(
        error.message,
        "Unable to save candidate consent right now.",
      ),
      "error",
    );
    approveButton.disabled = false;
    approveButton.textContent = "I Agree and Continue";
  }
}

async function initializeConsentPage() {
  const session = await window.portalAuth?.requireSession?.({
    requiredRole: "candidate",
    loginPath: candidateLoginPath,
  });

  if (!session) {
    return;
  }

  fillCandidateDetails(session);

  const alreadyConsented = session.consent === true || Boolean(session.consentAcceptedAt);

  if (alreadyConsented) {
    showApprovedConsentView(session);
    return;
  }

  approveButton?.addEventListener("click", () => {
    submitCandidateConsent(session);
  });

  declineButton?.addEventListener("click", () => {
    window.portalAuth?.logout?.("/?userType=candidate&consent=declined");
  });

  reviewButton?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

initializeConsentPage();
