(() => {
  const authStorageKey = "portalLogin";

  function readSession() {
    const rawSession =
      window.sessionStorage.getItem(authStorageKey) ||
      window.localStorage.getItem(authStorageKey);

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession);
    } catch (_error) {
      clearSession();
      return null;
    }
  }

  function saveSession(session) {
    const serialized = JSON.stringify(session);
    window.sessionStorage.setItem(authStorageKey, serialized);
    window.localStorage.setItem(authStorageKey, serialized);
    return session;
  }

  function clearSession() {
    window.sessionStorage.removeItem(authStorageKey);
    window.localStorage.removeItem(authStorageKey);
  }

  function normalizeCredentialToSession(credential, serverSession = null) {
    return {
      id: credential?.id || "",
      role: credential?.role || "",
      name: credential?.name || "",
      email: credential?.email || "",
      consent: credential?.consent === true,
      consentAcceptedAt: credential?.consentAcceptedAt || null,
      consentVersion: credential?.consentVersion || null,
      consentSource: credential?.consentSource || null,
      expiresAt: serverSession?.expiresAt || null,
      lastSeenAt: serverSession?.lastSeenAt || null,
      syncedAt: new Date().toISOString(),
    };
  }

  async function fetchCurrentSession(requiredRole = null) {
    const response = await window.fetch("/api/auth/session", {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      clearSession();
      return null;
    }

    const result = await response.json().catch(() => null);

    if (!result?.credential) {
      clearSession();
      return null;
    }

    const nextSession = normalizeCredentialToSession(result.credential, result.session);

    if (requiredRole && nextSession.role !== requiredRole) {
      clearSession();
      return null;
    }

    saveSession(nextSession);
    return nextSession;
  }

  async function requireSession({
    requiredRole = null,
    loginPath = "/",
    requireConsent = false,
    consentPath = "/candidate/consent/",
  } = {}) {
    const session = await fetchCurrentSession(requiredRole);

    if (!session) {
      window.location.replace(loginPath);
      return null;
    }

    if (requireConsent && requiredRole === "candidate" && session.consent !== true) {
      window.location.replace(consentPath);
      return null;
    }

    return session;
  }

  async function logout(redirectPath = "/") {
    try {
      await window.fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });
    } catch (_error) {
      // Clear local state even if the network request fails.
    } finally {
      clearSession();
      window.location.replace(redirectPath);
    }
  }

  window.portalAuth = {
    authStorageKey,
    clearSession,
    fetchCurrentSession,
    logout,
    normalizeCredentialToSession,
    readSession,
    requireSession,
    saveSession,
  };
})();
