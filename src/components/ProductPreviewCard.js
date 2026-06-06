import { classNames } from "./html.js";
import { StickerBadge } from "./StickerBadge.js";
import { Y2KWindowCard } from "./Y2KWindowCard.js";

export function ProductPreviewCard(product) {
  const cardClassName = classNames("product-card", product.isSold && "sold-product");
  const buyButtonClassName = classNames("buy-button", product.cta?.tone);
  const stockClassName = classNames("stock", product.stock.tone);

  return Y2KWindowCard({
    title: product.windowTitle,
    className: cardClassName,
    children: `
      <div class="product-photo">
        <img src="${product.image}" alt="${product.imageAlt}" />
      </div>
      <div class="product-info">
        <div class="product-topline">
          ${StickerBadge(product.badge)}
          <span class="${stockClassName}">${product.stock.label}</span>
        </div>
        <h3>${product.name}</h3>
        <p class="price">${product.price}</p>
        <a class="${buyButtonClassName}" href="${product.cta.href}">${product.cta.label}</a>
      </div>
    `,
  });
}
