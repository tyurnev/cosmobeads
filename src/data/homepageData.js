const asset = (fileName) => `assets/${fileName}`;

export const homepageData = {
  header: {
    leftNav: [
      { label: "Дроп", href: "#drop" },
      { label: "Архив", href: "#archive" },
    ],
    rightNav: [
      { label: "О бренде", href: "#brand" },
      { label: "Доставка", href: "#delivery" },
    ],
    mobileNav: [
      { label: "Дроп", href: "#drop" },
      { label: "О бренде", href: "#brand" },
      { label: "Архив", href: "#archive" },
      { label: "Доставка", href: "#delivery" },
    ],
    social: {
      label: "IG/TG",
      href: "https://instagram.com",
    },
  },
  hero: {
    eyebrow: "cosmic drop 06",
    title: "Welcome to Cosmo Beads",
    copy: "handmade y2k bead pieces from a tiny cosmic drop",
    image: asset("hero-portal.jpg"),
    imageAlt: "Pastel glossy display of handmade bead jewelry",
    primaryCta: { label: "Смотреть дроп", href: "#drop" },
    secondaryCta: { label: "О бренде", href: "#brand" },
    portalStrip: ["drop portal", "limited handmade pieces", "new folder"],
    sideRails: {
      left: {
        title: "tiny-drop.jpg",
        image: asset("drop-phone-charm.jpg"),
        sticker: "drop",
      },
      right: {
        title: "archive.gif",
        image: asset("drop-rings.jpg"),
        chip: "1/1",
      },
    },
  },
  products: [
    {
      windowTitle: "necklace.exe",
      image: asset("drop-necklace.jpg"),
      imageAlt: "Star Soda Necklace with pastel glass beads",
      badge: { label: "1 of 1" },
      stock: { label: "в наличии: 1 шт.", tone: "in-stock" },
      name: "Star Soda Necklace",
      price: "2 900 ₽",
      cta: { label: "Забрать", href: "#final-cta" },
    },
    {
      windowTitle: "phone-charm.exe",
      image: asset("drop-phone-charm.jpg"),
      imageAlt: "Pixel Planet phone charm with blue and lime beads",
      badge: { label: "new drop", tone: "green" },
      stock: { label: "в наличии: 2 шт.", tone: "in-stock" },
      name: "Pixel Planet Charm",
      price: "1 400 ₽",
      cta: { label: "Забрать", href: "#final-cta" },
    },
    {
      windowTitle: "bracelet.exe",
      image: asset("drop-bracelet.jpg"),
      imageAlt: "Chrome Bow Bracelet with pink and lavender beads",
      badge: { label: "last piece", tone: "yellow" },
      stock: { label: "последняя", tone: "low-stock" },
      name: "Chrome Bow Bracelet",
      price: "1 800 ₽",
      cta: { label: "Забрать", href: "#final-cta" },
    },
    {
      windowTitle: "bag-charm.exe",
      image: asset("drop-bag-charm.jpg"),
      imageAlt: "Aqua Moon bag charm with peach and turquoise beads",
      badge: { label: "new drop", tone: "green" },
      stock: { label: "в наличии: 1 шт.", tone: "in-stock" },
      name: "Aqua Moon Bag Charm",
      price: "1 600 ₽",
      cta: { label: "Забрать", href: "#final-cta" },
    },
    {
      windowTitle: "ring-set.exe",
      image: asset("drop-rings.jpg"),
      imageAlt: "Bubble Ring Set with clear blue and pink beads",
      badge: { label: "1 of 1" },
      stock: { label: "в наличии: 1 сет", tone: "in-stock" },
      name: "Bubble Ring Set",
      price: "1 200 ₽",
      cta: { label: "Забрать", href: "#final-cta" },
    },
    {
      windowTitle: "anklet.exe",
      image: asset("drop-anklet.jpg"),
      imageAlt: "Shell Star Anklet with aqua and pale yellow beads",
      badge: { label: "sold out", tone: "sold" },
      stock: { label: "архив", tone: "sold-stock" },
      name: "Shell Star Anklet",
      price: "2 100 ₽",
      cta: { label: "Смотреть", href: "#archive", tone: "muted" },
      isSold: true,
    },
  ],
  brandWorld: {
    eyebrow: "brand world",
    title: "маленькая папка украшений",
    copy:
      "Cosmo Beads собирает украшения вручную маленькими дропами: прозрачные бусины, хром, звездочки и детали, которые выглядят как любимая находка из 2003.",
    windowTitle: "cosmo-world.txt",
    notes: ["limited pieces", "tiny cosmic drop", "handmade archive"],
  },
  archive: {
    eyebrow: "sold out folder",
    title: "Sold Out Archive",
    link: { label: "telegram", href: "https://t.me/" },
    items: [
      {
        image: asset("drop-anklet.jpg"),
        imageAlt: "Sold out Shell Star Anklet",
        caption: "Shell Star Anklet",
      },
      {
        image: asset("drop-bracelet.jpg"),
        imageAlt: "Sold out bracelet from archive",
        caption: "Pink Bow Bracelet",
      },
      {
        image: asset("drop-phone-charm.jpg"),
        imageAlt: "Sold out phone charm from archive",
        caption: "Planet Charm v1",
      },
      {
        image: asset("drop-rings.jpg"),
        imageAlt: "Sold out ring set from archive",
        caption: "Bubble Ring Set",
      },
    ],
    copy: {
      eyebrow: "personal archive",
      title: "прошлые изделия как коллекционные файлы",
      text: "Если хочется похожий вайб, можно написать и поймать близкую версию в новом дропе.",
      cta: { label: "Сообщить о похожем", href: "https://t.me/" },
    },
  },
  trust: [
    {
      number: "01",
      title: "ручная работа",
      text: "каждая вещь собирается вручную и проверяется перед отправкой",
    },
    {
      number: "02",
      title: "лимитированные дропы",
      text: "маленькие партии, часто в единственном экземпляре",
    },
    {
      number: "03",
      title: "доставка по России",
      text: "бережная упаковка и трек после передачи заказа",
    },
    {
      number: "04",
      title: "связь в Telegram/Instagram",
      text: "быстрые вопросы, бронь изделия и похожие запросы",
    },
  ],
  finalCta: {
    eyebrow: "cosmo cart",
    title: "Забрать изделие из дропа",
    copy: "Выбери украшение, напиши в Telegram или Instagram, и мы закрепим его за тобой.",
    cta: { label: "Смотреть дроп", href: "https://t.me/" },
  },
};
