(function () {
  "use strict";

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function renderPracticeProgress() {
    const completed =
      localStorage.getItem(
        "movespanPracticeCompletedDate"
      ) === todayKey();

    if (!completed) return;

    const startButton = [...document.querySelectorAll("button")]
      .find((button) =>
        button.textContent
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase()
          .includes("start practice")
      );

    if (startButton) {
      startButton.textContent = "Completed today ✓";
      startButton.disabled = true;
      startButton.style.opacity = ".78";
      startButton.style.cursor = "default";
    }

    const progressLabels =
      document.querySelectorAll(".prog-slabel");

    progressLabels.forEach((label) => {
      if (
        label.textContent
          .trim()
          .toLowerCase() === "completed today"
      ) {
        const value = label.previousElementSibling;

        if (value) {
          value.textContent = "1";
        }
      }

      if (
        label.textContent
          .trim()
          .toLowerCase() === "weekly progress"
      ) {
        const value = label.previousElementSibling;

        if (value) {
          value.textContent = "1 / 5";
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      renderPracticeProgress,
      { once: true }
    );
  } else {
    renderPracticeProgress();
  }
})();
