const loginVariants = {
  company: {
    kicker: "Secure company access",
    heading: "Company Login",
    description:
      "Access your hiring dashboard, post job requirements, and review shared candidates.",
    registerLabel: "Register as Company",
    registerHref: "#register-company",
    infoBadge: "Employer hiring workspace",
    infoTitle: "Find the Right Candidates Faster.",
    infoDescription:
      "Post openings, review shortlisted talent, and manage hiring decisions from one secure portal.",
    features: [
      "Share job openings with consultancies",
      "Review matched candidate profiles",
      "Track interview and hiring status",
      "Collaborate with your recruitment partners",
      "Keep company hiring data secure",
    ],
    signalHeader: "Company hiring focus",
    signalCards: [
      {
        title: "Open Roles",
        description: "Publish requirements quickly",
      },
      {
        title: "Shortlists",
        description: "See relevant candidate profiles",
      },
      {
        title: "Hiring Status",
        description: "Move roles from review to offer",
      },
    ],
  },
  consultancy: {
    kicker: "Recruitment partner workspace",
    heading: "Consultancy Login",
    description:
      "Manage companies, candidates, job requirements, profiles, and hiring progress from one place.",
    registerLabel: "Register as Consultancy",
    registerHref: "#register-consultancy",
    infoBadge: "Recruitment partner operations",
    infoTitle: "Manage Every Client Requirement Smoothly.",
    infoDescription:
      "Handle company requirements, source candidates, and drive recruitment progress across all clients from one platform.",
    features: [
      "Manage multiple company accounts",
      "Source and organize candidate pipelines",
      "Track candidate profiles, interviews, and follow-ups",
      "Coordinate hiring updates with clients",
      "Maintain secure recruitment records",
    ],
    signalHeader: "Consultancy workflow control",
    signalCards: [
      {
        title: "Clients",
        description: "Manage active company accounts",
      },
      {
        title: "Candidates",
        description: "Keep candidate profiles ready",
      },
      {
        title: "Delivery",
        description: "Track submissions and closures",
      },
    ],
  },
  candidate: {
    kicker: "Career profile access",
    heading: "Candidate Login",
    description:
      "Update your profile and track your job application status.",
    registerLabel: "Create Here",
    registerHref: "/candidate/register/",
    infoBadge: "Career opportunity dashboard",
    infoTitle: "Find Better Job Opportunities.",
    infoDescription:
      "Build your profile and stay updated on every application and interview step.",
    features: [
      "Create and update your candidate profile",
      "Share your profile details clearly",
      "Apply for relevant job opportunities",
      "Track interview and application progress",
      "Stay ready for the right next role",
    ],
    signalHeader: "Candidate job search support",
    signalCards: [
      {
        title: "Profile",
        description: "Showcase your skills clearly",
      },
      {
        title: "Applications",
        description: "Track every role you apply for",
      },
      {
        title: "Interviews",
        description: "Stay prepared for next steps",
      },
    ],
  },
};

const tabs = document.querySelectorAll(".login-type");
const kicker = document.querySelector("#login-kicker");
const heading = document.querySelector("#login-heading");
const description = document.querySelector("#login-description");
const submitButton = document.querySelector("#login-button");
const registerLink = document.querySelector("#register-link");
const authModePrefix = document.querySelector("#auth-mode-prefix");
const infoBadge = document.querySelector("#info-badge");
const infoTitle = document.querySelector("#info-title");
const infoDescription = document.querySelector("#info-description");
const featureItems = Array.from(document.querySelectorAll(".feature-list li"));
const signalHeaderText = document.querySelector("#signal-header-text");
const signalTitles = [
  document.querySelector("#signal-title-1"),
  document.querySelector("#signal-title-2"),
  document.querySelector("#signal-title-3"),
];
const signalDescriptions = [
  document.querySelector("#signal-description-1"),
  document.querySelector("#signal-description-2"),
  document.querySelector("#signal-description-3"),
];
const logoImage = document.querySelector("#portal-logo");
const logoPlaceholder = document.querySelector("#logo-placeholder");
const authForm = document.querySelector("#auth-form");
const emailInput = document.querySelector("#email");
const otpGroup = document.querySelector("#otp-group");
const otpInput = document.querySelector("#otp");
const passwordGroup = document.querySelector("#password-group");
const passwordInput = document.querySelector("#password");
const passwordToggle = document.querySelector("#password-toggle");
const passwordLabel = document.querySelector("#password-label");
const confirmPasswordGroup = document.querySelector("#confirm-password-group");
const confirmPasswordInput = document.querySelector("#confirm-password");
const confirmPasswordToggle = document.querySelector("#confirm-password-toggle");
const confirmPasswordLabel = document.querySelector("#confirm-password-label");
const forgotLink = document.querySelector("#forgot-link");
const formStatus = document.querySelector("#form-status");
const logoCandidates = [
  "./assets/logo/portal-logo.svg",
  "./assets/logo/portal-logo.png",
  "./assets/logo/portal-logo.webp",
  "./assets/logo/portal-logo.jpg",
  "./assets/logo/portal-logo.jpeg",
  "./assets/logo/IMG-20251220-WA0001.jpg.jpeg",
];
const companyLandingPath = "/company/";
const consultancyLandingPath = "/consultancy/";
const candidateLandingPath = "/candidate/";
const candidateRegisterPath = "/candidate/register/";
const candidateConsentPath = "/candidate/consent/";
const initialUrlParams = new URLSearchParams(window.location.search);
const authStorageKey = "portalLogin";

let activeUserType = "company";
let authMode = "login";
const passwordToggleButtons = [
  { button: passwordToggle, input: passwordInput, label: "password" },
  { button: confirmPasswordToggle, input: confirmPasswordInput, label: "confirm password" },
];

function normalizeAuthErrorMessage(message, fallbackMessage) {
  const text = String(message || "").trim();
  return text || fallbackMessage;
}

function updatePasswordToggleButton(button, input, label) {
  if (!button || !input) {
    return;
  }

  const isVisible = input.type === "text";
  button.textContent = isVisible ? "Hide" : "Show";
  button.setAttribute("aria-pressed", String(isVisible));
  button.setAttribute("aria-label", `${isVisible ? "Hide" : "Show"} ${label}`);
}

function resetPasswordVisibility() {
  passwordToggleButtons.forEach(({ button, input, label }) => {
    if (!input) {
      return;
    }

    input.type = "password";
    updatePasswordToggleButton(button, input, label);
  });
}

function initializeLogo(candidateIndex = 0) {
  if (!logoImage || !logoPlaceholder) {
    return;
  }

  if (candidateIndex >= logoCandidates.length) {
    logoImage.hidden = true;
    logoPlaceholder.hidden = false;
    return;
  }

  const candidatePath = logoCandidates[candidateIndex];
  const probe = new Image();

  probe.onload = () => {
    logoImage.src = `${candidatePath}?v=${Date.now()}`;
    logoImage.hidden = false;
    logoPlaceholder.hidden = true;
  };

  probe.onerror = () => {
    initializeLogo(candidateIndex + 1);
  };

  probe.src = `${candidatePath}?v=${Date.now()}`;
}

function clearStatus() {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = "";
  formStatus.classList.remove("is-success", "is-error");
}

function setStatus(message, kind) {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = message;
  formStatus.classList.remove("is-success", "is-error");

  if (kind === "success") {
    formStatus.classList.add("is-success");
  }

  if (kind === "error") {
    formStatus.classList.add("is-error");
  }
}

function resetAuthFields({ keepEmail = false } = {}) {
  const savedEmail = keepEmail ? emailInput.value.trim() : "";

  authForm.reset();
  clearStatus();
  resetPasswordVisibility();

  if (keepEmail) {
    emailInput.value = savedEmail;
  }

  otpInput.value = "";
  confirmPasswordInput.value = "";
}

function getRoleLabel(type = activeUserType) {
  const selected = loginVariants[type];

  return selected ? selected.heading.replace(" Login", "") : "";
}

function getAuthModePresentation(selected) {
  const roleLabel = getRoleLabel(activeUserType);

  if (authMode === "register") {
    return {
      kicker: `New ${roleLabel.toLowerCase()} access`,
      heading: `Register ${roleLabel}`,
      description: `Create login credentials for the ${roleLabel.toLowerCase()} portal so you can access the workspace securely.`,
    };
  }

  if (authMode === "forgot") {
    return {
      kicker: "Password recovery",
      heading: `Reset ${roleLabel} Password`,
      description:
        "Enter the email used for this login type. If the account exists, we will send a 6-digit OTP to that email address.",
    };
  }

  if (authMode === "reset") {
    return {
      kicker: "Verify OTP",
      heading: `Reset ${roleLabel} Password`,
      description:
        "Enter the OTP sent to your email address and choose a new password to finish the reset.",
    };
  }

  return {
    kicker: selected.kicker,
    heading: selected.heading,
    description: selected.description,
  };
}

function updateAuthModeUi() {
  const selected = loginVariants[activeUserType];

  if (!selected) {
    return;
  }

  const roleLabel = getRoleLabel(activeUserType);
  const presentation = getAuthModePresentation(selected);
  const isRegisterMode = authMode === "register";
  const isForgotMode = authMode === "forgot";
  const isResetMode = authMode === "reset";
  const isLoginMode = authMode === "login";

  kicker.textContent = presentation.kicker;
  heading.textContent = presentation.heading;
  description.textContent = presentation.description;

  otpGroup.hidden = !isResetMode;
  otpInput.required = isResetMode;

  passwordGroup.hidden = isForgotMode;
  passwordInput.required = !isForgotMode;
  passwordInput.setAttribute(
    "autocomplete",
    isLoginMode ? "current-password" : "new-password",
  );
  passwordInput.placeholder = isResetMode
    ? "Enter your new password"
    : isRegisterMode
      ? "Create your password"
      : "Enter your password";
  passwordLabel.textContent = isResetMode ? "New Password" : "Password";

  confirmPasswordGroup.hidden = !(isRegisterMode || isResetMode);
  confirmPasswordInput.required = isRegisterMode || isResetMode;
  confirmPasswordInput.placeholder = isResetMode
    ? "Re-enter your new password"
    : "Re-enter your password";
  confirmPasswordLabel.textContent = isResetMode
    ? "Confirm New Password"
    : "Confirm Password";

  forgotLink.hidden = !isLoginMode;

  if (isRegisterMode) {
    submitButton.textContent = `Register as ${roleLabel}`;
    authModePrefix.textContent = "Already have credentials?";
    registerLink.textContent = `Back to ${roleLabel} Login`;
    registerLink.setAttribute("href", "#back-to-login");
  } else if (isForgotMode) {
    submitButton.textContent = "Send OTP";
    authModePrefix.textContent = "Remembered your password?";
    registerLink.textContent = `Back to ${roleLabel} Login`;
    registerLink.setAttribute("href", "#back-to-login");
  } else if (isResetMode) {
    submitButton.textContent = "Verify OTP and Reset Password";
    authModePrefix.textContent = "Need a new OTP?";
    registerLink.textContent = "Send another code";
    registerLink.setAttribute("href", "#send-otp-again");
  } else {
    submitButton.textContent = `Login as ${roleLabel}`;
    authModePrefix.textContent = "New user?";
    registerLink.textContent = selected.registerLabel;
    registerLink.setAttribute("href", selected.registerHref);
  }

  registerLink.setAttribute("aria-label", registerLink.textContent);
}

function updateInfoPanel(type) {
  const selected = loginVariants[type];

  if (!selected) {
    return;
  }

  infoBadge.textContent = selected.infoBadge;
  infoTitle.textContent = selected.infoTitle;
  infoDescription.textContent = selected.infoDescription;
  signalHeaderText.textContent = selected.signalHeader;

  featureItems.forEach((item, index) => {
    item.textContent = selected.features[index] ?? "";
  });

  selected.signalCards.forEach((card, index) => {
    if (signalTitles[index]) {
      signalTitles[index].textContent = card.title;
    }

    if (signalDescriptions[index]) {
      signalDescriptions[index].textContent = card.description;
    }
  });
}

function setActiveLogin(type) {
  const selected = loginVariants[type];

  if (!selected) {
    return;
  }

  activeUserType = type;
  authMode = "login";
  resetAuthFields();

  tabs.forEach((tab) => {
    const isSelected = tab.dataset.userType === type;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
  });

  updateInfoPanel(type);
  updateAuthModeUi();
}

function persistLoginSession(result) {
  if (!result?.credential) {
    return null;
  }

  const session = window.portalAuth?.normalizeCredentialToSession
    ? window.portalAuth.normalizeCredentialToSession(result.credential, result.session)
    : {
        id: result.credential.id || "",
        role: result.credential.role,
        name: result.credential.name || "",
        email: result.credential.email,
        consent: result.credential.consent === true,
        consentAcceptedAt: result.credential.consentAcceptedAt || null,
        consentVersion: result.credential.consentVersion || null,
        consentSource: result.credential.consentSource || null,
        loggedInAt: new Date().toISOString(),
      };

  return window.portalAuth?.saveSession ? window.portalAuth.saveSession(session) : session;
}

function redirectAfterLogin(result) {
  const role = result?.credential?.role;

  if (!role) {
    return false;
  }

  const session = persistLoginSession(result);

  if (role === "candidate") {
    window.location.href = session?.consent === true
      ? candidateLandingPath
      : candidateConsentPath;
    return true;
  }

  if (role === "company") {
    window.location.href = companyLandingPath;
    return true;
  }

  if (role === "consultancy") {
    window.location.href = consultancyLandingPath;
    return true;
  }

  return false;
}

function getSubmitEndpoint() {
  if (authMode === "register") {
    return "/api/auth/register";
  }

  if (authMode === "forgot") {
    return "/api/auth/forgot-password";
  }

  if (authMode === "reset") {
    return "/api/auth/reset-password";
  }

  return "/api/auth/login";
}

function getSubmitLoadingLabel() {
  if (authMode === "register") {
    return "Creating...";
  }

  if (authMode === "forgot") {
    return "Sending OTP...";
  }

  if (authMode === "reset") {
    return "Resetting...";
  }

  return "Checking...";
}

function buildAuthPayload() {
  const payload = {
    role: activeUserType,
    email: emailInput.value.trim(),
  };

  if (authMode === "login") {
    payload.password = passwordInput.value;
    return payload;
  }

  if (authMode === "register") {
    payload.password = passwordInput.value;
    payload.confirmPassword = confirmPasswordInput.value;
    return payload;
  }

  if (authMode === "reset") {
    payload.otp = otpInput.value.trim();
    payload.password = passwordInput.value;
    payload.confirmPassword = confirmPasswordInput.value;
  }

  return payload;
}

async function submitAuthForm(event) {
  event.preventDefault();
  clearStatus();

  const payload = buildAuthPayload();

  submitButton.disabled = true;
  submitButton.textContent = getSubmitLoadingLabel();

  try {
    const response = await fetch(getSubmitEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        normalizeAuthErrorMessage(result.message, "Something went wrong."),
      );
    }

    if (authMode === "register") {
      resetAuthFields();
      authMode = "login";
      updateAuthModeUi();
      emailInput.value = payload.email;
      setStatus(`${result.message} You can log in now.`, "success");
      passwordInput.focus();
      return;
    }

    if (authMode === "forgot") {
      authMode = "reset";
      resetAuthFields({ keepEmail: true });
      updateAuthModeUi();
      setStatus(result.message, "success");
      otpInput.focus();
      return;
    }

    if (authMode === "reset") {
      authMode = "login";
      resetAuthFields({ keepEmail: true });
      updateAuthModeUi();
      setStatus(result.message, "success");
      passwordInput.focus();
      return;
    }

    passwordInput.value = "";
    confirmPasswordInput.value = "";
    otpInput.value = "";

    if (redirectAfterLogin(result)) {
      return;
    }

    persistLoginSession(result);
    setStatus(result.message, "success");
  } catch (error) {
    setStatus(
      normalizeAuthErrorMessage(error.message, "Something went wrong."),
      "error",
    );
  } finally {
    submitButton.disabled = false;
    updateAuthModeUi();
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveLogin(tab.dataset.userType);
  });
});

forgotLink.addEventListener("click", (event) => {
  event.preventDefault();
  authMode = "forgot";
  resetAuthFields({ keepEmail: true });
  updateAuthModeUi();
  emailInput.focus();
});

registerLink.addEventListener("click", (event) => {
  event.preventDefault();
  clearStatus();

  if (authMode === "login") {
    if (activeUserType === "candidate") {
      window.location.href = candidateRegisterPath;
      return;
    }

    authMode = "register";
    resetAuthFields({ keepEmail: true });
    updateAuthModeUi();
    passwordInput.focus();
    return;
  }

  if (authMode === "reset") {
    authMode = "forgot";
    resetAuthFields({ keepEmail: true });
    updateAuthModeUi();
    emailInput.focus();
    return;
  }

  authMode = "login";
  resetAuthFields({ keepEmail: true });
  updateAuthModeUi();
  passwordInput.focus();
});

authForm.addEventListener("submit", submitAuthForm);

passwordToggleButtons.forEach(({ button, input, label }) => {
  button?.addEventListener("click", () => {
    if (!input) {
      return;
    }

    input.type = input.type === "password" ? "text" : "password";
    updatePasswordToggleButton(button, input, label);
  });
});

function initializeAuthFromUrl() {
  const userType = initialUrlParams.get("userType");
  const safeUserType = loginVariants[userType] ? userType : "company";

  setActiveLogin(safeUserType);

  const email = initialUrlParams.get("email");

  if (email) {
    emailInput.value = email;
  }

  if (safeUserType === "candidate" && initialUrlParams.get("registered") === "1") {
    setStatus("Candidate account created successfully. Please log in.", "success");
  }

  if (safeUserType === "candidate" && initialUrlParams.get("consent") === "declined") {
    setStatus(
      "Candidate consent is required before we can store your profile for job opportunities.",
      "error",
    );
  }

  if ([...initialUrlParams.keys()].length > 0) {
    const cleanUrl = `${window.location.pathname}${window.location.hash}`;
    window.history.replaceState({}, "", cleanUrl);
  }

  resetPasswordVisibility();
}

async function recoverActiveSession() {
  if (!window.portalAuth?.fetchCurrentSession) {
    return;
  }

  const session = await window.portalAuth.fetchCurrentSession().catch(() => null);

  if (!session) {
    return;
  }

  if (session.role === "candidate") {
    window.location.replace(session.consent === true ? candidateLandingPath : candidateConsentPath);
    return;
  }

  if (session.role === "company") {
    window.location.replace(companyLandingPath);
    return;
  }

  if (session.role === "consultancy") {
    window.location.replace(consultancyLandingPath);
  }
}

initializeLogo();
initializeAuthFromUrl();
recoverActiveSession();
