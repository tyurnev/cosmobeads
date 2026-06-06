import { BeadDivider } from "./BeadDivider.js";

function SideRails({ left, right }) {
  return `
    <div class="side-rail side-rail-left" aria-hidden="true">
      <div class="side-window">
        <div class="window-title">${left.title}</div>
        <img src="${left.image}" alt="" />
      </div>
      ${BeadDivider()}
      <div class="sticker sticker-folder">${left.sticker}</div>
    </div>

    <div class="side-rail side-rail-right" aria-hidden="true">
      <div class="side-window tall">
        <div class="window-title">${right.title}</div>
        <img src="${right.image}" alt="" />
      </div>
      <div class="chrome-chip">${right.chip}</div>
      ${BeadDivider({ variant: "small" })}
    </div>
  `;
}

export function HeroPortal({ hero }) {
  return `
    ${SideRails(hero.sideRails)}

    <section class="hero-section" aria-labelledby="hero-title">
      <div class="portal-strip" aria-hidden="true">
        ${hero.portalStrip.map((item) => `<span>${item}</span>`).join("")}
      </div>

      <article class="hero-card">
        <img src="${hero.image}" alt="${hero.imageAlt}" />
        <div class="hero-overlay">
          <p class="eyebrow">${hero.eyebrow}</p>
          <h1 id="hero-title">${hero.title}</h1>
          <p class="hero-copy">${hero.copy}</p>
          <div class="hero-actions">
            <a class="button primary" href="${hero.primaryCta.href}">${hero.primaryCta.label}</a>
            <a class="button secondary" href="${hero.secondaryCta.href}">${hero.secondaryCta.label}</a>
          </div>
        </div>
        <span class="pixel-star star-a" aria-hidden="true"></span>
        <span class="pixel-star star-b" aria-hidden="true"></span>
        <span class="cursor-sticker" aria-hidden="true"></span>
        <span class="hero-badge" aria-hidden="true">made by hand</span>
      </article>
    </section>
  `;
}
