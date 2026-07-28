const registerForm = document.querySelector("#candidate-register-form");
const statusNode = document.querySelector("#register-status");
const submitButton = document.querySelector("#register-submit-button");

function normalizeAuthErrorMessage(message, fallbackMessage) {
  const text = String(message || "").trim();
  return text || fallbackMessage;
}

function setStatus(message, kind) {
  if (!statusNode) {
    return;
  }

  statusNode.textContent = message;
  statusNode.classList.remove("is-success", "is-error");

  if (kind === "success") {
    statusNode.classList.add("is-success");
  }

  if (kind === "error") {
    statusNode.classList.add("is-error");
  }
}

async function submitRegisterForm(event) {
  event.preventDefault();
  setStatus("", "");

  const formData = new FormData(registerForm);
  const payload = {
    role: "candidate",
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
    confirmPassword: String(formData.get("confirmPassword") || ""),
  };

  submitButton.disabled = true;
  submitButton.textContent = "Creating Account...";

  try {
    const response = await fetch("/api/auth/register", {
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
          "Unable to create candidate account.",
        ),
      );
    }

    setStatus("Candidate account created. Redirecting to candidate login...", "success");

    window.setTimeout(() => {
      window.location.href = `/?userType=candidate&registered=1&email=${encodeURIComponent(payload.email)}`;
    }, 800);
  } catch (error) {
    setStatus(
      normalizeAuthErrorMessage(
        error.message,
        "Unable to create candidate account.",
      ),
      "error",
    );
    submitButton.disabled = false;
    submitButton.textContent = "Create Candidate Account";
  }
}

registerForm.addEventListener("submit", submitRegisterForm);
