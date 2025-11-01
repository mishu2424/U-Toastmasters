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
    strings: {
      moreInfo: "More Info",
      lessInfo: "Less Info",
      soldOut: "Sold Out",
      spotsLeft: "Only {count} spots left!",
      register: "Register",
      waitlist: "Waitlist",
      joinWaitlist: "Join Waitlist",
    },
    ...options,
  };

  container.style.setProperty("--title-lines", String(opts.lineClamp.title || 2));

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

      const isFlipped = e.target.getAttribute("aria-expanded") === "true";
      flipCard(card, !isFlipped);
      return;
    }

    // Primary CTA clicks - track analytics
    if (e.target.classList.contains("program-card__btn--primary")) {
      const card = e.target.closest(".program-card");
      if (card && typeof opts.analytics === "function") {
        const title = card.querySelector(".program-card__title")?.textContent?.trim() || "";
        const category = card.querySelector(".program-card__category")?.textContent?.trim() || "";
        opts.analytics("cta_click", {
          id: card.id,
          title,
          category,
          position: Number(card.dataset.position || 0),
          href: e.target.href,
        });
      }
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
      const isFlipped = e.target.getAttribute("aria-expanded") === "true";
      flipCard(card, !isFlipped);
    }
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function formatPrice(price) {
    if (typeof price === "number") {
      return `$${price.toFixed(2)}`;
    }
    return price || "";
  }

  function renderCard(program, position) {
    const article = document.createElement("article");
    article.className = "program-card";
    article.id = program.id;
    article.dataset.position = String(position);

    const backPanelId = `${program.id}-back`;
    const isSoldOut = program.spotsLeft === 0;

    // Sanitize text content
    const safeTitle = escapeHtml(program.title || "");
    const safeBlurb = escapeHtml(program.shortBlurb || "");
    const safeAlt = escapeHtml(program.alt || "");

    // Format spots left message
    const spotsMessage = isSoldOut
      ? opts.strings.soldOut
      : opts.strings.spotsLeft.replace("{count}", program.spotsLeft);

    article.innerHTML = `
          <div class="program-card__flipper">
            <!-- FRONT FACE -->
            <div class="program-card__front" aria-hidden="false">
              <img src="${program.thumbnail}" alt="${safeAlt}"
                   class="program-card__image" loading="lazy" width="720" height="405" />
              <div class="program-card__content">
                <div class="program-card__header">
                  <span class="program-card__category program-card__category--${program.category}">${program.category}</span>
                  <h2 class="program-card__title" id="${program.id}-title">${safeTitle}</h2>
                </div>

                <div class="program-card__meta">
                  <div class="program-card__meta-item">📚 ${program.ageGrade}</div>
                  <div class="program-card__meta-item">⏰ ${program.duration}</div>
                  <div class="program-card__meta-item">📍 ${program.location}</div>
                  <div class="program-card__meta-item">📅 ${program.dateRange}</div>
                  ${program.price ? `<div class="program-card__meta-item">💰 ${formatPrice(program.price)}</div>` : ""}
                </div>

                ${Array.isArray(program.tags) && program.tags.length ? `
                <div class="program-card__tags">
                  ${program.tags.slice(0, 3).map(t => `<span class="program-card__tag">${escapeHtml(t)}</span>`).join("")}
                </div>` : ""}

                ${program.spotsLeft !== undefined ? `
                <div class="program-card__spots">${spotsMessage}</div>` : ""}

                <div class="program-card__actions">
                  <button class="program-card__btn program-card__btn--secondary" 
                          aria-label="Show more information about ${safeTitle}"
                          aria-controls="${backPanelId}"
                          aria-expanded="false"
                          type="button">
                    ${opts.strings.moreInfo}
                  </button>
                  ${isSoldOut ? `
                  <span class="program-card__btn program-card__btn--disabled"
                        aria-disabled="true">
                    ${opts.strings.waitlist}
                  </span>` : `
                  <a href="${program.ctaHref}"
                     class="program-card__btn program-card__btn--primary">
                    ${opts.strings.register}
                  </a>`}
                </div>
              </div>
            </div>

            <!-- BACK FACE -->
            <div class="program-card__back" 
                 id="${backPanelId}"
                 role="region" 
                 aria-labelledby="${program.id}-title" 
                 aria-hidden="true">
              <div class="program-card__back-content">
                <div class="program-card__back-header">
                  <h3 class="program-card__back-title" id="${program.id}-back-title" tabindex="-1">${safeTitle}</h3>
                  <button class="program-card__close" type="button" aria-label="Close details" tabindex="-1">✕</button>
                </div>

                <p class="program-card__blurb">${safeBlurb}</p>

                ${Array.isArray(program.details) && program.details.length ? `
                <ul class="program-card__detail-list">
                  ${program.details.map(d => `<li class="program-card__detail-item">${escapeHtml(d)}</li>`).join("")}
                </ul>` : ""}

                <div class="program-card__back-cta">
                  ${isSoldOut ? `
                  <span class="program-card__btn program-card__btn--disabled"
                        style="width:100%; display:block; text-align:center;"
                        aria-disabled="true">
                    ${opts.strings.joinWaitlist}
                  </span>` : `
                  <a href="${program.ctaHref}"
                     class="program-card__btn program-card__btn--primary"
                     style="width:100%; display:block; text-align:center;"
                     tabindex="-1">
                    ${opts.strings.register}
                  </a>`}
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
    const backTitle = card.querySelector(".program-card__back-title");

    if (shouldFlip) {
      // Close any other flipped card
      if (flippedCard && flippedCard !== card) {
        flipCard(flippedCard, false);
      }

      // Update button state (source of truth)
      flipBtn.setAttribute("aria-expanded", "true");
      flipBtn.textContent = opts.strings.lessInfo;

      // Update panel states
      back.setAttribute("aria-hidden", "false");
      front.setAttribute("aria-hidden", "true");
      
      // Set data attribute on card for CSS styling only (not for AT)
      card.dataset.flipped = "true";

      // Make back tabbable, front not tabbable
      front.querySelectorAll("a, button").forEach((el) => el.setAttribute("tabindex", "-1"));
      back.querySelectorAll("a, button").forEach((el) => el.removeAttribute("tabindex"));

      flippedCard = card;

      // Move focus to back title for screen reader context
      setTimeout(() => {
        if (backTitle) backTitle.focus();
      }, 300);

      if (typeof opts.analytics === "function") {
        const title = card.querySelector(".program-card__title")?.textContent?.trim() || "";
        const category = card.querySelector(".program-card__category")?.textContent?.trim() || "";
        opts.analytics("card_flip", {
          id: card.id,
          title,
          category,
          position: Number(card.dataset.position || 0),
        });
      }
    } else {
      // Update button state (source of truth)
      flipBtn.setAttribute("aria-expanded", "false");
      flipBtn.textContent = opts.strings.moreInfo;

      // Update panel states
      back.setAttribute("aria-hidden", "true");
      front.setAttribute("aria-hidden", "false");
      
      // Remove data attribute
      delete card.dataset.flipped;

      // Make front tabbable, back not tabbable
      front.querySelectorAll("a, button").forEach((el) => el.removeAttribute("tabindex"));
      back.querySelectorAll("a, button").forEach((el) => el.setAttribute("tabindex", "-1"));

      if (flippedCard === card) {
        flippedCard = null;
      }

      // Return focus to More Info button
      flipBtn?.focus();

      if (typeof opts.analytics === "function") {
        const title = card.querySelector(".program-card__title")?.textContent?.trim() || "";
        const category = card.querySelector(".program-card__category")?.textContent?.trim() || "";
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
    container.innerHTML = '<p style="text-align:center;color:#666">Failed to load programs. Check <code>programs.json</code>.</p>';
    return;
  }

  initProgramCards(container, data, {
    interaction: "flip",
    lineClamp: { title: 2 },
    analytics: (event, payload) => console.log(event, payload),
  });
});