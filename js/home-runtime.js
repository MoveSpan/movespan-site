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



  /* MoveSpan Home Header Actions */

  function getStoredEmail() {
    const directKeys = ["email", "userEmail", "user_email"];

    for (const key of directKeys) {
      const value = cleanString(localStorage.getItem(key));
      if (value && value.includes("@")) return value;
    }

    const objectKeys = [
      "movespanProfile",
      "movespanUser",
      "userProfile",
      "profile",
      "onboardingData",
      "user"
    ];

    for (const key of objectKeys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const value = JSON.parse(raw);
        const email = cleanString(
          value?.email
          || value?.user?.email
          || value?.profile?.email
          || value?.account?.email
        );

        if (email && email.includes("@")) return email;
      } catch {
        // Игнорируем старые или невалидные данные.
      }
    }

    return "";
  }

  function renderAccountSummary() {
    const nameElement = document.getElementById("home-account-name");
    const emailElement = document.getElementById("home-account-email");
    const avatarElement = document.getElementById("home-account-avatar");

    const firstName = getUserFirstName();
    const email = getStoredEmail();

    if (nameElement) {
      nameElement.textContent = firstName || "MoveSpan Member";
    }

    if (emailElement) {
      emailElement.textContent = email || "Complete your profile";
    }

    if (avatarElement) {
      avatarElement.textContent = firstName
        ? firstName.charAt(0).toUpperCase()
        : "M";
    }
  }

  function closeHomeSheets() {
    document.querySelectorAll(".home-sheet").forEach((sheet) => {
      sheet.hidden = true;
    });

    const backdrop = document.getElementById("home-sheet-backdrop");

    if (backdrop) {
      backdrop.hidden = true;
    }

    document.body.classList.remove("home-sheet-open");
  }

  function openHomeSheet(sheetId) {
    closeHomeSheets();

    const sheet = document.getElementById(sheetId);
    const backdrop = document.getElementById("home-sheet-backdrop");

    if (!sheet || !backdrop) return;

    renderAccountSummary();

    backdrop.hidden = false;
    sheet.hidden = false;
    document.body.classList.add("home-sheet-open");

    const closeButton = sheet.querySelector("[data-close-home-sheet]");
    closeButton?.focus();
  }

  function initializeHeaderActions() {
    const notificationsButton = document.getElementById(
      "home-notifications-button"
    );

    const menuButton = document.getElementById(
      "home-menu-button"
    );

    const backdrop = document.getElementById(
      "home-sheet-backdrop"
    );

    notificationsButton?.addEventListener("click", () => {
      openHomeSheet("notifications-sheet");
    });

    menuButton?.addEventListener("click", () => {
      openHomeSheet("quick-menu-sheet");
    });

    backdrop?.addEventListener("click", closeHomeSheets);

    document
      .querySelectorAll("[data-close-home-sheet]")
      .forEach((button) => {
        button.addEventListener("click", closeHomeSheets);
      });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeHomeSheets();
      }
    });

    document
      .querySelectorAll("[data-home-menu-action]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const action = button.dataset.homeMenuAction;

          if (action === "signout") {
            const confirmed = window.confirm(
              "Sign out of MoveSpan on this device?"
            );

            if (!confirmed) return;

            [
              "firstName",
              "first_name",
              "userName",
              "user_name",
              "name",
              "email",
              "userEmail",
              "user_email"
            ].forEach((key) => localStorage.removeItem(key));

            closeHomeSheets();
            window.location.reload();
            return;
          }

          window.alert(
            action.charAt(0).toUpperCase()
            + action.slice(1)
            + " screen is coming next."
          );
        });
      });
  }

  window.MoveSpanHome = Object.freeze({
    renderGreeting,
    getUserFirstName
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      renderGreeting();
      initializeHeaderActions();
    }, {

      once: true
    });
  } else {
    renderGreeting();
    initializeHeaderActions();
  }
})();
