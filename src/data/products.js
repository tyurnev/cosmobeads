// @ts-check

const asset = (fileName) => `/assets/${fileName}`;

/**
 * @typedef {"available" | "sold_out" | "hidden"} ProductStatus
 * @typedef {"1 of 1" | "new drop" | "last piece" | "sold out"} ProductBadge
 * @typedef {"current" | "past" | "upcoming"} DropStatus
 *
 * @typedef {object} ProductPrice
 * @property {number} amount
 * @property {"RUB"} currency
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

/** @type {Product[]} */
export const products = [
  {
    id: "star-soda-necklace",
    slug: "star-soda-necklace",
    dropId: "cosmic-drop-06",
    name: "Star Soda Necklace",
    description: "Pastel glass bead necklace with a tiny star detail.",
    status: PRODUCT_STATUSES.AVAILABLE,
    badges: [PRODUCT_BADGES.ONE_OF_ONE],
    price: { amount: 2900, currency: "RUB", display: "2 900 ₽" },
    stock: { quantity: 1, label: "в наличии: 1 шт.", unit: "piece" },
    media: {
      image: asset("drop-necklace.jpg"),
      imageAlt: "Star Soda Necklace with pastel glass beads",
      gallery: [
        {
          image: asset("drop-necklace.jpg"),
          imageAlt: "Star Soda Necklace with pastel glass beads",
        },
        {
          image: asset("drop-necklace.png"),
          imageAlt: "Star Soda Necklace on a transparent pastel Y2K backdrop",
        },
      ],
    },
    details: {
      emotionalDescription:
        "A tiny soda-pop constellation for collarbones: sweet, shiny, and just dramatic enough to feel like a secret lucky file.",
      materials: ["glass beads", "acrylic star charm", "stainless steel findings", "nylon jewelry thread"],
      size: "Длина: 38 см + удлинитель 5 см",
      care: ["хранить отдельно от косметики и воды", "протирать мягкой сухой тканью", "не растягивать застежку"],
      delivery: "Доставка по России СДЭК/Почтой России после подтверждения заказа.",
    },
    display: {
      windowTitle: "necklace.exe",
      availableCtaLabel: "Забрать",
      soldOutCtaLabel: "Смотреть",
    },
    sortOrder: 10,
    archiveCaption: "Star Soda Necklace",
  },
  {
    id: "pixel-planet-charm",
    slug: "pixel-planet-charm",
    dropId: "cosmic-drop-06",
    name: "Pixel Planet Charm",
    description: "Blue and lime phone charm inspired by tiny pixel planets.",
    status: PRODUCT_STATUSES.AVAILABLE,
    badges: [PRODUCT_BADGES.NEW_DROP],
    price: { amount: 1400, currency: "RUB", display: "1 400 ₽" },
    stock: { quantity: 2, label: "в наличии: 2 шт.", unit: "piece" },
    media: {
      image: asset("drop-phone-charm.jpg"),
      imageAlt: "Pixel Planet phone charm with blue and lime beads",
      gallery: [
        {
          image: asset("drop-phone-charm.jpg"),
          imageAlt: "Pixel Planet phone charm with blue and lime beads",
        },
        {
          image: asset("drop-phone-charm.png"),
          imageAlt: "Pixel Planet phone charm on a transparent pastel Y2K backdrop",
        },
      ],
    },
    details: {
      emotionalDescription:
        "A little planet for your phone, bag, or keys: bright, bouncy, and very main-character in a flip-phone universe.",
      materials: ["glass beads", "acrylic beads", "phone strap cord", "metal loop hardware"],
      size: "Длина: около 12 см вместе с петлей",
      care: ["не дергать за петлю", "держать вдали от духов и санитайзера", "снимать перед стиркой чехла"],
      delivery: "Доставка по России СДЭК/Почтой России после подтверждения заказа.",
    },
    display: {
      windowTitle: "phone-charm.exe",
      availableCtaLabel: "Забрать",
      soldOutCtaLabel: "Смотреть",
    },
    sortOrder: 20,
    archiveCaption: "Planet Charm v1",
  },
  {
    id: "chrome-bow-bracelet",
    slug: "chrome-bow-bracelet",
    dropId: "cosmic-drop-06",
    name: "Chrome Bow Bracelet",
    description: "Pink and lavender bracelet with a chrome bow accent.",
    status: PRODUCT_STATUSES.AVAILABLE,
    badges: [PRODUCT_BADGES.LAST_PIECE],
    price: { amount: 1800, currency: "RUB", display: "1 800 ₽" },
    stock: { quantity: 1, label: "последняя", unit: "piece" },
    media: {
      image: asset("drop-bracelet.jpg"),
      imageAlt: "Chrome Bow Bracelet with pink and lavender beads",
      gallery: [
        {
          image: asset("drop-bracelet.jpg"),
          imageAlt: "Chrome Bow Bracelet with pink and lavender beads",
        },
        {
          image: asset("drop-bracelet.png"),
          imageAlt: "Chrome Bow Bracelet on a transparent pastel Y2K backdrop",
        },
      ],
    },
    details: {
      emotionalDescription:
        "Soft pink, lavender shine, and a chrome bow moment: the bracelet equivalent of saving a perfect desktop wallpaper.",
      materials: ["glass beads", "acrylic pearl beads", "chrome bow charm", "stainless steel clasp"],
      size: "Обхват: 16 см + удлинитель 4 см",
      care: ["не мочить", "хранить в мешочке или коробке", "избегать сильного натяжения"],
      delivery: "Доставка по России СДЭК/Почтой России после подтверждения заказа.",
    },
    display: {
      windowTitle: "bracelet.exe",
      availableCtaLabel: "Забрать",
      soldOutCtaLabel: "Смотреть",
    },
    sortOrder: 30,
    archiveCaption: "Pink Bow Bracelet",
  },
  {
    id: "aqua-moon-bag-charm",
    slug: "aqua-moon-bag-charm",
    dropId: "cosmic-drop-06",
    name: "Aqua Moon Bag Charm",
    description: "Peach and turquoise bag charm with a glossy moon accent.",
    status: PRODUCT_STATUSES.AVAILABLE,
    badges: [PRODUCT_BADGES.NEW_DROP],
    price: { amount: 1600, currency: "RUB", display: "1 600 ₽" },
    stock: { quantity: 1, label: "в наличии: 1 шт.", unit: "piece" },
    media: {
      image: asset("drop-bag-charm.jpg"),
      imageAlt: "Aqua Moon bag charm with peach and turquoise beads",
      gallery: [
        {
          image: asset("drop-bag-charm.jpg"),
          imageAlt: "Aqua Moon bag charm with peach and turquoise beads",
        },
        {
          image: asset("drop-bag-charm.png"),
          imageAlt: "Aqua Moon bag charm on a transparent pastel Y2K backdrop",
        },
      ],
    },
    details: {
      emotionalDescription:
        "A glossy moon charm for turning an everyday bag into a tiny portal object from your favorite 2000s folder.",
      materials: ["glass beads", "acrylic moon charm", "metal clasp", "nylon jewelry thread"],
      size: "Длина: около 14 см вместе с карабином",
      care: ["снимать перед дождем", "не цеплять за тяжелые предметы", "протирать сухой тканью"],
      delivery: "Доставка по России СДЭК/Почтой России после подтверждения заказа.",
    },
    display: {
      windowTitle: "bag-charm.exe",
      availableCtaLabel: "Забрать",
      soldOutCtaLabel: "Смотреть",
    },
    sortOrder: 40,
    archiveCaption: "Aqua Moon Bag Charm",
  },
  {
    id: "bubble-ring-set",
    slug: "bubble-ring-set",
    dropId: "cosmic-drop-06",
    name: "Bubble Ring Set",
    description: "Clear blue and pink bead ring set with soft bubble shine.",
    status: PRODUCT_STATUSES.AVAILABLE,
    badges: [PRODUCT_BADGES.ONE_OF_ONE],
    price: { amount: 1200, currency: "RUB", display: "1 200 ₽" },
    stock: { quantity: 1, label: "в наличии: 1 сет", unit: "set" },
    media: {
      image: asset("drop-rings.jpg"),
      imageAlt: "Bubble Ring Set with clear blue and pink beads",
      gallery: [
        {
          image: asset("drop-rings.jpg"),
          imageAlt: "Bubble Ring Set with clear blue and pink beads",
        },
        {
          image: asset("drop-rings.png"),
          imageAlt: "Bubble Ring Set on a transparent pastel Y2K backdrop",
        },
      ],
    },
    details: {
      emotionalDescription:
        "Clear little bubbles for stacking, mixing, and making your hands look like they just clicked through a glossy portal.",
      materials: ["glass seed beads", "elastic jewelry cord", "acrylic accent beads"],
      size: "Размер: эластичный сет на 16-17 размер",
      care: ["надевать без сильного растяжения", "не хранить на солнце", "снимать перед душем"],
      delivery: "Доставка по России СДЭК/Почтой России после подтверждения заказа.",
    },
    display: {
      windowTitle: "ring-set.exe",
      availableCtaLabel: "Забрать",
      soldOutCtaLabel: "Смотреть",
    },
    sortOrder: 50,
    archiveCaption: "Bubble Ring Set",
  },
  {
    id: "shell-star-anklet",
    slug: "shell-star-anklet",
    dropId: "cosmic-drop-06",
    name: "Shell Star Anklet",
    description: "Aqua and pale yellow anklet with shell and star details.",
    status: PRODUCT_STATUSES.SOLD_OUT,
    badges: [PRODUCT_BADGES.SOLD_OUT],
    price: { amount: 2100, currency: "RUB", display: "2 100 ₽" },
    stock: { quantity: 0, label: "архив", unit: "piece" },
    media: {
      image: asset("drop-anklet.jpg"),
      imageAlt: "Shell Star Anklet with aqua and pale yellow beads",
      gallery: [
        {
          image: asset("drop-anklet.jpg"),
          imageAlt: "Shell Star Anklet with aqua and pale yellow beads",
        },
        {
          image: asset("drop-anklet.png"),
          imageAlt: "Shell Star Anklet on a transparent pastel Y2K backdrop",
        },
      ],
    },
    details: {
      emotionalDescription:
        "Beachy, shiny, and already claimed: a little shell-star artifact from the archive that can inspire a close custom vibe.",
      materials: ["glass beads", "shell accent", "acrylic star charm", "stainless steel findings"],
      size: "Длина: 22 см + удлинитель 5 см",
      care: ["не мочить в море или бассейне", "хранить отдельно", "протирать после носки сухой тканью"],
      delivery: "Доставка по России для похожего изделия обсуждается в Telegram/Instagram.",
    },
    display: {
      windowTitle: "anklet.exe",
      availableCtaLabel: "Забрать",
      soldOutCtaLabel: "Смотреть",
    },
    sortOrder: 60,
    archiveCaption: "Shell Star Anklet",
  },
];

/** @type {Drop[]} */
export const drops = [
  {
    id: "cosmic-drop-06",
    slug: "cosmic-drop-06",
    title: "Current Drop",
    eyebrow: "current folder",
    status: "current",
    releaseLabel: "cosmic drop 06",
    releasedAt: "2026-06-06",
    productIds: [
      "star-soda-necklace",
      "pixel-planet-charm",
      "chrome-bow-bracelet",
      "aqua-moon-bag-charm",
      "bubble-ring-set",
      "shell-star-anklet",
    ],
  },
];

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
  return sourceDrops.find((drop) => drop.status === "current");
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

  return currentDrop.productIds
    .map((productId) => productsById.get(productId))
    .filter(isVisibleProduct)
    .sort((first, second) => first.sortOrder - second.sortOrder);
}
