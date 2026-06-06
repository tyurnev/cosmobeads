import { TrustCard } from "./TrustCard.js";

export function TrustSection({ items }) {
  return `
    <section class="section trust-section" id="delivery" aria-labelledby="trust-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">shop notes</p>
          <h2 id="trust-title">Trust / Delivery</h2>
        </div>
      </div>

      <div class="trust-grid">
        ${items.map(TrustCard).join("")}
      </div>
    </section>
  `;
}
