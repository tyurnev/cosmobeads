export function FinalCTA({ finalCta }) {
  return `
    <section class="final-cta" id="final-cta" aria-labelledby="final-title">
      <div>
        <p class="eyebrow">${finalCta.eyebrow}</p>
        <h2 id="final-title">${finalCta.title}</h2>
        <p>${finalCta.copy}</p>
      </div>
      <a class="button primary final-button" href="${finalCta.cta.href}">${finalCta.cta.label}</a>
    </section>
  `;
}
