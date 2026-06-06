import { toArchiveItem, toProductPreviewCard } from "./productDisplay.js";
import { getCurrentDrop, getCurrentDropProducts, getSoldOutProducts } from "./products.js";
import { siteConfig } from "./siteConfig.js";

const asset = (fileName) => `/assets/${fileName}`;

export function getHomepageData() {
  const currentDrop = getCurrentDrop();
  const currentDropProducts = getCurrentDropProducts();
  const soldOutProducts = getSoldOutProducts();

  return {
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
        label: siteConfig.contacts.label,
        href: siteConfig.contacts.instagramUrl,
      },
    },
    hero: {
      eyebrow: currentDrop?.releaseLabel ?? "cosmic drop 06",
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
    currentDrop,
    products: currentDropProducts.map(toProductPreviewCard),
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
      link: { label: "telegram", href: siteConfig.contacts.telegramUrl },
      items: soldOutProducts.map(toArchiveItem),
      copy: {
        eyebrow: "personal archive",
        title: "прошлые изделия как коллекционные файлы",
        text: "Если хочется похожий вайб, можно написать и поймать близкую версию в новом дропе.",
        cta: { label: "Сообщить о похожем", href: siteConfig.contacts.telegramUrl },
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
        text: siteConfig.deliveryText,
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
      copy: siteConfig.orderContactExplanation,
      cta: { label: "Смотреть дроп", href: siteConfig.contacts.telegramUrl },
    },
  };
}
