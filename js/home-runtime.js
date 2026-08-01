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


  /* MoveSpan Header Capture Fix */
  document.addEventListener("click", function (event) {
    const notificationsTarget = event.target.closest(
      "#home-notifications-button"
    );

    const menuTarget = event.target.closest(
      "#home-menu-button"
    );

    if (!notificationsTarget && !menuTarget) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (notificationsTarget) {
      openHomeSheet("notifications-sheet");
      return;
    }

    openHomeSheet("quick-menu-sheet");
  }, true);

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

    /*
     * Старый макет может содержать кнопки внутри ссылок.
     * Удаляем навигацию, чтобы клик открывал только bottom sheet.
     */
    [notificationsButton, menuButton].forEach((button) => {
      if (!button) return;

      button.setAttribute("type", "button");

      const parentLink = button.closest("a");

      if (parentLink) {
        parentLink.removeAttribute("href");
        parentLink.removeAttribute("target");
        parentLink.removeAttribute("onclick");
        parentLink.style.cursor = "default";
      }
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


/* MoveSpan Practice Note — inline final behavior */
(function () {
  "use strict";

  const STORAGE_KEY = "movespanPracticeNoteCompactDate";

  function todayKey() {
    const now = new Date();

    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");
  }

  function getCard() {
    const note = document.querySelector(".pnote");
    return note ? note.closest(".card") : null;
  }

  function findAction(label) {
    const card = getCard();
    if (!card) return null;

    return [...card.querySelectorAll("a, button")].find((element) => {
      return element.textContent
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
        .includes(label);
    }) || null;
  }

  function getDetail() {
    return document.getElementById(
      "practice-note-inline-detail"
    );
  }

  function renderState() {
    const card = getCard();
    const detail = getDetail();
    const readMore = findAction("read more")
      || findAction("read less");

    if (!card) return;

    const compact =
      localStorage.getItem(STORAGE_KEY) === todayKey();

    card.classList.toggle(
      "practice-note-is-compact",
      compact
    );

    if (compact) {
      card.classList.remove(
        "practice-note-is-expanded"
      );

      if (detail) detail.hidden = true;

      if (readMore) {
        readMore.textContent = "Read more →";
      }

      card.tabIndex = 0;
      card.setAttribute(
        "aria-label",
        "Expand today’s practice note"
      );
    } else {
      card.tabIndex = -1;
      card.removeAttribute("aria-label");
    }
  }

  function expandCompactCard() {
    const card = getCard();

    if (!card) return;

    localStorage.removeItem(STORAGE_KEY);

    card.classList.remove(
      "practice-note-is-compact"
    );

    card.tabIndex = -1;
    card.removeAttribute("aria-label");
  }

  function toggleReadMore() {
    const card = getCard();
    const detail = getDetail();
    const readMore = findAction("read more")
      || findAction("read less");

    if (!card || !detail) return;

    const expanded = !detail.hidden;

    detail.hidden = expanded;

    card.classList.toggle(
      "practice-note-is-expanded",
      !expanded
    );

    if (readMore) {
      readMore.textContent = expanded
        ? "Read more →"
        : "Read less ↑";
    }
  }

  function makeCompact() {
    const card = getCard();
    const detail = getDetail();

    if (!card) return;

    localStorage.setItem(
      STORAGE_KEY,
      todayKey()
    );

    card.classList.add(
      "practice-note-is-compact"
    );

    card.classList.remove(
      "practice-note-is-expanded"
    );

    if (detail) detail.hidden = true;

    const readMore = findAction("read more")
      || findAction("read less");

    if (readMore) {
      readMore.textContent = "Read more →";
    }

    card.tabIndex = 0;
  }

  document.addEventListener(
    "click",
    function (event) {
      const card = getCard();

      if (!card) return;

      /*
       * Компактная карточка:
       * клик в любом месте возвращает полный вид.
       */
      if (
        card.classList.contains(
          "practice-note-is-compact"
        )
        && card.contains(event.target)
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        expandCompactCard();
        return;
      }

      const action = event.target.closest(
        "a, button"
      );

      if (!action || !card.contains(action)) {
        return;
      }

      const label = action.textContent
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      if (
        label.includes("read more")
        || label.includes("read less")
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        toggleReadMore();
        return;
      }

      if (label.includes("got it")) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        makeCompact();
      }
    },
    true
  );

  document.addEventListener(
    "keydown",
    function (event) {
      const card = getCard();

      if (
        card
        && card.classList.contains(
          "practice-note-is-compact"
        )
        && document.activeElement === card
        && (
          event.key === "Enter"
          || event.key === " "
        )
      ) {
        event.preventDefault();
        expandCompactCard();
      }
    }
  );

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      renderState,
      { once: true }
    );
  } else {
    renderState();
  }
})();
