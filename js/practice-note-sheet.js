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

  function resetLegacyState() {
    const card = getCard();

    localStorage.removeItem("movespanPracticeNoteCompactDate");
    localStorage.removeItem("movespanPracticeNoteDismissedDate");

    if (!card) return;

    card.hidden = false;
    card.classList.remove(
      "practice-note-is-compact",
      "practice-note-is-expanded",
      "is-compact"
    );

    const detail = document.getElementById(
      "practice-note-inline-detail"
    );

    if (detail) {
      detail.hidden = true;
    }

    const actions = card.querySelectorAll("a, button");

    actions.forEach((element) => {
      const label = element.textContent
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      if (
        label.includes("read less")
        || label.includes("read more")
      ) {
        element.textContent = "Read more →";
      }
    });
  }

  function openSheet() {
    if (!sheet || !backdrop) return;

    resetLegacyState();

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

  /*
   * Перехватываем клик раньше старых обработчиков.
   * Клик по карточке или Read more открывает белый sheet.
   * Got it на серебряной карточке также открывает sheet:
   * старое скрытие карточки больше не используется.
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

  closeButton?.addEventListener("click", closeSheet);
  gotItButton?.addEventListener("click", closeSheet);
  backdrop?.addEventListener("click", closeSheet);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && sheet && !sheet.hidden) {
      closeSheet();
    }
  });

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
      "translateX(-50%) translateY(" + distance + "px)";
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

  resetLegacyState();
})();
