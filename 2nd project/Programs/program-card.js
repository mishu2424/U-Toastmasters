// -------- data loader --------
async function loadPrograms() {
  try {
    const res = await fetch("./programs.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load programs.json: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error loading programs:", err);
    return [];
  }
}

// -------- component init (FLIP mode) --------
function initProgramCards(container, data, options = {}) {
  if (container.dataset.pcInit === "1") return;
  container.dataset.pcInit = "1";

  const opts = {
    interaction: "flip",
    lineClamp: { title: 2 },
    analytics: null,
    ...options,
  };

  container.style.setProperty(
    "--title-lines",
    String(opts.lineClamp.title || 2)
  );

  let flippedCard = null;

  // render
  const frag = document.createDocumentFragment();
  data.forEach((program, position) =>
    frag.appendChild(renderCard(program, position))
  );
  container.innerHTML = "";
  container.appendChild(frag);

  // delegated click handler
  container.addEventListener("click", handleClick, false);
  container.addEventListener("keydown", handleKeyboard, false);

  // outside click to flip back
  document.addEventListener(
    "click",
    (e) => {
      if (flippedCard && !flippedCard.contains(e.target)) {
        flipCard(flippedCard, false);
      }
    },
    false
  );

  // Escape key to flip back
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape" && flippedCard) {
        flipCard(flippedCard, false);
      }
    },
    false
  );

  function handleClick(e) {
    // Close button
    if (e.target.classList.contains("program-card__close")) {
      e.preventDefault();
      e.stopPropagation();
      const card = e.target.closest(".program-card");
      if (card) flipCard(card, false);
      return;
    }

    // Flip button
    if (e.target.classList.contains("program-card__btn--secondary")) {
      e.preventDefault();
      e.stopPropagation();
      const card = e.target.closest(".program-card");
      if (!card) return;

      const isFlipped = card.getAttribute("aria-expanded") === "true";
      flipCard(card, !isFlipped);
      return;
    }

    // Primary CTA clicks work normally
    if (e.target.classList.contains("program-card__btn--primary")) {
      return;
    }
  }

  function handleKeyboard(e) {
    const card = e.target.closest(".program-card");
    if (!card) return;

    // Enter or Space on More Info button
    if (
      (e.key === "Enter" || e.key === " ") &&
      e.target.classList.contains("program-card__btn--secondary")
    ) {
      e.preventDefault();
      const isFlipped = card.getAttribute("aria-expanded") === "true";
      flipCard(card, !isFlipped);
    }
  }

  function renderCard(program, position) {
    const article = document.createElement("article");
    article.className = "program-card";
    article.id = program.id;
    article.setAttribute("aria-expanded", "false");
    article.dataset.position = String(position);

    const isSoldOut = program.spotsLeft === 0;
    console.log(program);
    article.innerHTML = `
          <div class="program-card__flipper">
            <!-- FRONT FACE -->
            <div class="program-card__front">
              <img src="${program.thumbnail}" alt="${program.alt}"
                   class="program-card__image" loading="lazy" />
              <div class="program-card__content">
                <div class="program-card__header">
                  <span class="program-card__category program-card__category--${
                    program.category
                  }">${program.category}</span>
                  <h2 class="program-card__title" id="${program.id}-title">${
      program.title
    }</h2>
                </div>

                <div class="program-card__meta">
                  <div class="program-card__meta-item">📚 ${
                    program.ageGrade
                  }</div>
                  <div class="program-card__meta-item">⏰ ${
                    program.duration
                  }</div>
                  <div class="program-card__meta-item">📍 ${
                    program.location
                  }</div>
                  <div class="program-card__meta-item">📅 ${
                    program.dateRange
                  }</div>
                  ${
                    program.price
                      ? `<div class="program-card__meta-item">💰 ${program.price}</div>`
                      : ""
                  }
                </div>

                ${
                  Array.isArray(program.tags) && program.tags.length
                    ? `
                <div class="program-card__tags">
                  ${program.tags
                    .slice(0, 3)
                    .map((t) => `<span class="program-card__tag">${t}</span>`)
                    .join("")}
                </div>`
                    : ""
                }

                ${
                  program.spotsLeft !== undefined
                    ? `
                <div class="program-card__spots">${
                  isSoldOut
                    ? "Sold Out"
                    : `Only ${program.spotsLeft} spots left!`
                }</div>`
                    : ""
                }

                <div class="program-card__actions">
                  <button class="program-card__btn program-card__btn--secondary" aria-label="Show more information about ${
                    program.title
                  }"
                   aria-controls="${program.id}-back"
                  type="button">
                    More Info
                  </button>
                  <a href="${program.ctaHref}"
                     class="program-card__btn ${
                       isSoldOut
                         ? "program-card__btn--disabled"
                         : "program-card__btn--primary"
                     }"
                     ${isSoldOut ? 'aria-disabled="true" tabindex="-1"' : ""}>
                    ${isSoldOut ? "Waitlist" : program.ctaText}
                  </a>
                </div>
              </div>
            </div>

            <!-- BACK FACE -->
            <div class="program-card__back" role="region" aria-labelledby="${
              program.id
            }-title" aria-hidden="true">
              <div class="program-card__back-content">
                <div class="program-card__back-header">
                  <h3 class="program-card__back-title">${program.title}</h3>
                  <button class="program-card__close" type="button" aria-label="Close details">✕</button>
                </div>

                <p class="program-card__blurb">${program.shortBlurb}</p>

                <ul class="program-card__detail-list">
                  ${program.details
                    .map(
                      (d) => `<li class="program-card__detail-item">${d}</li>`
                    )
                    .join("")}
                </ul>

                <div class="program-card__back-cta">
                  <a href="${program.ctaHref}"
                     class="program-card__btn ${
                       isSoldOut
                         ? "program-card__btn--disabled"
                         : "program-card__btn--primary"
                     }"
                     style="width:100%"
                     ${isSoldOut ? 'aria-disabled="true" tabindex="-1"' : ""}>
                    ${isSoldOut ? "Join Waitlist" : program.ctaText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
    return article;
  }

  function flipCard(card, shouldFlip) {
    const front = card.querySelector(".program-card__front");
    const back = card.querySelector(".program-card__back");
    const flipBtn = card.querySelector(".program-card__btn--secondary");

    if (shouldFlip) {
      // Close any other flipped card
      if (flippedCard && flippedCard !== card) {
        flipCard(flippedCard, false);
      }

      card.setAttribute("aria-expanded", "true");
      back.setAttribute("aria-hidden", "false");
      front.setAttribute("aria-hidden", "true");

      // Make back tabbable, front not tabbable
      front
        .querySelectorAll("a, button")
        .forEach((el) => el.setAttribute("tabindex", "-1"));
      back
        .querySelectorAll("a, button")
        .forEach((el) => el.removeAttribute("tabindex"));

      flippedCard = card;

      if (typeof opts.analytics === "function") {
        const title =
          card.querySelector(".program-card__title")?.textContent?.trim() || "";
        const category =
          card.querySelector(".program-card__category")?.textContent?.trim() ||
          "";
        opts.analytics("card_flip", {
          id: card.id,
          title,
          category,
          position: Number(card.dataset.position || 0),
        });
      }
    } else {
      card.setAttribute("aria-expanded", "false");
      back.setAttribute("aria-hidden", "true");
      front.setAttribute("aria-hidden", "false");

      // Make front tabbable, back not tabbable
      front
        .querySelectorAll("a, button")
        .forEach((el) => el.removeAttribute("tabindex"));
      back
        .querySelectorAll("a, button")
        .forEach((el) => el.setAttribute("tabindex", "-1"));

      if (flippedCard === card) {
        flippedCard = null;
      }

      flipBtn?.focus();

      if (typeof opts.analytics === "function") {
        const title =
          card.querySelector(".program-card__title")?.textContent?.trim() || "";
        const category =
          card.querySelector(".program-card__category")?.textContent?.trim() ||
          "";
        opts.analytics("card_flip_back", {
          id: card.id,
          title,
          category,
          position: Number(card.dataset.position || 0),
        });
      }
    }
  }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("programCardsGrid");
  const data = await loadPrograms();

  if (!data.length) {
    container.innerHTML =
      '<p style="text-align:center;color:#666">Failed to load programs. Check <code>programs.json</code>.</p>';
    return;
  }

  initProgramCards(container, data, {
    interaction: "flip",
    lineClamp: { title: 2 },
    analytics: (event, payload) => console.log(event, payload),
  });
});
