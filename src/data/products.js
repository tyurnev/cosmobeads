// @ts-check

import { siteConfig } from "./siteConfig.js";

const fallbackProductImage = "/assets/hero-portal.jpg";
const fallbackDeliveryText = siteConfig.deliveryText;

/**
 * @typedef {"available" | "sold_out" | "hidden"} ProductStatus
 * @typedef {"1 of 1" | "new drop" | "last piece" | "sold out"} ProductBadge
 * @typedef {"current" | "past" | "upcoming"} DropStatus
 *
 * @typedef {object} ProductPrice
 * @property {number} amount
 * @property {string} currency
 * @property {string} display
 *
 * @typedef {object} ProductStock
 * @property {number} quantity
 * @property {string} label
 * @property {"piece" | "set"} unit
 *
 * @typedef {object} ProductMedia
 * @property {string} image
 * @property {string} imageAlt
 * @property {{ image: string, imageAlt: string }[]} gallery
 *
 * @typedef {object} ProductDetails
 * @property {string} emotionalDescription
 * @property {string[]} materials
 * @property {string} size
 * @property {string[]} care
 * @property {string} delivery
 *
 * @typedef {object} ProductDisplay
 * @property {string} windowTitle
 * @property {string} availableCtaLabel
 * @property {string} soldOutCtaLabel
 *
 * @typedef {object} Product
 * @property {string} id
 * @property {string} slug
 * @property {string} dropId
 * @property {string} name
 * @property {string} description
 * @property {ProductStatus} status
 * @property {ProductBadge[]} badges
 * @property {ProductPrice} price
 * @property {ProductStock} stock
 * @property {ProductMedia} media
 * @property {ProductDetails} details
 * @property {ProductDisplay} display
 * @property {number} sortOrder
 * @property {string} archiveCaption
 *
 * @typedef {object} Drop
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} eyebrow
 * @property {DropStatus} status
 * @property {string} releaseLabel
 * @property {string} releasedAt
 * @property {string[]} productIds
 */

export const CONTENT_CATALOG_ENDPOINT = "/api/content/catalog/";
export const CURRENT_DROP_ENDPOINT = "/api/drops/current/";
export const PRODUCTS_ENDPOINT = "/api/products/";
export const PRODUCT_DETAIL_ENDPOINT = "/api/products/";

export const PRODUCT_STATUSES = Object.freeze({
  AVAILABLE: "available",
  SOLD_OUT: "sold_out",
  HIDDEN: "hidden",
});

export const PRODUCT_BADGES = Object.freeze({
  ONE_OF_ONE: "1 of 1",
  NEW_DROP: "new drop",
  LAST_PIECE: "last piece",
  SOLD_OUT: "sold out",
});

const productStatusValues = new Set(Object.values(PRODUCT_STATUSES));
const productBadgeValues = new Set(Object.values(PRODUCT_BADGES));
const dropStatusValues = new Set(["current", "past", "upcoming"]);

/** @type {Product[]} */
export let products = [];

/** @type {Drop[]} */
export let drops = [];

function toText(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function toStringArray(value, objectKeys = []) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        const matchingKey = objectKeys.find((key) => toText(item[key]));
        return matchingKey ? toText(item[matchingKey]) : "";
      }

      return "";
    })
    .filter(Boolean);
}

function normalizeImagePath(value, fallback = fallbackProductImage) {
  const imagePath = toText(value);

  if (!imagePath) {
    return fallback;
  }

  if (/^(https?:|data:|\/)/.test(imagePath)) {
    return imagePath;
  }

  return `/${imagePath.replace(/^\/+/, "")}`;
}

function formatRubPrice(amount) {
  if (!amount) {
    return "цена по запросу";
  }

  return `${amount.toLocaleString("ru-RU")} ₽`;
}

function normalizeProductStatus(value) {
  const status = toText(value);
  return productStatusValues.has(status) ? /** @type {ProductStatus} */ (status) : PRODUCT_STATUSES.HIDDEN;
}

function normalizeDropStatus(value) {
  const status = toText(value);
  return dropStatusValues.has(status) ? /** @type {DropStatus} */ (status) : "past";
}

function normalizeBadges(value, status) {
  const badges = toStringArray(value).filter((badge) => productBadgeValues.has(badge));

  if (status === PRODUCT_STATUSES.SOLD_OUT && !badges.includes(PRODUCT_BADGES.SOLD_OUT)) {
    return [PRODUCT_BADGES.SOLD_OUT, ...badges];
  }

  return /** @type {ProductBadge[]} */ (badges);
}

function normalizeStock(rawStock, status, badges) {
  const quantity = Math.max(0, Math.floor(toNumber(rawStock?.quantity, status === PRODUCT_STATUSES.SOLD_OUT ? 0 : 1)));
  const unit = rawStock?.unit === "set" ? "set" : "piece";
  const fallbackLabel =
    status === PRODUCT_STATUSES.SOLD_OUT
      ? "архив"
      : badges.includes(PRODUCT_BADGES.LAST_PIECE)
        ? "последняя"
        : `в наличии: ${quantity} ${unit === "set" ? "сет" : "шт."}`;

  return {
    quantity,
    label: toText(rawStock?.label, fallbackLabel),
    unit,
  };
}

function normalizeGallery(rawGallery, mainImage, productName) {
  const gallery = Array.isArray(rawGallery)
    ? rawGallery
        .map((item, index) => {
          if (typeof item === "string") {
            return {
              image: normalizeImagePath(item, mainImage.image),
              imageAlt: `${productName} photo ${index + 1}`,
            };
          }

          if (!item || typeof item !== "object") {
            return null;
          }

          const image = normalizeImagePath(item.image, mainImage.image);

          return {
            image,
            imageAlt: toText(item.imageAlt, `${productName} photo ${index + 1}`),
          };
        })
        .filter(Boolean)
    : [];

  return gallery.length ? gallery : [mainImage];
}

/**
 * @param {unknown} rawProduct
 * @param {number} index
 * @returns {Product}
 */
export function normalizeProduct(rawProduct, index = 0) {
  const raw = rawProduct && typeof rawProduct === "object" ? rawProduct : {};
  const id = toText(raw.id, toText(raw.slug, `product-${index + 1}`));
  const slug = toText(raw.slug, id);
  const name = toText(raw.name, "Cosmo Beads piece");
  const status = normalizeProductStatus(raw.status);
  const badges = normalizeBadges(raw.badges, status);
  const amount = Math.max(0, Math.floor(toNumber(raw.price?.amount)));
  const mediaImage = normalizeImagePath(raw.media?.image);
  const mainMedia = {
    image: mediaImage,
    imageAlt: toText(raw.media?.imageAlt, `${name} by ${siteConfig.brandName}`),
  };

  return {
    id,
    slug,
    dropId: toText(raw.dropId, "uncategorized"),
    name,
    description: toText(raw.description, "Handmade Cosmo Beads piece."),
    status,
    badges,
    price: {
      amount,
      currency: toText(raw.price?.currency, "RUB"),
      display: toText(raw.price?.display, formatRubPrice(amount)),
    },
    stock: normalizeStock(raw.stock, status, badges),
    media: {
      ...mainMedia,
      gallery: normalizeGallery(raw.media?.gallery, mainMedia, name),
    },
    details: {
      emotionalDescription: toText(raw.details?.emotionalDescription, "A tiny handmade artifact from the Cosmo Beads universe."),
      materials: toStringArray(raw.details?.materials, ["material"]).length
        ? toStringArray(raw.details?.materials, ["material"])
        : ["handmade beads"],
      size: toText(raw.details?.size, "Размер уточним перед подтверждением заявки."),
      care: toStringArray(raw.details?.care, ["careItem"]).length
        ? toStringArray(raw.details?.care, ["careItem"])
        : ["хранить отдельно", "беречь от воды и косметики"],
      delivery: toText(raw.details?.delivery, fallbackDeliveryText),
    },
    display: {
      windowTitle: toText(raw.display?.windowTitle, "product.exe"),
      availableCtaLabel: toText(raw.display?.availableCtaLabel, "Забрать"),
      soldOutCtaLabel: toText(raw.display?.soldOutCtaLabel, "Смотреть"),
    },
    sortOrder: Math.floor(toNumber(raw.sortOrder, index + 1)),
    archiveCaption: toText(raw.archiveCaption, name),
  };
}

/**
 * @param {unknown} rawDrop
 * @param {number} index
 * @returns {Drop}
 */
export function normalizeDrop(rawDrop, index = 0) {
  const raw = rawDrop && typeof rawDrop === "object" ? rawDrop : {};
  const id = toText(raw.id, toText(raw.slug, `drop-${index + 1}`));

  return {
    id,
    slug: toText(raw.slug, id),
    title: toText(raw.title, "Cosmo Beads Drop"),
    eyebrow: toText(raw.eyebrow, "current folder"),
    status: normalizeDropStatus(raw.status),
    releaseLabel: toText(raw.releaseLabel, "cosmic drop"),
    releasedAt: toText(raw.releasedAt),
    productIds: toStringArray(raw.productIds, ["id", "value"]),
  };
}

/**
 * @param {{ products?: unknown[], drops?: unknown[] }} catalog
 * @returns {{ products: Product[], drops: Drop[] }}
 */
export function normalizeCatalog(catalog = {}) {
  const normalizedProducts = (Array.isArray(catalog.products) ? catalog.products : [])
    .map(normalizeProduct)
    .sort((first, second) => first.sortOrder - second.sortOrder);
  const normalizedDrops = (Array.isArray(catalog.drops) ? catalog.drops : []).map(normalizeDrop);

  return {
    products: normalizedProducts,
    drops: normalizedDrops,
  };
}

/**
 * @param {{ products?: unknown[], drops?: unknown[] }} catalog
 * @returns {{ products: Product[], drops: Drop[] }}
 */
export function setProductCatalog(catalog) {
  const normalizedCatalog = normalizeCatalog(catalog);
  products = normalizedCatalog.products;
  drops = normalizedCatalog.drops;

  return normalizedCatalog;
}

export function getProductCatalog() {
  return { products, drops };
}

async function fetchJson(fetcher, endpoint) {
  const response = await fetcher(endpoint, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Не получилось загрузить товары.");
  }

  return response.json();
}

export async function loadProductCatalog({
  currentDropEndpoint = CURRENT_DROP_ENDPOINT,
  productsEndpoint = PRODUCTS_ENDPOINT,
  fallbackEndpoint = CONTENT_CATALOG_ENDPOINT,
  fetcher = globalThis.fetch,
} = {}) {
  if (typeof fetcher !== "function") {
    return getProductCatalog();
  }

  try {
    const [currentDropPayload, productsPayload] = await Promise.all([
      fetchJson(fetcher, currentDropEndpoint),
      fetchJson(fetcher, productsEndpoint),
    ]);

    return setProductCatalog({
      drops: currentDropPayload.drop ? [currentDropPayload.drop] : currentDropPayload.drops,
      products: productsPayload.products ?? currentDropPayload.products,
    });
  } catch {
    return setProductCatalog(await fetchJson(fetcher, fallbackEndpoint));
  }
}

export async function loadProductBySlug(slug, { endpoint = PRODUCT_DETAIL_ENDPOINT, fetcher = globalThis.fetch } = {}) {
  if (typeof fetcher !== "function") {
    return getProductBySlug(slug);
  }

  const payload = await fetchJson(fetcher, `${endpoint}${slug}/`);
  const product = normalizeProduct(payload.product ?? payload);
  const remainingProducts = products.filter((item) => item.slug !== product.slug);
  products = [...remainingProducts, product].sort((first, second) => first.sortOrder - second.sortOrder);

  return product;
}

/**
 * @param {Product | undefined} product
 * @returns {product is Product}
 */
function isVisibleProduct(product) {
  return Boolean(product) && product.status !== PRODUCT_STATUSES.HIDDEN;
}

/**
 * @param {Drop[]} sourceDrops
 * @returns {Drop | undefined}
 */
export function getCurrentDrop(sourceDrops = drops) {
  return sourceDrops.find((drop) => drop.status === "current") ?? sourceDrops[0];
}

/**
 * @param {Product[]} sourceProducts
 * @returns {Product[]}
 */
export function getAvailableProducts(sourceProducts = products) {
  return sourceProducts.filter((product) => product.status === PRODUCT_STATUSES.AVAILABLE);
}

/**
 * @param {Product[]} sourceProducts
 * @returns {Product[]}
 */
export function getSoldOutProducts(sourceProducts = products) {
  return sourceProducts.filter((product) => product.status === PRODUCT_STATUSES.SOLD_OUT);
}

/**
 * @param {string} slug
 * @param {Product[]} sourceProducts
 * @returns {Product | undefined}
 */
export function getProductBySlug(slug, sourceProducts = products) {
  return sourceProducts.find((product) => product.slug === slug && product.status !== PRODUCT_STATUSES.HIDDEN);
}

/**
 * @param {Product[]} sourceProducts
 * @param {Drop[]} sourceDrops
 * @returns {Product[]}
 */
export function getCurrentDropProducts(sourceProducts = products, sourceDrops = drops) {
  const currentDrop = getCurrentDrop(sourceDrops);

  if (!currentDrop) {
    return [];
  }

  const productsById = new Map(sourceProducts.map((product) => [product.id, product]));
  const listedProducts = currentDrop.productIds.map((productId) => productsById.get(productId));
  const listedProductIds = new Set(listedProducts.filter(Boolean).map((product) => product.id));
  const linkedProducts = sourceProducts.filter((product) => product.dropId === currentDrop.id && !listedProductIds.has(product.id));

  return [...listedProducts, ...linkedProducts]
    .filter(isVisibleProduct)
    .sort((first, second) => first.sortOrder - second.sortOrder);
}
