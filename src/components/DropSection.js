import { ProductPreviewCard } from "./ProductPreviewCard.js";

export function DropSection({ products }) {
  return `
    <section class="section drop-section" id="drop" aria-labelledby="drop-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">current folder</p>
          <h2 id="drop-title">Current Drop</h2>
        </div>
        <a class="mini-link" href="#final-cta">all pieces</a>
      </div>

      <div class="product-grid">
        ${products.map(ProductPreviewCard).join("")}
      </div>
    </section>
  `;
}
