import { PRODUCT_BADGES, PRODUCT_STATUSES } from "./products.js";
import { siteConfig } from "./siteConfig.js";

const badgeToneByLabel = {
  [PRODUCT_BADGES.NEW_DROP]: "green",
  [PRODUCT_BADGES.LAST_PIECE]: "yellow",
  [PRODUCT_BADGES.SOLD_OUT]: "sold",
};

const stockToneByStatus = {
  [PRODUCT_STATUSES.AVAILABLE]: "in-stock",
  [PRODUCT_STATUSES.SOLD_OUT]: "sold-stock",
};

export const contactLinks = {
  telegram: siteConfig.contacts.telegramUrl,
  instagram: siteConfig.contacts.instagramUrl,
};

export function getProductPagePath(product) {
  return `/product/${product.slug}/`;
}

export function getCheckoutPath(product) {
  return `/checkout/?product=${product.slug}`;
}

export function getPrimaryBadge(product) {
  if (product.status === PRODUCT_STATUSES.SOLD_OUT) {
    return PRODUCT_BADGES.SOLD_OUT;
  }

  return product.badges[0] ?? PRODUCT_BADGES.ONE_OF_ONE;
}

export function getProductBadge(product) {
  const label = getPrimaryBadge(product);

  return {
    label,
    tone: badgeToneByLabel[label],
  };
}

export function getProductStock(product) {
  if (product.status === PRODUCT_STATUSES.SOLD_OUT) {
    return {
      label: product.stock.label,
      tone: stockToneByStatus[PRODUCT_STATUSES.SOLD_OUT],
    };
  }

  if (product.badges.includes(PRODUCT_BADGES.LAST_PIECE)) {
    return {
      label: product.stock.label,
      tone: "low-stock",
    };
  }

  return {
    label: product.stock.label,
    tone: stockToneByStatus[PRODUCT_STATUSES.AVAILABLE],
  };
}

export function toProductPreviewCard(product) {
  const isSoldOut = product.status === PRODUCT_STATUSES.SOLD_OUT;

  return {
    windowTitle: product.display.windowTitle,
    image: product.media.image,
    imageAlt: product.media.imageAlt,
    productSlug: product.slug,
    badge: getProductBadge(product),
    stock: getProductStock(product),
    name: product.name,
    price: product.price.display,
    cta: {
      label: isSoldOut ? product.display.soldOutCtaLabel : "Купить",
      href: isSoldOut ? getProductPagePath(product) : getCheckoutPath(product),
      tone: isSoldOut ? "muted" : undefined,
    },
    isSold: isSoldOut,
  };
}

export function toArchiveItem(product) {
  return {
    image: product.media.image,
    imageAlt: `Sold out ${product.name}`,
    caption: product.archiveCaption,
  };
}
