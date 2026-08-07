(function initMoveSpanHomeInsights() {
  "use strict";

  /*
   * MoveSpan Home Insights v1
   *
   * Each insight has:
   *   id      stable persistence identifier
   *   type    PRACTICE NOTE / MOVEMENT INSIGHT / etc.
   *   title   <= ~55 characters
   *   preview ~100-150 characters
   *   detail  ~200-300 characters
   *
   * Tracker-generated insights can later be supplied through:
   *   window.movespanTrackerInsights = [...]
   * or localStorage:
   *   movespanTrackerInsights
   */

  const originalNote = document.querySelector(".pnote");
  const card = originalNote
    ? originalNote.closest(".card")
    : null;

  const hero = document.getElementById("practice-hero");

  if (!card || !hero) {
    console.warn(
      "MoveSpan Home Insights: Practice Note card or practice hero not found."
    );
    return;
  }

  const BASE_INSIGHTS = [
    {
      id: "practice-note-small-regular-v2",
      type: "Practice Note",
      title: "Small, regular practice matters",
      preview:
        "A short practice you can repeat consistently is more valuable than occasional intensity.",
      detail:
        "The body responds especially well to movement that is manageable and easy to repeat. Consistency gives mobility, coordination and nervous-system regulation time to build."
    }
  ];

  function readTrackerInsights() {
    let stored = [];

    try {
      const raw = localStorage.getItem(
        "movespanTrackerInsights"
      );

      const parsed = raw
        ? JSON.parse(raw)
        : [];

      if (Array.isArray(parsed)) {
        stored = parsed;
      }
    } catch (error) {
      console.warn(
        "MoveSpan Home Insights: stored tracker insights could not be read.",
        error
      );
    }

    const runtime = Array.isArray(
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
          type: item.type || "Movement Insight",
          title: item.title,
          preview: item.preview || "",
          detail: item.detail || ""
        };
      });
  }

  function storageKey(id) {
    return "movespanHomeInsightDismissed:" + id;
  }

  function isDismissed(id) {
    return (
      localStorage.getItem(storageKey(id)) === "1"
    );
  }

  function markDismissed(id) {
    localStorage.setItem(storageKey(id), "1");
  }

  function getInsights() {
    const all = [
      ...BASE_INSIGHTS,
      ...readTrackerInsights()
    ];

    const seen = new Set();

    return all.filter(function (item) {
      if (!item.id || seen.has(item.id)) {
        return false;
      }

      seen.add(item.id);

      return !isDismissed(item.id);
    });
  }

  let insights = getInsights();
  let currentIndex = 0;
  let expanded = false;
  let busy = false;

  card.className = "card movespan-home-insight-card";

  /* Strict placement: immediately above Today's Practice. */
  hero.insertAdjacentElement(
    "beforebegin",
    card
  );

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

    if (currentIndex >= insights.length) {
      currentIndex = insights.length - 1;
    }

    const insight = insights[currentIndex];

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
            <svg viewBox="0 0 24 24" aria-hidden="true">
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
      card.style.removeProperty("height");
    }, 410);
  }

  function toggleExpanded() {
    if (busy) return;

    animateHeight(function () {
      expanded = !expanded;

      const article = card.querySelector(
        ".movespan-home-insight"
      );

      const button = card.querySelector(
        "[data-insight-toggle]"
      );

      article?.classList.toggle(
        "is-expanded",
        expanded
      );

      if (button) {
        button.textContent =
          expanded ? "Close" : "Read more";

        button.setAttribute(
          "aria-expanded",
          expanded ? "true" : "false"
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

    card.classList.add("is-switching");

    window.setTimeout(function () {
      currentIndex = index;
      render();

      requestAnimationFrame(function () {
        card.classList.remove("is-switching");
        busy = false;
      });
    }, 150);
  }

  function dismissCurrent() {
    if (busy || !insights.length) return;

    busy = true;

    const insight = insights[currentIndex];

    const doneButton = card.querySelector(
      "[data-insight-done]"
    );

    const success = card.querySelector(
      ".movespan-home-insight-success"
    );

    if (doneButton) {
      doneButton.disabled = true;
      doneButton.innerHTML =
        '<span class="movespan-home-insight-spinner" aria-hidden="true"></span>';
    }

    window.setTimeout(function () {
      success?.classList.add("is-visible");
    }, 330);

    window.setTimeout(function () {
      markDismissed(insight.id);

      insights.splice(currentIndex, 1);

      if (!insights.length) {
        const startHeight =
          card.getBoundingClientRect().height;

        card.style.height =
          startHeight + "px";

        requestAnimationFrame(function () {
          card.classList.add("is-dismissing");
          card.style.height = "0px";
        });

        window.setTimeout(function () {
          card.remove();
        }, 430);

        return;
      }

      if (currentIndex >= insights.length) {
        currentIndex =
          insights.length - 1;
      }

      expanded = false;

      card.classList.add("is-switching");

      window.setTimeout(function () {
        render();

        requestAnimationFrame(function () {
          card.classList.remove("is-switching");
          busy = false;
        });
      }, 150);
    }, 900);
  }

  card.addEventListener("click", function (event) {
    const toggle =
      event.target.closest("[data-insight-toggle]");

    if (toggle && card.contains(toggle)) {
      event.preventDefault();
      event.stopPropagation();
      toggleExpanded();
      return;
    }

    const done =
      event.target.closest("[data-insight-done]");

    if (done && card.contains(done)) {
      event.preventDefault();
      event.stopPropagation();
      dismissCurrent();
      return;
    }

    const number =
      event.target.closest("[data-insight-index]");

    if (number && card.contains(number)) {
      event.preventDefault();
      event.stopPropagation();

      switchInsight(
        Number(number.dataset.insightIndex)
      );
    }
  });

  /* Retire old global Practice Note handler. */
  window.dismissNote = function () {};

  render();
})();
