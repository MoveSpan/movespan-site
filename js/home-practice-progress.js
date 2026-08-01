(function () {
  "use strict";

  function localDateKey() {
    const now = new Date();

    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");
  }

  function findPracticeButton() {
    return [...document.querySelectorAll("button")].find((button) => {
      const clickHandler =
        button.getAttribute("onclick") || "";

      const text = button.textContent
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      return (
        clickHandler.includes("practice-player.html") ||
        text.includes("start practice") ||
        text.includes("completed today") ||
        text.includes("practice again")
      );
    });
  }

  function findTodayPracticeCard(button) {
    if (!button) return null;

    let element = button.parentElement;

    while (element && element !== document.body) {
      const text = element.textContent
        .replace(/\s+/g, " ")
        .toLowerCase();

      if (
        text.includes("today's practice") &&
        text.includes("joint recovery")
      ) {
        return element;
      }

      element = element.parentElement;
    }

    return null;
  }

  function markCompleted(card) {
    if (!card) return;

    card.classList.add("today-practice-completed");

    if (card.querySelector(".today-practice-status")) {
      return;
    }

    const heading = [...card.querySelectorAll("*")].find((element) => {
      return element.textContent
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase() === "today's practice";
    });

    if (!heading) return;

    const status = document.createElement("span");

    status.className = "today-practice-status";
    status.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m7 12 3 3 7-7"
          stroke="currentColor"
          stroke-width="2.3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Completed today
    `;

    heading.insertAdjacentElement("afterend", status);
  }


  function applyHeroVisualStandard(card) {
    if (!card) return;

    const image = card.querySelector("img");

    if (!image) return;

    image.classList.add("movespan-hero-visual");
    image.dataset.visualAnchor = "low-pose";
  }

  function updateProgressValues() {
    document.querySelectorAll(".prog-slabel").forEach((label) => {
      const normalized = label.textContent
        .trim()
        .toLowerCase();

      const value = label.previousElementSibling;

      if (!value) return;

      if (normalized === "completed today") {
        value.textContent = "1";
      }

      if (normalized === "weekly progress") {
        value.textContent = "1 / 5";
      }
    });
  }

  function renderPracticeState() {
    const completed =
      localStorage.getItem(
        "movespanPracticeCompletedDate"
      ) === localDateKey();

    const button = findPracticeButton();
    const card = findTodayPracticeCard(button);

    applyHeroVisualStandard(card);

    if (!completed || !button) {
      return;
    }

    /*
     * Completed is a status, not a disabled state.
     * The user must always be able to reopen the practice.
     */
    button.disabled = false;
    button.removeAttribute("disabled");
    button.style.opacity = "";
    button.style.cursor = "pointer";

    button.textContent = "Practice again →";
    button.setAttribute(
      "aria-label",
      "Open Joint Recovery practice again"
    );

    button.onclick = function () {
      location.href = "practice-player.html";
    };

    markCompleted(card);
    updateProgressValues();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      renderPracticeState,
      { once: true }
    );
  } else {
    renderPracticeState();
  }
})();
