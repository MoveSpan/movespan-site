(function () {
  "use strict";

  const STORAGE_KEY = "movespanDailyCheckin";

  const MOODS = [
    {
      id: "poor",
      label: "Bad",
      color: "#C96A64"
    },
    {
      id: "not-good",
      label: "Not great",
      color: "#D98A52"
    },
    {
      id: "okay",
      label: "Steady",
      color: "#C8A445"
    },
    {
      id: "good",
      label: "Good",
      color: "#6FAE78"
    },
    {
      id: "great",
      label: "Amazing",
      color: "#2D7D52"
    }
  ];

  function getLocalDateKey(date = new Date()) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function getButtons() {
    return [...document.querySelectorAll(".mood")];
  }

  function getMoodRow(buttons) {
    return buttons[0]?.parentElement || null;
  }

  function readSavedCheckin() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) return null;

      const data = JSON.parse(raw);

      if (
        !data ||
        data.date !== getLocalDateKey() ||
        !MOODS.some((mood) => mood.id === data.mood)
      ) {
        return null;
      }

      return data;
    } catch (error) {
      console.warn("Unable to read Daily Check-in:", error);
      return null;
    }
  }

  function saveCheckin(mood) {
    const data = {
      mood: mood.id,
      label: mood.label,
      value: MOODS.indexOf(mood) + 1,
      date: getLocalDateKey(),
      recordedAt: new Date().toISOString()
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );

    return data;
  }

  function ensureScale(buttons) {
    let scale = document.getElementById("daily-checkin-scale");

    if (scale) return scale;

    const moodRow = getMoodRow(buttons);

    if (!moodRow) return null;

    scale = document.createElement("div");
    scale.id = "daily-checkin-scale";
    scale.className = "daily-checkin-scale";
    scale.setAttribute("role", "slider");
    scale.setAttribute("tabindex", "0");
    scale.setAttribute("aria-label", "How are you feeling today?");
    scale.setAttribute("aria-valuemin", "1");
    scale.setAttribute("aria-valuemax", "5");
    scale.setAttribute("aria-valuenow", "3");

    scale.innerHTML = `
      <div class="daily-checkin-track">
        <div class="daily-checkin-track-fill"></div>

        <div
          class="daily-checkin-thumb"
          aria-hidden="true"
        ></div>
      </div>

      <div class="daily-checkin-summary" hidden>
        <span class="daily-checkin-summary-label">
          Today:
          <strong></strong>
        </span>

        <span
          class="daily-checkin-summary-check"
          aria-label="Saved"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M6.8 12.2 10.2 15.6 17.5 8.3"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    `;

    moodRow.insertAdjacentElement("afterend", scale);

    return scale;
  }

  function configureButtons(buttons) {
    const moodRow = getMoodRow(buttons);

    if (!moodRow) return;

    const labelMap = new Map();

    buttons.forEach((button) => {
      const labelElement = button.querySelector(".mood-label");
      const label = labelElement?.textContent?.trim();

      if (label) {
        labelMap.set(label, button);
      }
    });

    /*
     * Физически переставляем элементы в правильном порядке.
     * Не используем flex-direction: row-reverse, чтобы визуальный
     * порядок совпадал с логическим и доступным порядком.
     */
    MOODS.forEach((mood) => {
      const button = labelMap.get(mood.label);

      if (button) {
        moodRow.appendChild(button);
      }
    });

    const orderedButtons = [...moodRow.querySelectorAll(".mood")];

    orderedButtons.forEach((button, index) => {
      const mood = MOODS[index];

      if (!mood) return;

      button.dataset.mood = mood.id;
      button.dataset.moodIndex = String(index);
      button.style.setProperty("--mood-color", mood.color);

      button.setAttribute("role", "button");
      button.setAttribute("tabindex", "0");
      button.setAttribute("aria-label", mood.label);
      button.setAttribute("aria-pressed", "false");

      button.onclick = function () {
        selectMood(index, true);
      };

      button.onkeydown = function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectMood(index, true);
        }
      };
    });
  }

  function indexFromPointer(event, scale) {
    const track = scale.querySelector(".daily-checkin-track");
    const rect = track.getBoundingClientRect();

    const pointerX =
      event.touches?.[0]?.clientX ??
      event.changedTouches?.[0]?.clientX ??
      event.clientX;

    const ratio = Math.min(
      1,
      Math.max(0, (pointerX - rect.left) / rect.width)
    );

    return Math.round(ratio * (MOODS.length - 1));
  }

  function configureScale(scale) {
    let dragging = false;

    function updateFromPointer(event, save) {
      const index = indexFromPointer(event, scale);
      renderMood(index, save, save);
    }

    scale.addEventListener("pointerdown", function (event) {
      dragging = true;
      scale.setPointerCapture?.(event.pointerId);
      updateFromPointer(event, true);
    });

    scale.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      updateFromPointer(event, false);
    });

    scale.addEventListener("pointerup", function (event) {
      if (!dragging) return;
      dragging = false;
      updateFromPointer(event, true);
    });

    scale.addEventListener("pointercancel", function () {
      dragging = false;
    });

    scale.addEventListener("keydown", function (event) {
      const current =
        Number(scale.dataset.selectedIndex ?? 2);

      let next = current;

      if (event.key === "ArrowLeft") {
        next = Math.max(0, current - 1);
      } else if (event.key === "ArrowRight") {
        next = Math.min(MOODS.length - 1, current + 1);
      } else if (event.key === "Home") {
        next = 0;
      } else if (event.key === "End") {
        next = MOODS.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      selectMood(next, true);
    });
  }

  function renderMood(index, persist, animate) {
    const mood = MOODS[index];
    const buttons = getButtons();
    const scale = ensureScale(buttons);

    if (!mood || !scale) return;

    if (persist) {
      saveCheckin(mood);
    }

    buttons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;

      button.classList.toggle(
        "daily-checkin-selected",
        selected
      );

      button.classList.toggle("sel", selected);

      button.setAttribute(
        "aria-pressed",
        selected ? "true" : "false"
      );
    });

    const position =
      (index / (MOODS.length - 1)) * 100;

    scale.style.setProperty(
      "--checkin-position",
      `${position}%`
    );

    scale.style.setProperty(
      "--checkin-color",
      mood.color
    );

    scale.dataset.selectedIndex = String(index);

    scale.setAttribute(
      "aria-valuenow",
      String(index + 1)
    );

    scale.setAttribute(
      "aria-valuetext",
      mood.label
    );

    const summary =
      scale.querySelector(".daily-checkin-summary");

    const summaryLabel =
      summary.querySelector("strong");

    summary.hidden = false;

    /*
     * Всегда показываем актуальную подпись из MOODS.
     * Старое поле label в localStorage не используется.
     */
    summaryLabel.textContent = mood.label;

    if (animate) {
      scale.classList.remove("daily-checkin-just-saved");
      void scale.offsetWidth;
      scale.classList.add("daily-checkin-just-saved");

      window.setTimeout(() => {
        scale.classList.remove(
          "daily-checkin-just-saved"
        );
      }, 500);
    }
  }

  function selectMood(index, animate) {
    renderMood(index, true, animate);
  }

  function initialize() {
    const buttons = getButtons();

    if (!buttons.length) {
      console.warn("Daily Check-in buttons were not found.");
      return;
    }

    configureButtons(buttons);

    const scale = ensureScale(buttons);
    configureScale(scale);

    const saved = readSavedCheckin();

    if (saved) {
      const index = MOODS.findIndex(
        (mood) => mood.id === saved.mood
      );

      if (index >= 0) {
        const currentMood = MOODS[index];

        /*
         * Обновляем старую сохранённую запись,
         * чтобы Poor/Okay/Great больше не возвращались.
         */
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...saved,
            label: currentMood.label,
            value: index + 1
          })
        );

        renderMood(index, false, false);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      { once: true }
    );
  } else {
    initialize();
  }
})();
