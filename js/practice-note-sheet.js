(function () {
  "use strict";

  const STORAGE_KEY = "movespanPracticeNoteCompactDate";

  const sheet = document.getElementById("practice-sheet");
  const backdrop = document.getElementById("practice-sheet-backdrop");
  const closeButton = document.getElementById("practice-sheet-close");
  const gotItButton = document.getElementById("practice-sheet-got-it");
  const dragZone = document.getElementById("practice-sheet-drag-zone");

  let startY = 0;
  let currentY = 0;
  let dragging = false;

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

  function renderCardState() {
    const card = getCard();

    if (!card) return;

    const compact =
      localStorage.getItem(STORAGE_KEY) === todayKey();

    card.hidden = false;
    card.classList.toggle(
      "practice-note-card-compact",
      compact
    );

    card.classList.remove(
      "practice-note-is-compact",
      "practice-note-is-expanded",
      "is-compact"
    );

    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      compact
        ? "Open today’s practice note"
        : "Read today’s practice note"
    );
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

  function acknowledgeNote() {
    localStorage.setItem(
      STORAGE_KEY,
      todayKey()
    );

    closeSheet();
    renderCardState();
  }

  /*
   * Вся серебряная карточка открывает Practice Note.
   * Capture phase блокирует все старые ссылки и обработчики.
   */
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
      card
      && document.activeElement === card
      && (
        event.key === "Enter"
        || event.key === " "
      )
    ) {
      event.preventDefault();
      openSheet();
      return;
    }

    if (
      event.key === "Escape"
      && sheet
      && !sheet.hidden
    ) {
      closeSheet();
    }
  });

  closeButton?.addEventListener("click", closeSheet);
  backdrop?.addEventListener("click", closeSheet);
  gotItButton?.addEventListener("click", acknowledgeNote);

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

    const distance = Math.max(
      0,
      currentY - startY
    );

    sheet.style.transform =
      "translateX(-50%) translateY("
      + distance
      + "px)";
  }

  function endDrag() {
    if (!dragging) return;

    dragging = false;

    const distance = Math.max(
      0,
      currentY - startY
    );

    sheet.classList.remove("is-dragging");

    if (distance > 110) {
      closeSheet();
      return;
    }

    sheet.style.transform =
      "translateX(-50%) translateY(0)";
  }

  dragZone?.addEventListener(
    "pointerdown",
    function (event) {
      beginDrag(event.clientY);

      if (dragging) {
        dragZone.setPointerCapture(
          event.pointerId
        );
      }
    }
  );

  dragZone?.addEventListener(
    "pointermove",
    function (event) {
      moveDrag(event.clientY);
    }
  );

  dragZone?.addEventListener("pointerup", endDrag);
  dragZone?.addEventListener("pointercancel", endDrag);

  localStorage.removeItem(
    "movespanPracticeNoteDismissedDate"
  );

  renderCardState();
})();
