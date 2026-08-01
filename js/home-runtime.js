(function () {
  "use strict";

  const DEFAULT_NAME = "";

  function cleanString(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function extractFirstName(value) {
    const name = cleanString(value);
    return name ? name.split(/\s+/)[0] : "";
  }

  function findNameInObject(value, depth = 0) {
    if (!value || typeof value !== "object" || depth > 4) {
      return "";
    }

    const directCandidates = [
      value.firstName,
      value.first_name,
      value.name,
      value.fullName,
      value.full_name,
      value.displayName
    ];

    for (const candidate of directCandidates) {
      const name = extractFirstName(candidate);
      if (name) return name;
    }

    const nestedKeys = [
      "profile",
      "user",
      "account",
      "onboarding",
      "onboardingData",
      "personalInfo",
      "personal"
    ];

    for (const key of nestedKeys) {
      const result = findNameInObject(value[key], depth + 1);
      if (result) return result;
    }

    return "";
  }

  function getUserFirstName() {
    const directKeys = [
      "firstName",
      "first_name",
      "userName",
      "user_name",
      "name"
    ];

    for (const key of directKeys) {
      const name = extractFirstName(localStorage.getItem(key));
      if (name) return name;
    }

    const objectKeys = [
      "movespanProfile",
      "movespanUser",
      "userProfile",
      "profile",
      "onboardingData",
      "movespan_onboarding",
      "user"
    ];

    for (const key of objectKeys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const name = findNameInObject(JSON.parse(raw));
        if (name) return name;
      } catch {
        // Игнорируем невалидные или старые значения localStorage.
      }
    }

    return DEFAULT_NAME;
  }

  function getGreeting(hour) {
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    }

    if (hour >= 12 && hour < 18) {
      return "Good afternoon";
    }

    return "Good evening";
  }

  function renderGreeting() {
    const greetingElement = document.getElementById("home-greeting");

    if (!greetingElement) {
      console.warn("MoveSpan: #home-greeting was not found.");
      return;
    }

    const greeting = getGreeting(new Date().getHours());
    const firstName = getUserFirstName();

    greetingElement.textContent = firstName
      ? `${greeting}, ${firstName}!`
      : `${greeting}!`;

    greetingElement.dataset.period = greeting
      .replace("Good ", "")
      .toLowerCase();
  }

  window.MoveSpanHome = Object.freeze({
    renderGreeting,
    getUserFirstName
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderGreeting, {
      once: true
    });
  } else {
    renderGreeting();
  }
})();
