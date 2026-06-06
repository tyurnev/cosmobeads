// @ts-check

export const CHECKOUT_SELECTION_STORAGE_KEY = "cosmobeads.checkoutSelection";
export const ORDER_REQUESTS_STORAGE_KEY = "cosmobeads.orderRequests";

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readJson(key, fallback) {
  const storage = getStorage();

  if (!storage) {
    return fallback;
  }

  try {
    const rawValue = storage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  storage.setItem(key, JSON.stringify(value));
  return true;
}

export function selectProductForCheckout(product) {
  return writeJson(CHECKOUT_SELECTION_STORAGE_KEY, {
    productId: product.id,
    slug: product.slug,
    selectedAt: new Date().toISOString(),
  });
}

export function getSelectedCheckoutProductSlug() {
  const selectedProduct = readJson(CHECKOUT_SELECTION_STORAGE_KEY, null);
  return selectedProduct?.slug ?? "";
}

export function getOrderRequests() {
  const orderRequests = readJson(ORDER_REQUESTS_STORAGE_KEY, []);
  return Array.isArray(orderRequests) ? orderRequests : [];
}

function createOrderId() {
  return `cb-${Date.now().toString(36)}`;
}

export function createOrderRequest({ product, fields }) {
  const orderRequest = {
    id: createOrderId(),
    status: "new",
    source: "local_mock",
    createdAt: new Date().toISOString(),
    product: {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.media.image,
    },
    customer: {
      name: fields.name,
      phone: fields.phone,
      social: fields.social,
      city: fields.city,
      delivery: fields.delivery,
      comment: fields.comment,
    },
  };

  return {
    ...orderRequest,
    telegramNotification: prepareTelegramNotificationPayload(orderRequest),
  };
}

export function saveOrderRequest(orderRequest) {
  const orderRequests = getOrderRequests();
  orderRequests.unshift(orderRequest);

  return writeJson(ORDER_REQUESTS_STORAGE_KEY, orderRequests);
}

export function prepareTelegramNotificationPayload(orderRequest) {
  const lines = [
    "Новая заявка Cosmo Beads",
    `Номер: ${orderRequest.id}`,
    `Изделие: ${orderRequest.product.name}`,
    `Цена: ${orderRequest.product.price.display}`,
    `Имя: ${orderRequest.customer.name}`,
    `Телефон: ${orderRequest.customer.phone}`,
    `Telegram/Instagram: ${orderRequest.customer.social}`,
    `Город: ${orderRequest.customer.city}`,
    `Доставка/адрес: ${orderRequest.customer.delivery}`,
  ];

  if (orderRequest.customer.comment) {
    lines.push(`Комментарий: ${orderRequest.customer.comment}`);
  }

  return {
    channel: "telegram",
    ready: false,
    text: lines.join("\n"),
  };
}

export async function sendTelegramNotification(orderRequest) {
  return {
    ok: false,
    skipped: true,
    reason: "Telegram notification is prepared but not connected yet.",
    payload: orderRequest.telegramNotification,
  };
}
