(function () {
  "use strict";

  const sheet = document.getElementById("practice-sheet");
  const backdrop = document.getElementById("practice-sheet-backdrop");
  const closeButton = document.getElementById("practice-sheet-close");
  const gotItButton = document.getElementById("practice-sheet-got-it");
  const dragZone = document.getElementById("practice-sheet-drag-zone");

  let startY = 0;
  let currentY = 0;
  let dragging = false;

  function getCard() {
    const note = document.querySelector(".pnote");
    return note ? note.closest(".card") : null;
  }

  function prepareCard() {
    const card = getCard();
    if (!card) return;

    card.hidden = false;
    card.classList.remove(
      "practice-note-card-compact",
      "practice-note-is-compact",
      "practice-note-is-expanded",
      "is-compact"
    );

    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      "Open today’s Practice Note"
    );

    const figure = card.querySelector(".pnote-fig");

    if (figure) {
      figure.innerHTML = `
        <span class="practice-note-knowledge-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M4.75 5.5A2.75 2.75 0 0 1 7.5 2.75H11v16.5H7.5a2.75 2.75 0 0 0-2.75 2.75V5.5Z"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linejoin="round"
            />
            <path
              d="M19.25 5.5a2.75 2.75 0 0 0-2.75-2.75H13v16.5h3.5A2.75 2.75 0 0 1 19.25 22V5.5Z"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      `;
    }

    if (!card.querySelector(".practice-note-chevron")) {
      card.insertAdjacentHTML(
        "beforeend",
        `
          <span class="practice-note-chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="m9 6 6 6-6 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        `
      );
    }
  }

  function openSheet() {
    if (!sheet || !backdrop) return;

    sheet.style.transform = "";
    backdrop.hidden = false;
    sheet.hidden = false;
    document.body.classList.add("practice-sheet-open");

    requestAnimationFrame(() => {
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

  document.addEventListener(
    "click",
    function (event) {
      const card = getCard();

      if (!card || !card.contains(event.target)) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      openSheet();
    },
    true
  );

  document.addEventListener("keydown", function (event) {
    const card = getCard();

    if (
      card &&
      document.activeElement === card &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      openSheet();
      return;
    }

    if (
      event.key === "Escape" &&
      sheet &&
      !sheet.hidden
    ) {
      closeSheet();
    }
  });

  closeButton?.addEventListener("click", closeSheet);
  gotItButton?.addEventListener("click", closeSheet);
  backdrop?.addEventListener("click", closeSheet);

  function beginDrag(clientY) {
    if (window.innerWidth >= 700) return;

    dragging = true;
    startY = clientY;
    currentY = clientY;
    sheet.classList.add("is-dragging");
  }

  function moveDrag(clientY) {
    if (!dragging) return;

    currentY = clientY;

    const distance = Math.max(0, currentY - startY);

    sheet.style.transform =
      "translateX(-50%) translateY(" +
      distance +
      "px)";
  }

  function endDrag() {
    if (!dragging) return;

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

  localStorage.removeItem("movespanPracticeNoteCompactDate");
  localStorage.removeItem("movespanPracticeNoteDismissedDate");

  prepareCard();
})();
