import { ProductPreviewCard } from "./ProductPreviewCard.js";

export function DropSection({ drop, products }) {
  const eyebrow = drop?.eyebrow ?? "current folder";
  const title = drop?.title ?? "Current Drop";

  return `
    <section class="section drop-section" id="drop" aria-labelledby="drop-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">${eyebrow}</p>
          <h2 id="drop-title">${title}</h2>
        </div>
        <a class="mini-link" href="#final-cta">all pieces</a>
      </div>

      <div class="product-grid">
        ${products.map(ProductPreviewCard).join("")}
      </div>
    </section>
  `;
}
