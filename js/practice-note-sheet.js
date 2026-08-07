(function initMoveSpanHomeInsights() {
  "use strict";

  const HISTORY_KEY =
    "movespanHomeInsightHistoryV1";

  const TRACKER_KEY =
    "movespanTrackerInsights";

  const url = new URL(window.location.href);

  const PREVIEW_MODE =
    url.searchParams.get("insights") === "preview";

  if (PREVIEW_MODE) {
    document.documentElement.classList.add(
      "movespan-insights-preview"
    );
  }

  const originalNote = document.querySelector(".pnote");

  const card = originalNote
    ? originalNote.closest(".card")
    : null;

  const hero = document.getElementById("practice-hero");

  if (!card || !hero) {
    console.warn(
      "MoveSpan Home Insights: card or Today's Practice hero not found."
    );
    return;
  }

  /* --------------------------------------------------------
     LOCAL DATE
     -------------------------------------------------------- */

  function localDateKey(date) {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const TODAY =
    localDateKey(new Date());

  /* --------------------------------------------------------
     DAILY PRACTICE NOTE

     IMPORTANT:
     The date is part of the instance ID.
     Therefore dismissing today's note does not suppress
     tomorrow's Practice Note.
     -------------------------------------------------------- */

  const DAILY_INSIGHT = {
    id: `practice-note-${TODAY}`,
    sourceId: "practice-note-small-regular",
    type: "Practice Note",
    title: "Small, regular practice matters",
    preview:
      "A short practice you can repeat consistently is more valuable than occasional intensity.",
    detail:
      "The body responds especially well to movement that is manageable and easy to repeat. Consistency gives mobility, coordination and nervous-system regulation time to build."
  };

  /* --------------------------------------------------------
     PREVIEW DATA
     Only exists in ?insights=preview
     -------------------------------------------------------- */

  const PREVIEW_INSIGHTS = [
    {
      id: "preview-practice-note",
      sourceId: "preview-practice-note",
      type: "Practice Note",
      title: "Small, regular practice matters",
      preview:
        "A short practice you can repeat consistently is more valuable than occasional intensity.",
      detail:
        "The body responds especially well to movement that is manageable and easy to repeat. Consistency gives mobility, coordination and nervous-system regulation time to build."
    },
    {
      id: "preview-movement-insight",
      sourceId: "preview-movement-insight",
      type: "Movement Insight",
      title: "Your activity has been lighter",
      preview:
        "Your recent movement is below your usual pattern. A short session may be enough today.",
      detail:
        "You do not need to compensate with a hard workout. A manageable recovery or mobility practice can help restore continuity without adding unnecessary strain."
    },
    {
      id: "preview-tracker-insight",
      sourceId: "preview-tracker-insight",
      type: "Tracker Insight",
      title: "Consider a gentler practice today",
      preview:
        "Recovery signals suggest that a lower-intensity session may fit better today.",
      detail:
        "When recovery is lower than usual, reducing intensity while keeping some movement can preserve the habit and support recovery. This is preview data only."
    }
  ];

  /* --------------------------------------------------------
     PERSISTENCE
     -------------------------------------------------------- */

  function dismissalKey(id) {
    return "movespanHomeInsightDismissed:" + id;
  }

  function isDismissed(id) {
    if (PREVIEW_MODE) return false;

    return (
      localStorage.getItem(
        dismissalKey(id)
      ) === "1"
    );
  }

  function markDismissed(id) {
    if (PREVIEW_MODE) return;

    localStorage.setItem(
      dismissalKey(id),
      "1"
    );
  }

  /* --------------------------------------------------------
     HISTORY
     -------------------------------------------------------- */

  function readHistory() {
    try {
      const parsed = JSON.parse(
        localStorage.getItem(HISTORY_KEY) || "[]"
      );

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      console.warn(
        "MoveSpan Insights history could not be read.",
        error
      );

      return [];
    }
  }

  function saveHistory(items) {
    try {
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(items.slice(0, 100))
      );
    } catch (error) {
      console.warn(
        "MoveSpan Insights history could not be saved.",
        error
      );
    }
  }

  function addToHistory(insight) {
    if (PREVIEW_MODE) return;

    const history = readHistory();

    const item = {
      id: insight.id,
      sourceId:
        insight.sourceId || insight.id,
      type: insight.type,
      title: insight.title,
      preview: insight.preview || "",
      detail: insight.detail || "",
      date: TODAY,
      dismissedAt:
        new Date().toISOString()
    };

    const filtered =
      history.filter(function (existing) {
        return existing.id !== item.id;
      });

    filtered.unshift(item);

    saveHistory(filtered);
  }

  /* --------------------------------------------------------
     TRACKER / SYSTEM INSIGHTS
     -------------------------------------------------------- */

  function readTrackerInsights() {
    let stored = [];

    try {
      const raw =
        localStorage.getItem(TRACKER_KEY);

      const parsed =
        raw ? JSON.parse(raw) : [];

      if (Array.isArray(parsed)) {
        stored = parsed;
      }
    } catch (error) {
      console.warn(
        "MoveSpan tracker insights could not be read.",
        error
      );
    }

    const runtime =
      Array.isArray(
        window.movespanTrackerInsights
      )
        ? window.movespanTrackerInsights
        : [];

    return [...runtime, ...stored]
      .filter(function (item) {
        return (
          item &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.title === "string"
        );
      })
      .map(function (item) {
        return {
          id: item.id,
          sourceId:
            item.sourceId || item.id,
          type:
            item.type || "Movement Insight",
          title: item.title,
          preview: item.preview || "",
          detail: item.detail || ""
        };
      });
  }

  function getInsights() {
    if (PREVIEW_MODE) {
      return PREVIEW_INSIGHTS.slice();
    }

    const all = [
      DAILY_INSIGHT,
      ...readTrackerInsights()
    ];

    const ids = new Set();

    return all.filter(function (item) {
      if (
        !item.id ||
        ids.has(item.id)
      ) {
        return false;
      }

      ids.add(item.id);

      return !isDismissed(item.id);
    });
  }

  let insights = getInsights();
  let currentIndex = 0;
  let expanded = false;
  let busy = false;

  card.className =
    "card movespan-home-insight-card";

  /* Always directly above Today's Practice. */
  hero.insertAdjacentElement(
    "beforebegin",
    card
  );

  /* --------------------------------------------------------
     PREVIEW TOOLBAR
     -------------------------------------------------------- */

  let previewTools = null;

  if (PREVIEW_MODE) {
    previewTools =
      document.createElement("div");

    previewTools.className =
      "movespan-insights-preview-tools";

    previewTools.innerHTML = `
      <span class="movespan-insights-preview-label">
        Insights Preview
      </span>

      <button
        class="movespan-insights-preview-reset"
        type="button"
        data-insights-preview-reset
      >
        Reset preview
      </button>
    `;

    card.insertAdjacentElement(
      "beforebegin",
      previewTools
    );

    previewTools
      .querySelector(
        "[data-insights-preview-reset]"
      )
      ?.addEventListener(
        "click",
        function () {
          insights =
            PREVIEW_INSIGHTS.slice();

          currentIndex = 0;
          expanded = false;
          busy = false;

          if (!card.isConnected) {
            hero.insertAdjacentElement(
              "beforebegin",
              card
            );
          }

          render();
        }
      );
  }

  /* --------------------------------------------------------
     UI
     -------------------------------------------------------- */

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function numberButtons() {
    return insights
      .map(function (_, index) {
        const current =
          index === currentIndex;

        return `
          <button
            class="movespan-home-insight-number${current ? " is-current" : ""}"
            type="button"
            data-insight-index="${index}"
            aria-label="Open insight ${index + 1}"
            aria-current="${current ? "true" : "false"}"
          >
            ${index + 1}
          </button>
        `;
      })
      .join("");
  }

  function render() {
    if (!insights.length) {
      card.remove();
      return;
    }

    if (
      currentIndex >= insights.length
    ) {
      currentIndex =
        insights.length - 1;
    }

    const insight =
      insights[currentIndex];

    card.innerHTML = `
      <article
        class="movespan-home-insight${expanded ? " is-expanded" : ""}"
        data-insight-id="${escapeHTML(insight.id)}"
      >
        <div class="movespan-home-insight-content">

          <div class="movespan-home-insight-type">
            ${escapeHTML(insight.type)}
          </div>

          <h2 class="movespan-home-insight-title">
            ${escapeHTML(insight.title)}
          </h2>

          <p class="movespan-home-insight-preview">
            ${escapeHTML(insight.preview)}
          </p>

          <div class="movespan-home-insight-detail-wrap">
            <div class="movespan-home-insight-detail-inner">
              <p class="movespan-home-insight-detail">
                ${escapeHTML(insight.detail)}
              </p>
            </div>
          </div>

          <button
            class="movespan-home-insight-action"
            type="button"
            data-insight-toggle
            aria-expanded="${expanded ? "true" : "false"}"
          >
            ${expanded ? "Close" : "Read more"}
          </button>
        </div>

        <aside class="movespan-home-insight-side">

          <button
            class="movespan-home-insight-done"
            type="button"
            data-insight-done
            aria-label="Dismiss this insight"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m5 12 4 4L19 6"></path>
            </svg>
          </button>

          <div
            class="movespan-home-insight-numbers"
            aria-label="Today's insights"
          >
            ${numberButtons()}
          </div>
        </aside>

        <div
          class="movespan-home-insight-success"
          aria-live="polite"
        >
          All set!
        </div>
      </article>
    `;
  }

  function animateHeight(mutator) {
    const startHeight =
      card.getBoundingClientRect().height;

    card.style.height =
      startHeight + "px";

    mutator();

    const endHeight =
      card.scrollHeight;

    card.style.height =
      startHeight + "px";

    requestAnimationFrame(function () {
      card.style.height =
        endHeight + "px";
    });

    window.setTimeout(function () {
      card.style.removeProperty(
        "height"
      );
    }, 410);
  }

  function toggleExpanded() {
    if (busy) return;

    animateHeight(function () {
      expanded = !expanded;

      const article =
        card.querySelector(
          ".movespan-home-insight"
        );

      const button =
        card.querySelector(
          "[data-insight-toggle]"
        );

      article?.classList.toggle(
        "is-expanded",
        expanded
      );

      if (button) {
        button.textContent =
          expanded
            ? "Close"
            : "Read more";

        button.setAttribute(
          "aria-expanded",
          expanded
            ? "true"
            : "false"
        );
      }
    });
  }

  function switchInsight(index) {
    if (
      busy ||
      index === currentIndex ||
      index < 0 ||
      index >= insights.length
    ) {
      return;
    }

    busy = true;
    expanded = false;

    card.classList.add(
      "is-switching"
    );

    window.setTimeout(
      function () {
        currentIndex = index;
        render();

        requestAnimationFrame(
          function () {
            card.classList.remove(
              "is-switching"
            );

            busy = false;
          }
        );
      },
      150
    );
  }

  function dismissCurrent() {
    if (
      busy ||
      !insights.length
    ) {
      return;
    }

    busy = true;

    const insight =
      insights[currentIndex];

    const doneButton =
      card.querySelector(
        "[data-insight-done]"
      );

    const success =
      card.querySelector(
        ".movespan-home-insight-success"
      );

    if (doneButton) {
      doneButton.disabled = true;

      doneButton.innerHTML =
        '<span class="movespan-home-insight-spinner" aria-hidden="true"></span>';
    }

    window.setTimeout(
      function () {
        success?.classList.add(
          "is-visible"
        );
      },
      300
    );

    window.setTimeout(
      function () {
        markDismissed(insight.id);
        addToHistory(insight);

        insights.splice(
          currentIndex,
          1
        );

        if (!insights.length) {
          const startHeight =
            card.getBoundingClientRect()
              .height;

          card.style.height =
            startHeight + "px";

          requestAnimationFrame(
            function () {
              card.classList.add(
                "is-dismissing"
              );

              card.style.height =
                "0px";
            }
          );

          window.setTimeout(
            function () {
              card.remove();

              /*
               * In preview mode the toolbar
               * remains so Reset preview can
               * restore the cards.
               */
              if (!PREVIEW_MODE) {
                previewTools?.remove();
              }
            },
            430
          );

          return;
        }

        if (
          currentIndex >=
          insights.length
        ) {
          currentIndex =
            insights.length - 1;
        }

        expanded = false;

        card.classList.add(
          "is-switching"
        );

        window.setTimeout(
          function () {
            render();

            requestAnimationFrame(
              function () {
                card.classList.remove(
                  "is-switching"
                );

                busy = false;
              }
            );
          },
          150
        );
      },
      900
    );
  }

  card.addEventListener(
    "click",
    function (event) {
      const toggle =
        event.target.closest(
          "[data-insight-toggle]"
        );

      if (
        toggle &&
        card.contains(toggle)
      ) {
        event.preventDefault();
        event.stopPropagation();

        toggleExpanded();
        return;
      }

      const done =
        event.target.closest(
          "[data-insight-done]"
        );

      if (
        done &&
        card.contains(done)
      ) {
        event.preventDefault();
        event.stopPropagation();

        dismissCurrent();
        return;
      }

      const number =
        event.target.closest(
          "[data-insight-index]"
        );

      if (
        number &&
        card.contains(number)
      ) {
        event.preventDefault();
        event.stopPropagation();

        switchInsight(
          Number(
            number.dataset.insightIndex
          )
        );
      }
    }
  );

  render();
})();
