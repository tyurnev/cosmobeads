import { getHomepageData } from "./data/homepageData.js";
import {
  contactLinks,
  getCheckoutPath,
  getProductBadge,
  getProductStock,
  toProductPreviewCard,
} from "./data/productDisplay.js";
import { getCurrentDrop, getCurrentDropProducts, getProductBySlug, PRODUCT_STATUSES } from "./data/products.js";
import { siteConfig } from "./data/siteConfig.js";
import { ProductPreviewCard } from "./components/ProductPreviewCard.js";
import { SiteHeader } from "./components/SiteHeader.js";
import { StickerBadge } from "./components/StickerBadge.js";
import { Y2KWindowCard } from "./components/Y2KWindowCard.js";
import { classNames } from "./components/html.js";

const homeSectionLink = (item) => ({
  ...item,
  href: item.href.startsWith("#") ? `/${item.href}` : item.href,
});

function getProductHeaderData() {
  const homepageData = getHomepageData();

  return {
    ...homepageData.header,
    homeHref: "/",
    leftNav: homepageData.header.leftNav.map(homeSectionLink),
    rightNav: homepageData.header.rightNav.map(homeSectionLink),
    mobileNav: homepageData.header.mobileNav.map(homeSectionLink),
  };
}

function ProductNotFoundPage() {
  return `
    ${SiteHeader(getProductHeaderData())}
    <main class="product-page-main">
      <section class="section product-not-found" aria-labelledby="missing-product-title">
        ${Y2KWindowCard({
          title: "missing-file.exe",
          tag: "article",
          className: "product-cart-window",
          children: `
            <div class="product-cart-body">
              <p class="eyebrow">404 artifact</p>
              <h1 id="missing-product-title">Украшение не найдено</h1>
              <p class="product-detail-description">Этот файл уже улетел из папки Cosmo Beads. Можно вернуться в текущий дроп и выбрать другой блестящий артефакт.</p>
              <a class="button primary product-main-cta" href="/#drop">Смотреть дроп</a>
            </div>
          `,
        })}
      </section>
    </main>
  `;
}

function ProductGallery({ product, gallery }) {
  const [mainImage] = gallery;

  return Y2KWindowCard({
    title: product.display.windowTitle,
    tag: "div",
    className: "product-gallery-window",
    children: `
      <div class="product-gallery" data-product-gallery>
        <div class="product-gallery-main">
          <img src="${mainImage.image}" alt="${mainImage.imageAlt}" data-gallery-main />
        </div>
        <div class="product-gallery-thumbs" aria-label="Галерея изделия">
          ${gallery
            .map(
              (item, index) => `
                <button
                  class="gallery-thumb${index === 0 ? " is-active" : ""}"
                  type="button"
                  aria-label="Показать фото ${index + 1}"
                  aria-pressed="${index === 0 ? "true" : "false"}"
                  data-gallery-image="${item.image}"
                  data-gallery-alt="${item.imageAlt}"
                >
                  <img src="${item.image}" alt="" />
                </button>
              `,
            )
            .join("")}
        </div>
      </div>
    `,
  });
}

function ProductActions({ product, isSoldOut }) {
  if (isSoldOut) {
    return `
      <button class="button primary product-main-cta is-disabled" type="button" disabled>Sold out</button>
      <a class="button secondary product-secondary-cta" href="${contactLinks.telegram}">Сообщить о похожем</a>
    `;
  }

  return `
    <a class="button primary product-main-cta" href="${getCheckoutPath(product)}" data-buy-product="${product.slug}">Купить</a>
    <a class="button secondary product-secondary-cta" href="${contactLinks.instagram}">Написать в Instagram</a>
  `;
}

function ProductBuyPanel({ product, currentDrop }) {
  const badge = getProductBadge(product);
  const stock = getProductStock(product);
  const isSoldOut = product.status === PRODUCT_STATUSES.SOLD_OUT;

  return Y2KWindowCard({
    title: isSoldOut ? "archive-cart.exe" : "cosmo-cart.exe",
    tag: "aside",
    className: "product-cart-window",
    children: `
      <div class="product-cart-body">
        <p class="eyebrow">${currentDrop?.releaseLabel ?? "cosmic drop"}</p>
        <h1 id="product-title">${product.name}</h1>
        <p class="product-detail-description">${product.details.emotionalDescription}</p>

        <div class="product-detail-meta-row">
          ${StickerBadge(badge)}
          <span class="${classNames("stock", stock.tone)}">${isSoldOut ? "Sold out" : stock.label}</span>
        </div>

        <p class="product-detail-price">${product.price.display}</p>

        <div class="product-action-stack">
          ${ProductActions({ product, isSoldOut })}
        </div>

        <p class="product-contact-note">
          ${siteConfig.orderContactExplanation}
        </p>
      </div>
    `,
  });
}

function DetailWindow({ title, eyebrow, children }) {
  return Y2KWindowCard({
    title,
    tag: "article",
    className: "product-info-window",
    children: `
      <div class="product-info-window-body">
        <p class="eyebrow">${eyebrow}</p>
        ${children}
      </div>
    `,
  });
}

function ProductInfoSection({ product }) {
  return `
    <section class="section product-info-section" aria-label="Детали изделия">
      ${DetailWindow({
        title: "materials.txt",
        eyebrow: "materials",
        children: `
          <div class="product-chip-list">
            ${product.details.materials.map((material) => `<span>${material}</span>`).join("")}
          </div>
        `,
      })}

      ${DetailWindow({
        title: "size-length.txt",
        eyebrow: "size / length",
        children: `<p>${product.details.size}</p>`,
      })}

      ${DetailWindow({
        title: "care-info.txt",
        eyebrow: "care",
        children: `
          <ul class="product-detail-list">
            ${product.details.care.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        `,
      })}

      ${DetailWindow({
        title: "delivery-russia.txt",
        eyebrow: "delivery",
        children: `<p>${product.details.delivery}</p>`,
      })}
    </section>
  `;
}

function RelatedStrip({ product }) {
  const relatedProducts = getCurrentDropProducts()
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3)
    .map(toProductPreviewCard);

  return `
    <section class="section product-related-section" aria-labelledby="related-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">same folder</p>
          <h2 id="related-title">Еще артефакты</h2>
        </div>
        <a class="mini-link" href="/#drop">all pieces</a>
      </div>
      <div class="product-grid product-related-grid">
        ${relatedProducts.map(ProductPreviewCard).join("")}
      </div>
    </section>
  `;
}

function ProductContactBand({ isSoldOut }) {
  return `
    <section class="product-contact-band" aria-label="Контакты для заказа">
      <div>
        <p class="eyebrow">${isSoldOut ? "waitlist portal" : "cosmo contact"}</p>
        <h2>${isSoldOut ? "Поймать похожий вайб" : "Забрать изделие из папки"}</h2>
        <p>
          ${isSoldOut
            ? "Напиши, если хочется похожую версию: подберем бусины, длину и настроение под новый мини-дроп."
            : siteConfig.orderContactExplanation}
        </p>
      </div>
      <div class="product-contact-actions">
        <a class="button primary compact" href="${contactLinks.telegram}">Telegram</a>
        <a class="button secondary compact" href="${contactLinks.instagram}">Instagram</a>
      </div>
    </section>
  `;
}

function MobileStickyBuy({ product, isSoldOut }) {
  if (isSoldOut) {
    return `
      <div class="mobile-sticky-buy">
        <button class="button primary is-disabled" type="button" disabled>Sold out</button>
        <a class="button secondary" href="${contactLinks.telegram}">Сообщить о похожем</a>
      </div>
    `;
  }

  return `
    <div class="mobile-sticky-buy">
      <a class="button primary" href="${getCheckoutPath(product)}" data-buy-product="${product.slug}">Купить за ${product.price.display}</a>
    </div>
  `;
}

export function ProductDetailPage({ slug }) {
  const product = getProductBySlug(slug);

  if (!product) {
    return ProductNotFoundPage();
  }

  const currentDrop = getCurrentDrop();
  const gallery = product.media.gallery.length ? product.media.gallery : [product.media];
  const badge = getProductBadge(product);
  const isSoldOut = product.status === PRODUCT_STATUSES.SOLD_OUT;

  return `
    ${SiteHeader(getProductHeaderData())}

    <main class="product-page-main">
      <section class="product-detail-hero" aria-labelledby="product-title">
        <div class="portal-strip product-portal-strip" aria-hidden="true">
          <span>product artifact</span>
          <span>${product.display.windowTitle}</span>
          <span>${badge.label}</span>
        </div>

        <div class="product-detail-layout">
          <div class="product-gallery-side">
            ${ProductGallery({ product, gallery })}
            <div class="sticker product-artifact-sticker">handmade</div>
            <div class="chrome-chip product-page-chip">${badge.label}</div>
          </div>

          <div class="product-copy-side">
            ${ProductBuyPanel({ product, currentDrop })}
          </div>

          <span class="pixel-star product-star-a" aria-hidden="true"></span>
          <span class="pixel-star product-star-b" aria-hidden="true"></span>
        </div>
      </section>

      ${ProductInfoSection({ product })}
      ${ProductContactBand({ isSoldOut })}
      ${RelatedStrip({ product })}
    </main>

    ${MobileStickyBuy({ product, isSoldOut })}
  `;
}

export function bindProductGallery(root = document) {
  root.querySelectorAll("[data-product-gallery]").forEach((gallery) => {
    const mainImage = gallery.querySelector("[data-gallery-main]");
    const thumbs = Array.from(gallery.querySelectorAll("[data-gallery-image]"));

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        if (!mainImage) return;

        mainImage.setAttribute("src", thumb.dataset.galleryImage);
        mainImage.setAttribute("alt", thumb.dataset.galleryAlt);

        thumbs.forEach((item) => {
          item.classList.toggle("is-active", item === thumb);
          item.setAttribute("aria-pressed", String(item === thumb));
        });
      });
    });
  });
}
