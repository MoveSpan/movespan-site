(function () {
  "use strict";

  const PROFILE_KEYS = [
    "movespan_profile",
    "mwProfile",
    "movespanProfile",
    "onboardingProfile",
    "userProfile",
    "mwUser",
    "mw_onb"
  ];

  function readJson(key) {
    try {
      return JSON.parse(
        localStorage.getItem(key) || "{}"
      );
    } catch (_) {
      return {};
    }
  }

  function collectAccountData(user, profile) {
    const sources = [
      ...PROFILE_KEYS.map(readJson),
      window.mwProfile || {},
      window.mwUser || {},
      window.currentUser || {},
      user || {},
      profile || {}
    ];

    return Object.assign(
      {},
      ...sources.filter(
        item =>
          item &&
          typeof item === "object"
      )
    );
  }

  function resolveName(data) {
    const fullName =
      data.fullName ||
      data.full_name ||
      data.displayName ||
      data.name ||
      data.userName ||
      "";

    if (String(fullName).trim()) {
      return String(fullName).trim();
    }

    const firstName =
      data.firstName ||
      data.first_name ||
      data.firstname ||
      data.givenName ||
      "";

    const lastName =
      data.lastName ||
      data.last_name ||
      data.lastname ||
      data.familyName ||
      "";

    return [firstName, lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  function resolveEmail(data) {
    return String(
      data.email ||
      data.userEmail ||
      data.user_email ||
      ""
    ).trim();
  }

  function createInitials(name, email) {
    const source =
      name ||
      email.split("@")[0] ||
      "MoveSpan";

    return source
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part =>
        part.charAt(0).toUpperCase()
      )
      .join("") || "MS";
  }

  function renderAccount(user, profile) {
    const data =
      collectAccountData(user, profile);

    const resolvedName =
      resolveName(data);

    const email =
      resolveEmail(data);

    const name =
      resolvedName ||
      "MoveSpan Member";

    const avatar =
      document.getElementById(
        "home-account-avatar"
      );

    const nameElement =
      document.getElementById(
        "home-account-name"
      );

    const emailElement =
      document.getElementById(
        "home-account-email"
      );

    if (avatar) {
      avatar.textContent =
        createInitials(name, email);
    }

    if (nameElement) {
      nameElement.textContent = name;
    }

    if (emailElement) {
      emailElement.textContent =
        email ||
        "Complete your profile";

      emailElement.classList.toggle(
        "home-account-profile-incomplete",
        !resolvedName
      );
    }
  }

  function openProfile() {
    window.location.href =
      "settings.html#profile";
  }

  function openSettings() {
    window.location.href =
      "settings.html";
  }

  function openSupport() {
    window.location.href =
      "settings.html#support";
  }

  async function performSignOut() {
    const confirmed =
      window.confirm(
        "Sign out of MoveSpan on this device?"
      );

    if (!confirmed) return;

    if (
      typeof window.mwSignOut === "function"
    ) {
      await window.mwSignOut();
      return;
    }

    if (
      window.mwAuth &&
      typeof window.mwAuth.signOut ===
        "function"
    ) {
      await window.mwAuth.signOut();
      window.location.href =
        "/auth.html";
      return;
    }

    window.location.href =
      "/auth.html";
  }

  function handleMenuAction(action) {
    if (action === "profile") {
      openProfile();
      return;
    }

    if (action === "settings") {
      openSettings();
      return;
    }

    if (action === "help") {
      openSupport();
      return;
    }

    if (action === "signout") {
      performSignOut().catch(error => {
        console.error(
          "MoveSpan sign-out failed:",
          error
        );

        window.location.href =
          "/auth.html";
      });
    }
  }

  function initializeAccountMenu() {
    const accountSummary =
      document.getElementById(
        "home-account-summary"
      );

    if (accountSummary) {
      accountSummary.addEventListener(
        "click",
        openProfile
      );

      accountSummary.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            openProfile();
          }
        }
      );
    }

    document
      .querySelectorAll(
        "[data-home-menu-action]"
      )
      .forEach(button => {
        button.addEventListener(
          "click",
          event => {
            event.preventDefault();

            /*
             * Старый home-runtime.js содержит
             * alert-заглушки. Capture listener
             * останавливает их до выполнения.
             */
            event.stopImmediatePropagation();

            handleMenuAction(
              button.dataset.homeMenuAction
            );
          },
          true
        );
      });

    renderAccount();
  }

  const previousAuthReady =
    window.onMwAuthReady;

  window.onMwAuthReady =
    function (user, profile) {
      if (
        typeof previousAuthReady ===
        "function"
      ) {
        try {
          previousAuthReady(
            user,
            profile
          );
        } catch (_) {}
      }

      if (user) {
        window.mwUser = user;
      }

      if (profile) {
        window.mwProfile = profile;

        try {
          localStorage.setItem(
            "mwProfile",
            JSON.stringify(profile)
          );
        } catch (_) {}
      }

      renderAccount(user, profile);
    };

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initializeAccountMenu,
      { once: true }
    );
  } else {
    initializeAccountMenu();
  }
})();
