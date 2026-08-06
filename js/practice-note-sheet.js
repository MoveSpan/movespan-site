(function initializePracticeNoteInsight() {
  "use strict";

  const STORAGE_KEY =
    "movespan_practice_note_small_regular_v1_dismissed";

  const note = document.querySelector(".pnote");
  const card = note ? note.closest(".card") : null;

  const sheet = document.getElementById("practice-note-sheet");
  const backdrop = document.getElementById(
    "practice-note-sheet-backdrop"
  );

  const closeButton = document.getElementById(
    "practice-sheet-close"
  );

  const gotItButton = document.getElementById(
    "practice-sheet-got-it"
  );

  const dragZone = sheet
    ? sheet.querySelector(".practice-sheet-drag-zone")
    : null;

  if (!note || !card) return;

  function isDismissed() {
    return localStorage.getItem(STORAGE_KEY) === "1";
  }

  function openSheet() {
    if (!sheet || !backdrop) return;

    backdrop.hidden = false;
    sheet.hidden = false;

    document.body.classList.add("practice-sheet-open");

    window.requestAnimationFrame(function () {
      closeButton?.focus();
    });
  }

  function closeSheet() {
    if (!sheet || !backdrop) return;

    sheet.style.transform = "";
    sheet.classList.remove("is-dragging");

    sheet.hidden = true;
    backdrop.hidden = true;

    document.body.classList.remove("practice-sheet-open");
  }

  function renderCard() {
    card.classList.remove(
      "silver",
      "practice-note-card-compact",
      "practice-note-is-compact",
      "practice-note-is-expanded",
      "is-compact"
    );

    card.removeAttribute("role");
    card.removeAttribute("tabindex");
    card.removeAttribute("aria-label");

    card.innerHTML = `
      <div class="pnote practice-note-whoop">
        <div class="practice-note-whoop-main">
          <div class="practice-note-whoop-eyebrow">
            Practice Note
          </div>

          <h2 class="practice-note-whoop-title">
            Small, regular practice matters
          </h2>

          <p class="practice-note-whoop-text">
            A short practice you can repeat consistently
            is more valuable than occasional intensity.
          </p>

          <button
            class="practice-note-whoop-read"
            type="button"
            data-practice-note-read
          >
            Read today’s note
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div class="practice-note-whoop-visual" aria-hidden="true">
          <div class="practice-note-whoop-figure">
            <svg viewBox="0 0 64 64" fill="none">
              <path
                d="M20 45c8-2 14-8 17-18"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M35 29c5-8 12-11 20-10-1 9-7 15-17 17"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M29 39c-5-8-12-11-20-10 1 9 7 15 17 17"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="31"
                cy="16"
                r="5"
                stroke="currentColor"
                stroke-width="3"
              />
            </svg>
          </div>
        </div>

        <button
          class="practice-note-dismiss"
          type="button"
          data-practice-note-dismiss
          aria-label="Mark Practice Note as complete"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 12 4 4L19 6"></path>
          </svg>
        </button>

        <div
          class="practice-note-complete-state"
          aria-live="polite"
        >
          <div class="practice-note-complete-check">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m5 12 4 4L19 6"></path>
            </svg>
          </div>

          <div class="practice-note-complete-label">
            You’re set
          </div>
        </div>
      </div>
    `;
  }

  function dismissCard() {
    if (card.classList.contains("practice-note-completing")) {
      return;
    }

    const dismissButton = card.querySelector(
      "[data-practice-note-dismiss]"
    );

    const completeState = card.querySelector(
      ".practice-note-complete-state"
    );

    card.classList.add("practice-note-completing");

    if (dismissButton) {
      dismissButton.innerHTML =
        '<span class="practice-note-spinner" aria-hidden="true"></span>';

      dismissButton.setAttribute(
        "aria-label",
        "Completing Practice Note"
      );
    }

    window.setTimeout(function () {
      completeState?.classList.add("is-visible");
    }, 380);

    window.setTimeout(function () {
      localStorage.setItem(STORAGE_KEY, "1");
      card.classList.add("practice-note-removing");
    }, 1050);

    window.setTimeout(function () {
      card.classList.add("practice-note-hidden");
      card.remove();
    }, 1500);
  }

  if (isDismissed()) {
    card.remove();
    return;
  }

  renderCard();

  card
    .querySelector("[data-practice-note-read]")
    ?.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openSheet();
    });

  card
    .querySelector("[data-practice-note-dismiss]")
    ?.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      dismissCard();
    });

  closeButton?.addEventListener("click", closeSheet);
  gotItButton?.addEventListener("click", closeSheet);
  backdrop?.addEventListener("click", closeSheet);

  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      sheet &&
      !sheet.hidden
    ) {
      closeSheet();
    }
  });

  let dragging = false;
  let startY = 0;
  let currentY = 0;

  function beginDrag(clientY) {
    if (window.innerWidth >= 700) return;

    dragging = true;
    startY = clientY;
    currentY = clientY;

    sheet?.classList.add("is-dragging");
  }

  function moveDrag(clientY) {
    if (!dragging || !sheet) return;

    currentY = clientY;

    const distance = Math.max(0, currentY - startY);

    sheet.style.transform =
      "translateX(-50%) translateY(" +
      distance +
      "px)";
  }

  function endDrag() {
    if (!dragging || !sheet) return;

    dragging = false;

    const distance = Math.max(0, currentY - startY);

    sheet.classList.remove("is-dragging");

    if (distance > 110) {
      closeSheet();
      return;
    }

    sheet.style.transform =
      "translateX(-50%) translateY(0)";
  }

  dragZone?.addEventListener("pointerdown", function (event) {
    beginDrag(event.clientY);

    if (dragging) {
      dragZone.setPointerCapture(event.pointerId);
    }
  });

  dragZone?.addEventListener("pointermove", function (event) {
    moveDrag(event.clientY);
  });

  dragZone?.addEventListener("pointerup", endDrag);
  dragZone?.addEventListener("pointercancel", endDrag);
})();
