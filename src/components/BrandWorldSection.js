import { Y2KWindowCard } from "./Y2KWindowCard.js";

export function BrandWorldSection({ brandWorld }) {
  return `
    <section class="section brand-section" id="brand" aria-labelledby="brand-title">
      <article class="brand-card">
        <div class="brand-copy">
          <p class="eyebrow">${brandWorld.eyebrow}</p>
          <h2 id="brand-title">${brandWorld.title}</h2>
          <p>${brandWorld.copy}</p>
        </div>
        ${Y2KWindowCard({
          title: brandWorld.windowTitle,
          tag: "div",
          className: "brand-mini-window",
          ariaHidden: true,
          children: `
            <div class="brand-window-body">
              ${brandWorld.notes.map((note) => `<span>${note}</span>`).join("")}
            </div>
          `,
        })}
      </article>
    </section>
  `;
}
