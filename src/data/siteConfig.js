export const siteConfig = {
  brandName: "Cosmo Beads",
  contacts: {
    instagramUrl: "https://instagram.com/cosmobeads.jewelry",
    telegramUrl: "https://t.me/cosmobeadsjewelry",
    label: "IG/TG",
  },
  meta: {
    defaultTitle: "Cosmo Beads - handmade Y2K bead pieces",
    defaultDescription:
      "Cosmo Beads - handmade Y2K bead jewelry and accessories from a tiny cosmic drop.",
  },
  deliveryText: "Доставка по России СДЭК/Почтой России после подтверждения заказа.",
  orderSuccessText:
    "Заявка отправлена. Мы свяжемся с тобой в Telegram или Instagram, подтвердим наличие, оплату и доставку.",
  orderContactExplanation:
    "После заявки мы подтвердим наличие, доставку и оплату вручную в Telegram или Instagram.",
};

export const SITE_CONFIG_ENDPOINT = "/api/site-config/";

export function setSiteConfig(nextConfig = {}) {
  siteConfig.brandName = nextConfig.brandName ?? siteConfig.brandName;

  Object.assign(siteConfig.contacts, nextConfig.contacts ?? {});
  Object.assign(siteConfig.meta, nextConfig.meta ?? {});

  siteConfig.deliveryText = nextConfig.deliveryText ?? siteConfig.deliveryText;
  siteConfig.orderSuccessText = nextConfig.orderSuccessText ?? siteConfig.orderSuccessText;
  siteConfig.orderContactExplanation = nextConfig.orderContactExplanation ?? siteConfig.orderContactExplanation;

  return siteConfig;
}

export async function loadSiteConfig({ endpoint = SITE_CONFIG_ENDPOINT, fetcher = globalThis.fetch } = {}) {
  if (typeof fetcher !== "function") {
    return siteConfig;
  }

  const response = await fetcher(endpoint, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Site config could not be loaded.");
  }

  const payload = await response.json();
  return setSiteConfig(payload.siteConfig ?? payload);
}
