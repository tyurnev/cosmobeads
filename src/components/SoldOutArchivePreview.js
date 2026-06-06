export function SoldOutArchivePreview({ archive }) {
  return `
    <section class="section archive-section" id="archive" aria-labelledby="archive-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">${archive.eyebrow}</p>
          <h2 id="archive-title">${archive.title}</h2>
        </div>
        <a class="mini-link" href="${archive.link.href}">${archive.link.label}</a>
      </div>

      <div class="archive-card">
        <div class="archive-grid" aria-label="Архив распроданных украшений">
          ${archive.items
            .map(
              (item) => `
                <figure>
                  <img src="${item.image}" alt="${item.imageAlt}" />
                  <figcaption>${item.caption}</figcaption>
                </figure>
              `,
            )
            .join("")}
        </div>
        <div class="archive-copy">
          <p class="eyebrow">${archive.copy.eyebrow}</p>
          <h3>${archive.copy.title}</h3>
          <p>${archive.copy.text}</p>
          <a class="button primary compact" href="${archive.copy.cta.href}">${archive.copy.cta.label}</a>
        </div>
      </div>
    </section>
  `;
}
